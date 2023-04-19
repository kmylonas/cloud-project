FROM node:16.16.0-alpine3.16

WORKDIR /app
RUN npm install --location=global nodemon
COPY package*.json ./
RUN npm install
COPY . . 

EXPOSE 3001 

CMD ["nodemon", "index.js"]