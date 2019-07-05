FROM node:6.10.1

MAINTAINER Andrew Lloyd <andrew85.lloyd@gmail.com>

RUN mkdir -p /app

WORKDIR /app

ADD package.json package-lock.json /app/

RUN npm install --no-save --silent

COPY . /app/

RUN npm run build:dev

EXPOSE 5000

CMD [ "npm", "start" ]
