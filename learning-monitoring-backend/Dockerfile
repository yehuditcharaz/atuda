FROM node:14-slim

WORKDIR /app
COPY package.json .

RUN npm install
COPY . .
EXPOSE 6868
CMD npm start