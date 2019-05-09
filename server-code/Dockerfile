FROM node:12-alpine

VOLUME /app

WORKDIR /app

COPY ./ /app

RUN npm install

EXPOSE 3000

CMD [ "npm", "run-script", "start:watch" ]