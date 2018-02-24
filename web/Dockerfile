FROM node:9.4-alpine

# install packages first to let docker cache this step
WORKDIR /tmp
COPY package.json /tmp
RUN npm install

WORKDIR /app

# copy packages over before adding app code (again, for caching puposes)
RUN mv /tmp/node_modules /app

# copy local files over
COPY . /app

EXPOSE 4000

CMD ["npm", "start"]
