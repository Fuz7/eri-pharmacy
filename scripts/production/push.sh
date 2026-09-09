#!/usr/bin/env bash
#
# Copy the two files the production instance needs. Run from your machine.
#
#   ./scripts/production/push.sh <elastic-ip>
#   EC2_HOST=1.2.3.4 ./scripts/production/push.sh
#
# Works from any directory — paths are resolved relative to this file.
#
# Since the instance pulls images from ECR instead of building, it needs no
# source code — only the compose file and the deploy script. Run this whenever
# either of those two changes, which is rare; ordinary code changes go out
# through CI and ./deploy.sh <sha> on the box.

set -euo pipefail

# scripts/production/ -> repository root, so the relative paths below hold no
# matter where this is invoked from.
cd "$(dirname "$(readlink -f "$0")")/../.."

INFRA_DIR="infra/environments/production"

# Prefer an explicit host, then EC2_HOST, then ask Terraform. The Terraform
# lookup needs valid AWS credentials because state lives in S3 — if your SSO
# session has expired it fails here rather than hanging on ssh.
HOST="${1:-${EC2_HOST:-}}"
if [ -z "$HOST" ]; then
  HOST="$(terraform -chdir="$INFRA_DIR" output -raw ec2_public_ip 2>/dev/null || true)"
fi
if [ -z "$HOST" ]; then
  echo "could not determine the instance address" >&2
  echo "  pass it:      $0 <elastic-ip>" >&2
  echo "  or refresh:   export your AWS credentials, then retry" >&2
  exit 1
fi

echo "==> ${HOST}"

KEY="${EC2_KEY:-infra/environments/production/eri-pharmacy-production.pem}"
DEST="/home/ec2-user/app"

[ -f "$KEY" ] || { echo "ssh key not found: $KEY" >&2; exit 1; }

ssh -i "$KEY" "ec2-user@${HOST}" "mkdir -p ${DEST}"
scp -i "$KEY" docker-compose.production.yml scripts/production/deploy.sh "ec2-user@${HOST}:${DEST}/"
# scp applies the remote umask rather than preserving the mode.
ssh -i "$KEY" "ec2-user@${HOST}" "chmod +x ${DEST}/deploy.sh"

echo
echo "Copied to ${DEST}. Next:"
echo "  ssh -i ${KEY} ec2-user@${HOST}"
echo "  cd ~/app && ./deploy.sh <commit-sha>"
