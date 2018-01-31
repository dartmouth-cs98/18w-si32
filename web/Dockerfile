FROM node:9.4-alpine

WORKDIR /app
ADD . /app

RUN npm install
RUN npm install --global nodemon

EXPOSE 3000

CMD ["nodemon", "--experimental-modules", "app.mjs"]
