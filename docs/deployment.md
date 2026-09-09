# Deploying Eri Pharmacy

Everything from an empty AWS account to a running environment, then what to run
day to day. Two environments exist, provisioned identically.

|                    | staging                          | production                          |
| ------------------ | -------------------------------- | ----------------------------------- |
| Branch             | `develop`                        | `main`                              |
| Terraform          | `infra/environments/staging`     | `infra/environments/production`     |
| Compose file       | `docker-compose.staging.yml`     | `docker-compose.production.yml`     |
| Scripts            | `scripts/staging/`               | `scripts/production/`               |
| GitHub variable    | `AWS_ROLE_ARN_STAGING`           | `AWS_ROLE_ARN_PRODUCTION`           |
| Config in SSM      | `/eri-pharmacy/staging/env`      | `/eri-pharmacy/production/env`      |
| ECR repositories   | `eri-pharmacy-staging-{nginx,backend}` | `eri-pharmacy-production-{nginx,backend}` |
| Instance `Name` tag| `eri-pharmacy-staging-ec2`       | `eri-pharmacy-production-ec2`       |
| VPC CIDR           | `10.0.0.0/16`                    | `10.1.0.0/16`                       |

Region is `ap-southeast-1` throughout. Substitute `<env>` below with `staging`
or `production`.

## How a release flows

```
push to develop / main
  └─ .github/workflows/<env>.yml
       ├─ job: build
       │    builds nginx + backend images
       │    pushes to ECR, tagged with the full and short commit SHA
       └─ job: deploy   (needs: build)
            aws ssm send-command → runs deploy.sh on the instance
                 ├─ fetches .env from SSM Parameter Store
                 ├─ pins the image tags for this build
                 ├─ logs in to ECR, pulls
                 ├─ runs database migrations
                 └─ docker compose up -d
```

Nothing is built on the instance and no source code is copied to it. The image
is the artifact; the compose file only names which one to run.

---

# Provisioning from scratch

## Prerequisites

- Terraform ≥ 1.16
- AWS CLI v2, with credentials exported (see `decisions.md` — this project uses
  environment variables rather than profiles)
- An EC2 key pair per environment, created in the console
- Docker (only for local development)

Credentials expire. `ExpiredToken` from any `terraform` or `aws` command means
re-export them from the access portal, nothing more.

## 1. Account-wide setup — once per AWS account

**State bucket.** Terraform cannot create the bucket that holds its own state,
so this is deliberately outside Terraform. It already exists as
`eri-pharmacy-tfstate-225076308901-ap-southeast-1-an`. To recreate it:

```bash
aws s3api create-bucket --bucket <name> --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1
aws s3api put-bucket-versioning --bucket <name> \
  --versioning-configuration Status=Enabled
```

Versioning matters more than encryption here — it is the only way to recover
state after a corrupted apply.

**Shared resources.** `infra/shared` holds the GitHub OIDC provider. IAM allows
exactly one provider per URL per account, so it cannot live in either
environment. Apply it before any environment:

```bash
cd infra/shared && terraform init && terraform apply
```

Both environments read it with a data source. Destroying `infra/shared` breaks
GitHub Actions for both.

## 2. Provision an environment

```bash
cd infra/environments/<env>
cp terraform.tfvars.example terraform.tfvars
```

Fill in the two required variables — `ami` (Amazon Linux 2023 **in
ap-southeast-1**; IDs are region-specific) and `key_name`.

```bash
terraform init
terraform plan
terraform apply
```

This creates a VPC, public subnet, internet gateway, security group, EC2
instance with an Elastic IP, an instance role, two ECR repositories, and the
GitHub Actions role.

Useful outputs:

```bash
terraform output ec2_public_ip
terraform output ec2_instance_id
terraform output github_actions_role_arn
```

## 3. Wire GitHub

```bash
gh variable set AWS_ROLE_ARN_<ENV> \
  --body "$(cd infra/environments/<env> && terraform output -raw github_actions_role_arn)"
```

Or **Settings → Secrets and variables → Actions → Variables → New repository
variable**. Use the **Variables** tab, not Secrets: a role ARN is an address,
not a credential, and only a correctly scoped OIDC token can assume it.

It must be a *repository* variable. A variable scoped to a GitHub Environment
is invisible to jobs that do not declare `environment:`, and the workflow then
fails with "Could not load credentials" — see Troubleshooting.

## 4. Store the environment's configuration

