#!/usr/bin/env bash
#
# Deploy a specific build to the production instance. Run ON the EC2 box, from the
# directory holding docker-compose.production.yml.
#
#   ./deploy.sh <commit-sha>
#
# The tag is a commit SHA produced by .github/workflows/production.yml. Both images
# carry the same tag, so one SHA identifies one deployable pair — which is also
# what makes rollback just "run this again with an older SHA".
#
# Nothing is built here. The instance only pulls.

set -euo pipefail

TAG="${1:-}"
if [ -z "$TAG" ]; then
  echo "usage: $0 <commit-sha>" >&2
  echo "  find tags in the ECR console, or from a workflow run summary" >&2
  exit 1
fi

# Run from the script's own directory, so .env and the compose file are always
# written and read next to it regardless of where you invoked it from.
cd "$(dirname "$(readlink -f "$0")")"

REGION="${AWS_REGION:-ap-southeast-1}"
PROJECT="eri-pharmacy-production"
COMPOSE_FILE="docker-compose.production.yml"

# Derived rather than hardcoded, so this script works unchanged in another
# account. Also doubles as an early check that the instance role is working.
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

echo "==> Fetching configuration from SSM"
# Rewritten from scratch every deploy, so rotating a secret in Parameter Store
# takes effect on the next run with nothing to clean up.
aws ssm get-parameter \
  --region "$REGION" \
  --name "/eri-pharmacy/production/env" \
  --with-decryption \
  --query Parameter.Value \
  --output text > .env

echo "==> Pinning images to ${TAG}"
{
  echo ""
  echo "# Written by deploy.sh — do not edit; changes are overwritten."
  echo "NGINX_IMAGE=${REGISTRY}/${PROJECT}-nginx:${TAG}"
  echo "BACKEND_IMAGE=${REGISTRY}/${PROJECT}-backend:${TAG}"
} >> .env

echo "==> Logging in to ECR"
# The token lasts 12 hours, so this runs every deploy rather than once.
aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "$REGISTRY"

echo "==> Pulling images"
docker compose -f "$COMPOSE_FILE" pull

echo "==> Starting"
docker compose -f "$COMPOSE_FILE" up -d

echo "==> Removing images no longer referenced"
docker image prune -f >/dev/null

echo
docker compose -f "$COMPOSE_FILE" ps
echo
echo "Deployed ${TAG}"
