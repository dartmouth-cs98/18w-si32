FROM python:3-alpine

# accept a build arg for the api url to hit for games. set arg as env variable
ARG api_route=http://docker.for.mac.host.internal:5000/worker
ENV api_route=$api_route

# Needed to install packages into alpine
RUN echo "ipv6" >> /etc/modules
RUN apk update

# Get docker and bash inside alpine
RUN apk add docker
RUN apk add bash

# Set the working directory to /app
WORKDIR /app

# for now, just copy everything in this dir into the container
ADD . /app

# install python modules needed
RUN pip install -r ./requirements.txt

CMD ["python", "runGame.py"]
