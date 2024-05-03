FROM node:22

# Create app directory
WORKDIR /servicemap-ui

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
EXPOSE 2048
CMD [ "node", "dist/index.js" ]
