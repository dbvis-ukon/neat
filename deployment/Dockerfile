# This Dockerfile is ONLY meant for deployment
FROM node:12-alpine

# only show warnings during npm install
ENV NPM_CONFIG_LOGLEVEL warn

# install the executor for the express server
RUN npm install -g pm2

RUN mkdir /app

COPY server-code/package*.json /app/server/

COPY deployment/ecosystem.config.js /app/server/ecosystem.config.js

COPY server-code/dist /app/server/dist/

COPY server-code/public /app/server/public/

COPY shared/ /app/shared/

# our working directory
WORKDIR /app/server

RUN ls -laR /app

# install server deps
RUN npm ci --production

# the port our app is running on (see ./server-code/app.ts)
ENV PORT 3000

CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]