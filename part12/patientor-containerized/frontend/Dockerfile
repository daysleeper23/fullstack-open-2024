FROM node:20 AS build

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci
RUN npm run build

FROM nginx:1.25-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
