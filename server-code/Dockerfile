FROM node:12-alpine

RUN mkdir /app

COPY ./tsconfig.json /app

COPY ./shared /app/shared

COPY ./server-code /app/server-code

WORKDIR /app/server-code

CMD [ "npm", "run-script", "start:watch" ]