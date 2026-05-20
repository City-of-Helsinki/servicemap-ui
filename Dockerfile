# ============================================================
# STAGE 1: Install dependencies
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base AS appbase

WORKDIR /servicemap-ui

COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml index.html vite.config.js .eslintrc.json ./
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root ./client ./client
COPY --chown=default:root ./config ./config
COPY --chown=default:root ./server ./server
COPY --chown=default:root ./src ./src

# corepack in the base image will automatically use the version of pnpm
# defined in your package.json 'packageManager' field if present.
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

# ============================================================
# STAGE 2: Build
# ============================================================
FROM appbase AS builder

#ARG REACT_APP_SENTRY_RELEASE
ARG NODE_OPTIONS=--max-old-space-size=4096
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN pnpm build

# ============================================================
# STAGE 3: Production Runtime
# ============================================================
# This app is SSR (Express + React server-side rendering) — it requires a
# Node runtime, not a static file server like nginx.
FROM registry.access.redhat.com/ubi9/nodejs-22-minimal AS production

WORKDIR /servicemap-ui

# Copy built server bundle and client assets
COPY --from=builder --chown=1001:root /servicemap-ui/dist ./dist

# Copy node_modules for externalized runtime dependencies (react, react-dom, etc.)
COPY --from=appbase --chown=1001:root /servicemap-ui/node_modules ./node_modules

#ARG REACT_APP_SENTRY_RELEASE
ENV NODE_ENV=production

USER 1001

EXPOSE 2048

CMD ["node", "dist"]
