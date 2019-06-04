FROM node:12-alpine

RUN mkdir /app

COPY ./tsconfig.json /app

COPY ./shared /app/shared

COPY ./client-code /app/client-code

WORKDIR /app/client-code

RUN npm i -g @angular/cli

RUN npm install

EXPOSE 4200

CMD [ "ng", "serve", "--host=0.0.0.0", "--poll=1000" ]