The whole `.env` lives as one `SecureString` in Parameter Store. Build it so
the password cannot drift between the two places it appears:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<generated>
POSTGRES_DB=eri_pharmacy
POSTGRES_CONNECTION=postgresql://postgres:<the same value>@db:5432/eri_pharmacy
SERVER_NAME=
```

```bash
aws ssm put-parameter --region ap-southeast-1 \
  --name /eri-pharmacy/<env>/env --type SecureString \
  --value file://$HOME/env.<env>
```

Add `--overwrite` when updating. Delete the local file afterwards — SSM is the
authoritative copy and `deploy.sh` refetches it every run.

Do **not** put `NGINX_IMAGE` or `BACKEND_IMAGE` here; `deploy.sh` appends those
from the tag it is given.

Leave `SERVER_NAME` empty until a domain exists. nginx then serves a catch-all
on plain HTTP, reachable by IP.

## 5. Bootstrap the instance

```bash
chmod 400 infra/environments/<env>/eri-pharmacy-<env>.pem
cd infra/environments/<env>
ssh -i eri-pharmacy-<env>.pem ec2-user@$(terraform output -raw ec2_public_ip)
```

On the box:

```bash
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
sudo mkdir -p /srv/acme
```

Log out and back in — the `docker` group is not in your session until you
reconnect. Verify with `id -nG` and `docker compose version`.

This step is not in `user_data`, so a rebuilt instance needs it again.

## 6. Copy the two files the instance needs

From your machine, at the repository root:

```bash
./scripts/<env>/push.sh
```

Copies `docker-compose.<env>.yml` and `scripts/<env>/deploy.sh` to
`/home/ec2-user/app/`. No source code — the instance only pulls images.

## 7. First deploy

Push to the environment's branch, or run the workflow manually. The workflow
builds, pushes, and deploys.

To deploy by hand instead:

```bash
cd ~/app && ./deploy.sh <commit-sha>
```

Either the full 40-character SHA or the 7-character form; images carry both.

---

# Everyday work

## Two cadences

| What changed                                   | What you do                        |
| ---------------------------------------------- | ---------------------------------- |
| React or Express code                          | push to the branch — fully automatic |
| `docker-compose.<env>.yml` or `deploy.sh`      | `./scripts/<env>/push.sh` first     |

The second is rare and easy to forget. A stale `deploy.sh` does not error — it
just silently does less than the current one. If migrations or config fetching
seem not to happen, check this first.

## Migrations

Schema is owned by `backend/migrations/`, applied by node-pg-migrate. `deploy.sh`
runs them after pulling images and before starting containers, so new code never
sees an old schema. In local development `npm run start` migrates first.

Adding one:

```bash
cd backend && npm run migrate:create -- add-expiry-to-medicines
```

That writes a timestamped `.sql` file with `-- Up Migration` and
`-- Down Migration` sections. Fill it in, commit, push.

Run them manually if needed:

```bash
cd ~/app && docker compose -f docker-compose.<env>.yml run --rm backend npm run migrate
```

## Rolling back

```bash
cd ~/app && ./deploy.sh <older-sha>
```

Both images carry the same tag, so one SHA is one deployable pair. ECR keeps a
limited number of images per repository — that window is your rollback range.
Tags are immutable, so a tag always means the same build; nothing is ever
tagged `latest`, because a moving tag cannot be rolled back to.

Rolling back **code** does not roll back a **migration**. If a release included
a destructive schema change, deploying an older image leaves the new schema in
place. Prefer additive migrations.

## Changing configuration or secrets

Update the SSM parameter, then redeploy. Never edit `.env` on the instance — it
is overwritten on every deploy.

```bash
aws ssm put-parameter --region ap-southeast-1 --name /eri-pharmacy/<env>/env \
  --type SecureString --value file://$HOME/env.<env> --overwrite
```

Changing `POSTGRES_PASSWORD` on an existing database needs an extra step — see
Troubleshooting.

## Getting a shell

```bash
aws ssm start-session --target $(cd infra/environments/<env> && terraform output -raw ec2_instance_id)
```

No SSH key, no port 22. SSH with the `.pem` still works as a fallback.

## Enabling TLS

Requires a domain with an A record pointing at the environment's Elastic IP.
Certificates are issued for names, never IP addresses.

1. Point DNS at the Elastic IP
2. Set `SERVER_NAME` in the SSM parameter, redeploy
3. On the instance:

```bash
sudo dnf install -y certbot
sudo certbot certonly --webroot -w /srv/acme -d <your-domain>
docker compose -f docker-compose.<env>.yml restart nginx
```

The nginx entrypoint detects the certificate and switches to the HTTPS config
by itself. Add a reload hook so renewals take effect:

```bash
sudo certbot renew --deploy-hook \
  "docker compose -f /home/ec2-user/app/docker-compose.<env>.yml exec nginx nginx -s reload"
