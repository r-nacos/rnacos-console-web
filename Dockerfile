FROM node:18-alpine  

WORKDIR /app
# Install git  
# RUN apk add --no-cache git  

COPY package*.json ./  

RUN npm install

COPY . . 

ENV VITE_PORT=${VITE_PORT}
ENV VITE_PROXY_URL=${VITE_PROXY_URL}
ENV VITE_BASE_URL=${VITE_BASE_URL}

EXPOSE ${VITE_PORT}

CMD ["npm", "run", "dev"] 