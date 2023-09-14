FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT [ "npm", "run", "start" ]