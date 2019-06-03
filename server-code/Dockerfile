FROM node:12-alpine

VOLUME /app/shared

VOLUME /app/server-code

COPY ./shared /app/shared

COPY ./server-code /app/server-code

WORKDIR /app/server-code

EXPOSE 3000

CMD [ "npm", "run-script", "start:watch" ]