FROM node:9.4-alpine

# install packages
RUN mkdir /install
WORKDIR /install
COPY package.json /install
RUN npm install -g nodemon

ENV NODE_PATH=/install/node_modules

# copy local files over
WORKDIR /app
COPY ./app /app

CMD ["nodemon", "app/index.js"]
