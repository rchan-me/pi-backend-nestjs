FROM node:18.16.1-bookworm-slim As development

RUN apt-get update && apt-get install -y procps

USER node
WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY --chown=node:node . .
