FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci
RUN npm run test

ENV DEBUG=todo-frontend:*

RUN npm run build

# new stage

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html