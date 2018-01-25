FROM python:2-alpine

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
