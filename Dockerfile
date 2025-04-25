FROM registry.access.redhat.com/ubi9/nodejs-22

# Create app directory
WORKDIR /servicemap-ui

USER root

RUN chown -R default:root /servicemap-ui

# Install app dependencies
COPY --chown=default:root package.json package-lock.json /servicemap-ui/

RUN npm install --legacy-peer-deps

COPY --chown=default:root . /servicemap-ui/

USER default

RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 2048
CMD [ "node", "dist/index.js" ]
