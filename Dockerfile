FROM registry.access.redhat.com/ubi9/nodejs-22:9.5

# Create app directory
WORKDIR /servicemap-ui

USER root

RUN chown -R default:root /servicemap-ui

# Install app dependencies
COPY --chown=default:root --chmod=444 package.json package-lock.json /servicemap-ui/

RUN npm ci --legacy-peer-deps

COPY --chown=default:root . /servicemap-ui/

USER default

RUN npm run build

USER root

RUN chown root:root -R /servicemap-ui  && chmod -R 755 /servicemap-ui

USER default

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 2048
CMD [ "node", "dist/index.js" ]
