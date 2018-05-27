#!/bin/bash

# sample-zip.sh
# Generate zip archives for all of our sample bots.

cd ../sample;
zip -9 -r --exclude=*__pycache__* random.zip    ./random;
zip -9 -r --exclude=*__pycache__* streamer.zip  ./streamer/;
zip -9 -r --exclude=*__pycache__* waiter.zip    ./waiter/;
zip -9 -r --exclude=*__pycache__* fortifier.zip ./fortifier/;

exit 0;
