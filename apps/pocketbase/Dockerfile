FROM alpine:3.19 AS builder
ARG PB_VERSION=0.27.0
RUN apk add --no-cache curl unzip
RUN curl -L -o pocketbase.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip"
RUN unzip pocketbase.zip && chmod +x pocketbase

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
COPY --from=builder /pocketbase /usr/local/bin/pocketbase
COPY pb_migrations/ /pb_migrations/
COPY pb_hooks/ /pb_hooks/
RUN mkdir -p /pb_data
EXPOSE 8090
ENV BUILD_TS 2026-06-07T12:00:00Z
COPY --chmod=755 <<"EOF" /usr/local/bin/start.sh
#!/bin/sh
set -e
pocketbase superuser upsert "admin@bavet.local" "Admin123!" --dir=/pb_data 2>/dev/null || true
exec pocketbase serve --http=0.0.0.0:${PORT:-8090} --dir=/pb_data --hooksDir=/pb_hooks --migrationsDir=/pb_migrations
EOF
CMD ["/usr/local/bin/start.sh"]
