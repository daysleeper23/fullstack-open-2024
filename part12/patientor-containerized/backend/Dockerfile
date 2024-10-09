FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci
RUN npm run build

USER node

CMD [ "npm", "start" ]