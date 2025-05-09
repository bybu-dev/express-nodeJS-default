FROM node:18-alpine

WORKDIR /app

COPY package.json .
COPY ecosystem.config.js .
COPY . .

RUN npm install --production
RUN npm install pm2 -g

EXPOSE 8080

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
