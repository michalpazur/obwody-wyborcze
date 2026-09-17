FROM node:24-alpine AS build
WORKDIR /app
COPY package.json .
COPY patches ./patches
RUN yarn install
RUN yarn global add serve
COPY . /app
RUN mv .env.docker .env
RUN yarn build

FROM nginx:alpine
WORKDIR /app
COPY --from=build /app/dist .
