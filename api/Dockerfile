FROM node:9.4-alpine

# install packages
RUN mkdir /install
WORKDIR /install
COPY package.json /install
RUN npm install -g nodemon
RUN npm install

ENV NODE_PATH=/install/node_modules

# copy local files over
WORKDIR /app
COPY ./app /app

EXPOSE 3000

CMD ["nodemon", "app/index.js"]
