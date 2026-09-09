# Staging deployment

How code gets from your machine to the EC2 instance, and what to run when
something needs doing by hand.

## The normal path

Push to `develop`. That is the whole thing.

```
push to develop
  └─ .github/workflows/staging.yml
       ├─ builds nginx + backend images
       ├─ pushes both to ECR, tagged with the commit SHA (full and short)
       └─ aws ssm send-command → runs deploy.sh on the instance
            ├─ fetches .env from SSM Parameter Store
            ├─ pins the image tags for this build
            ├─ logs in to ECR
            └─ docker compose pull && up -d
```

Nothing is built on the instance. It only pulls. The workflow log shows
`deploy.sh`'s own output, so a failed deploy says why in the run.

## The two scripts

|            | `push.sh`                        | `deploy.sh`                      |
| ---------- | -------------------------------- | -------------------------------- |
| Runs on    | your machine                     | the EC2 instance                 |
| Moves      | 2 files over SSH                 | container images from ECR        |
| Needs      | the `.pem` key                   | the instance IAM role            |
| How often  | rarely — see below               | every release (usually via CI)   |

`push.sh` sets up *how to run things*. `deploy.sh` runs *a specific build*.

Both live in `scripts/staging/`. `deploy.sh` is copied to the instance and runs
there as `~/app/deploy.sh`; `push.sh` only ever runs on your machine.

### `push.sh` — copy the two files the instance needs

```bash
./scripts/staging/push.sh                 # resolves the IP from terraform output
./scripts/staging/push.sh 13.212.118.91   # or pass it explicitly
```

Run it from anywhere — it resolves paths relative to itself.

Copies `docker-compose.staging.yml` and `scripts/staging/deploy.sh` to
`/home/ec2-user/app/`. The instance needs no source code, because the image is
the artifact.

Run it when:

- setting up a new instance for the first time
- `docker-compose.staging.yml` or `deploy.sh` has changed
- after `terraform destroy` + `apply` — a fresh box has neither file

Ordinary code changes never require it.

Resolving the IP uses `terraform output`, which reads state from S3 and so needs
valid AWS credentials. If your SSO session has expired, pass the address
directly instead.

### `deploy.sh` — deploy a specific build

```bash
ssh -i infra/environments/staging/eri-pharmacy-staging.pem ec2-user@<ip>
cd ~/app && ./deploy.sh <commit-sha>
```

Takes either the full 40-character SHA or the 7-character short form — the
workflow tags images with both. CI normally runs this for you; do it by hand to
roll back, or when the workflow is broken.

It rewrites `.env` from Parameter Store on every run, so rotating a secret takes
effect on the next deploy with nothing to clean up.

## Rolling back

Deploy an earlier SHA:

```bash
cd ~/app && ./deploy.sh <older-sha>
```

Both images carry the same tag, so one SHA identifies one deployable pair.
ECR keeps the 10 most recent images per repository, which is the window.

Image tags are immutable, so a tag always refers to the same build. This is why
nothing is ever tagged `latest` — a moving tag cannot be rolled back to.

## Changing configuration

Secrets and environment live in SSM Parameter Store, not in any file:

```bash
aws ssm put-parameter --region ap-southeast-1 \
  --name /eri-pharmacy/staging/env --type SecureString \
  --value file://.env --overwrite
```

Then redeploy — `deploy.sh` refetches it. Do not edit `.env` on the instance; it
is overwritten every run.

## Bootstrapping a fresh instance

After `terraform apply` creates a new box:

```bash
# on the instance
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
# log out and back in for the docker group to apply
```

```bash
# from your machine
./scripts/staging/push.sh
```

Then push to `develop`, or run `deploy.sh` by hand.

This is still manual. Moving it into Terraform `user_data` would make a rebuilt
instance configure itself.

## Getting a shell

The instance role includes `AmazonSSMManagedInstanceCore`, so Session Manager
works without SSH:

```bash
aws ssm start-session --target $(cd infra/environments/staging && terraform output -raw ec2_instance_id)
```

SSH with the `.pem` still works as a fallback.

## When something breaks

Where it stops tells you what is wrong. `deploy.sh` uses `set -euo pipefail`, so
it halts at the first failure.

| Fails at                        | Cause                                              |
| ------------------------------- | -------------------------------------------------- |
| `sts get-caller-identity`       | Instance profile not attached, or IMDS hop limit    |
| SSM fetch                       | Policy path/region mismatch, or missing `kms:Decrypt` |
| ECR login                       | Instance role missing the ECR pull policy           |
| `pull` — AccessDenied           | Repository ARN scope wrong                          |
| `pull` — `manifest unknown`     | That SHA was never pushed; check the workflow run    |
| compose — "variable is not set" | `.env` has no image tags — the append failed         |
| Containers restarting           | Past the deploy; check `logs backend`                |

Confirm the running containers came from ECR rather than an old local build:

```bash
docker compose -f docker-compose.staging.yml images
```

The `Repository` column should show the full
`<account>.dkr.ecr.ap-southeast-1.amazonaws.com/...` path.

## Known gaps

- **No migrations.** The schema is created by `createMedicinesTableIfNotExists()`
  at backend boot, which is `CREATE TABLE IF NOT EXISTS` and therefore does
  nothing once the table exists. Adding a column needs a manual `ALTER TABLE`.
- **No TLS.** nginx switches itself to HTTPS once a certificate exists for
  `SERVER_NAME`; that needs a domain pointing at the Elastic IP first. See the
  notes at the bottom of `docker-compose.staging.yml`.
- **Bootstrap is manual.** Docker install and `push.sh` are not in `user_data`.