```

Do not set `SERVER_NAME` to a name that does not resolve to the instance —
repeated failed challenges hit a Let's Encrypt limit of 5 per hostname per hour.

---

# Troubleshooting

## Workflow: "Could not load credentials from any providers"

Look at the resolved `with:` block in the log. If `role-to-assume` is absent,
the variable resolved to empty — GitHub drops empty inputs. The name in the
workflow does not match a repository variable, or the variable is scoped to a
GitHub Environment the job does not declare.

## Workflow: "Not authorized to perform sts:AssumeRoleWithWebIdentity"

The OIDC token's `sub` claim does not match the role's trust policy. Causes:
running from a branch other than the one in `var.github_branch`; a pull request
(whose `sub` is `repo:owner/name:pull_request`, not a ref); or a job that
declares `environment:` without the trust policy carrying the matching
`:environment:` form.

## Deploy: `manifest unknown` / `Requested image not found`

That tag was never pushed. Check the workflow run actually succeeded, and that
the SHA is one of the two forms the build tagged.

## Deploy: `InvalidInstanceId` from `ssm send-command`

The instance is not registered with SSM. Usually the agent started before the
role had `AmazonSSMManagedInstanceCore`. On the box:

```bash
sudo systemctl restart amazon-ssm-agent
```

Then from your machine, `aws ssm describe-instance-information` should list it
as `Online`. If not, reboot the instance.

## API returns 500: `password authentication failed for user "postgres"`

The password exists in **two** places and both must agree:

```
POSTGRES_PASSWORD=X
POSTGRES_CONNECTION=postgresql://postgres:X@db:5432/eri_pharmacy
```

If they match and it still fails, the database was initialized with a different
one. `POSTGRES_PASSWORD` is read **only when Postgres initializes an empty data
directory** — editing it later changes nothing, because the password lives in
the database's own catalog inside the volume.

```bash
docker compose -f docker-compose.<env>.yml logs db | head -5
```

`Skipping initialization` confirms the volume predates the change. Either match
the connection string to what the volume already has, or:

```bash
# keeps data
docker compose -f docker-compose.<env>.yml exec db \
  psql -U postgres -c "ALTER USER postgres WITH PASSWORD '<value from .env>';"

# destroys data
docker compose -f docker-compose.<env>.yml down -v && ./deploy.sh <sha>
```

## API returns 500: `relation "medicines" does not exist`

Migrations have not run. Most often the instance's `deploy.sh` predates the
migration step:

```bash
grep -c migrate ~/app/deploy.sh    # 0 means it is stale
```

Fix by running `./scripts/<env>/push.sh` from your machine, then redeploy. To
unblock immediately:

```bash
cd ~/app && docker compose -f docker-compose.<env>.yml run --rm backend npm run migrate
```

## Containers run but serve the wrong build

Confirm they came from ECR rather than an old local build:

```bash
docker compose -f docker-compose.<env>.yml images
```

The `Repository` column must show the full
`225076308901.dkr.ecr.ap-southeast-1.amazonaws.com/...` path.

## `Permissions 0644 for '...pem' are too open`

```bash
chmod 400 infra/environments/<env>/eri-pharmacy-<env>.pem
```

## Build fails with no clear error

On a `t2.micro`, `vite build` can be OOM-killed — check `dmesg | tail`. This
only affects builds run on the instance; CI builds on a larger runner. Add swap
if you need to build locally on the box.

---

# Known gaps

- **Instance bootstrap is manual.** Docker installation and `push.sh` are not in
  Terraform `user_data`, so a rebuilt instance needs both by hand.
- **No TLS yet.** The nginx configuration is ready; only a domain is missing.
- **Production auto-deploys on every push to `main`** with no approval. The
  workflow's header comment describes how to add a gate.
- **`infra/shared` must be applied before either environment**, and destroying
  it breaks GitHub Actions for both.
- **Port 22 is open to `0.0.0.0/0`** in both security groups. SSM Session
  Manager works, so this can be narrowed or closed.
