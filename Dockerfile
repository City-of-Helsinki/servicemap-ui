# ============================================================
# STAGE 1: Install dependencies
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-22-pnpm-builder-base AS appbase

COPY --chown=default:root package.json pnpm-lock.yaml pnpm-workspace.yaml index.html vite.config.js .eslintrc.json .env ./
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root ./client ./client
COPY --chown=default:root ./config ./config
COPY --chown=default:root ./server ./server
COPY --chown=default:root ./public ./public
COPY --chown=default:root ./src ./src

# corepack in the base image will automatically use the version of pnpm
# defined in your package.json 'packageManager' field if present.
RUN pnpm install --frozen-lockfile --ignore-scripts && pnpm store prune

COPY --chown=default:root ./.git ./.git
RUN pnpm update-runtime-env
# ============================================================
# STAGE 2: Build
# ============================================================
FROM appbase AS builder

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
COPY --from=builder --chown=1001:root /app/dist ./dist

# Copy scripts needed at container startup (update-runtime-env.js)
COPY --from=appbase --chown=1001:root /app/scripts ./scripts

# Copy node_modules for externalized runtime dependencies (react, react-dom, etc.)
COPY --from=appbase --chown=1001:root /app/node_modules ./node_modules

ENV NODE_ENV=production

USER 1001

EXPOSE 8080

CMD ["node", "dist"]
