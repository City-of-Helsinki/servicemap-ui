# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-22 AS appbase
# ===============================================

WORKDIR /servicemap-ui

USER root

RUN curl --fail --silent --proto '=https' --tlsv1.2 https://dl.yarnpkg.com/rpm/yarn.repo \
  --output /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

# Official image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL=warn

ENV YARN_VERSION=1.22.19
RUN yarn policies set-version $YARN_VERSION

RUN chown -R default:root /servicemap-ui

USER default

COPY --chown=default:root package.json yarn.lock /servicemap-ui/

RUN yarn config set network-timeout 300000
RUN yarn install --frozen-lockfile --ignore-scripts && yarn cache clean --force

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY --chown=default:root . /servicemap-ui/

# =============================
FROM appbase AS development
# =============================

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

CMD ["yarn", "start"]

# ===================================
FROM appbase AS staticbuilder
# ===================================

ARG NODE_OPTIONS=--max-old-space-size=4096
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN yarn build

# =============================
FROM appbase AS production
# =============================

# Copy only the built server output
COPY --from=staticbuilder --chown=default:root /servicemap-ui/dist /servicemap-ui/dist

EXPOSE 2048
CMD ["node", "dist/index.js"]

# =============================
FROM registry.access.redhat.com/ubi9/nginx-122 AS nginx
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static assets from the build for Nginx to serve directly
COPY --from=staticbuilder /servicemap-ui/dist/src /usr/share/nginx/html
COPY --from=staticbuilder /servicemap-ui/dist/assets /usr/share/nginx/html/assets

# Copy nginx config
COPY .prod/nginx.conf /etc/nginx/nginx.conf

USER 1001

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 8080
