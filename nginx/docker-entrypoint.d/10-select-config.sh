#!/bin/sh
# Runs before nginx starts (the official image executes /docker-entrypoint.d/*.sh).
#
# nginx refuses to start when ssl_certificate points at a file that does not
# exist, which is the usual bootstrap deadlock: you cannot serve HTTPS before
# certbot has issued, and certbot cannot issue until something answers on :80.
# This picks the HTTP config until a certificate appears, then the HTTPS one.
#
# After issuing a certificate:  docker compose restart nginx
set -e

SERVER_NAME="${SERVER_NAME:-_}"
CERT="/etc/letsencrypt/live/${SERVER_NAME}/fullchain.pem"

if [ "$SERVER_NAME" != "_" ] && [ -f "$CERT" ]; then
    SRC=/etc/nginx/available/tls.conf.template
    echo "[entrypoint] certificate found for ${SERVER_NAME} — serving HTTPS"
else
    SRC=/etc/nginx/available/http.conf.template
    echo "[entrypoint] no certificate for ${SERVER_NAME} — serving plain HTTP"
fi

sed "s|__SERVER_NAME__|${SERVER_NAME}|g" "$SRC" > /etc/nginx/conf.d/default.conf
