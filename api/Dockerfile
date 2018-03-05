FROM node:9.4-alpine

# install packages first to let docker cache this step
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers make python

WORKDIR /tmp
COPY package.json /tmp
COPY package-lock.json /tmp
RUN npm install
RUN npm install -g nodemon

# delete the dependencies needed for some node modules that we no longer
# need so that the image size remains small
RUN apk del native-deps

WORKDIR /app

# copy packages over before adding app code (again, for caching puposes)
RUN mv /tmp/node_modules /app

# copy local files over
COPY ./app /app/app

CMD ["nodemon", "app/index.js"]
