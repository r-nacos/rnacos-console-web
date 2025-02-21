FROM node:18-alpine  

WORKDIR /app
# Install git  
# RUN apk add --no-cache git  

COPY package*.json ./  

RUN npm install

COPY . . 