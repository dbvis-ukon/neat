FROM node:12-alpine

VOLUME /app

WORKDIR /app

COPY ./ /app

RUN npm i -g @angular/cli

RUN npm install

EXPOSE 4200

CMD [ "ng", "serve", "--host=0.0.0.0" ]