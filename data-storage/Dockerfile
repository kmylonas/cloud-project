FROM node:16.16.0-alpine3.16

WORKDIR /app
RUN npm install --location=global migrate-mongo
RUN npm install --location=global nodemon
COPY package*.json ./
RUN npm install
COPY . . 

EXPOSE 27018

CMD ["node", "index.js"]