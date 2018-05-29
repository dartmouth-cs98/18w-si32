#!/bin/bash

# sample-zip.sh
# Generate zip archives for all of our sample bots.

cd ../sample;
rm -f ./*.zip
rm -rf ./*/bot.pyo
# rm -f random/bot.pyo
# rm -f streamer/bot.pyo
# rm -f waiter/bot.pyo
# rm -f fortifier/bot.pyo

exit 0;
