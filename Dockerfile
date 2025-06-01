# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY nest-cli.json ./
COPY .env ./

COPY apps ./apps
COPY libs ./libs  

RUN npm install

ARG SERVICE
RUN npm run build $SERVICE