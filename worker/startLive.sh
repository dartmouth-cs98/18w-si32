#!/bin/bash
docker run -i  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v bot0:/bot0 \
  -v bot1:/bot1 \
  -v bot2:/bot2 \
  -v bot3:/bot3 \
  --env api_route=https://lit-mountain-10578.herokuapp.com/worker \
  si32-worker
