FROM node:12.19.0-alpine

WORKDIR /app

COPY ./package.json /app/package.json
RUN yarn install

COPY . .
CMD yarn start
