# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM plone/frontend-builder:${VOLTO_VERSION} AS builder

COPY --chown=node packages/volto-ploneconf /app/packages/volto-ploneconf
COPY --chown=node volto.config.js /app/
COPY --chown=node package.json /app/package.json.temp

RUN --mount=type=cache,id=pnpm,target=/app/.pnpm-store,uid=1000 <<EOT
     set -e
     python3 -c "import json; data = json.load(open('package.json.temp')); deps = data['dependencies']; data['dependencies'].update(deps); json.dump(data, open('package.json', 'w'), indent=2)"
     rm package.json.temp
     pnpm install && pnpm build:deps
     pnpm build
     pnpm install --prod
EOT

FROM plone/frontend-prod-config:${VOLTO_VERSION}

LABEL maintainer="Plone Foundation <collective@plone.org>" \
      org.label-schema.name="ghcr.io/plone/ploneconf-2024-frontend" \
      org.label-schema.description="Project Title frontend image." \
      org.label-schema.vendor="Plone Foundation"

COPY --from=builder /app/ /app/

RUN <<EOT
    set -e
    corepack enable pnpm
    corepack use pnpm@9.1.1
    corepack prepare pnpm@9.1.1 --activate
EOT