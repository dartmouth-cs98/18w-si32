#!/bin/bash
docker run -i  \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v bot0:/bot0 \
  -v bot1:/bot1 \
  -v $(pwd):/app `# mount local working dir so that you don't have to reload on every file change` \
  si32-worker
