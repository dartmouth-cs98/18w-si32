#!/bin/bash

# sample-zip.sh
# Generate zip archives for all of our sample bots.

cd ../sample;
zip -9 -r --exclude=*__pycache__* --exclude=*bot.py random.zip    ./random;
zip -9 -r --exclude=*__pycache__* --exclude=*bot.py streamer.zip  ./streamer/;
zip -9 -r --exclude=*__pycache__* --exclude=*bot.py waiter.zip    ./waiter/;
zip -9 -r --exclude=*__pycache__* --exclude=*bot.py fortifier.zip ./fortifier/;

exit 0;
