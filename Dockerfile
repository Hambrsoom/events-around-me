FROM ubuntu:18.10
FROM node:14.15.4 AS builder

WORKDIR /test
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install
RUN npm install -g ts-node
RUN npm install ts-node --save-dev
RUN npm install typescript -g 
RUN npm install typescript --save-dev
COPY . /test

EXPOSE 4000

CMD ["npm", "start"]
