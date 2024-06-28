FROM node:20.9.0-alpine

WORKDIR /app

COPY ./package.json .
# COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start"]