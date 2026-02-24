FROM registry.access.redhat.com/ubi9/nodejs-22:9.5

# Create app directory
WORKDIR /servicemap-ui

USER root

RUN curl --fail --silent --proto '=https' --tlsv1.2 https://dl.yarnpkg.com/rpm/yarn.repo \
  --output /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

RUN chown -R default:root /servicemap-ui

# Install app dependencies
COPY --chown=default:root --chmod=444 package.json yarn.lock /servicemap-ui/

# Install dependencies
RUN yarn install --frozen-lockfile --ignore-scripts && yarn cache clean --force

COPY --chown=default:root . /servicemap-ui/

USER default

ARG NODE_OPTIONS=--max-old-space-size=4096
ENV NODE_OPTIONS=$NODE_OPTIONS

RUN yarn build

USER root

RUN chown root:root -R /servicemap-ui  && chmod -R 755 /servicemap-ui

USER default

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 2048
CMD [ "node", "dist/index.js" ]
