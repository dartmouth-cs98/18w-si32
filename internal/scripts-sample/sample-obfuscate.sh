#!/bin/bash

# sample-obfuscate.sh
# Minify, obfuscate, and compress source code for our sample bots.

pyminifier --obfuscate --gzip ../sample/random/bot.py > ../sample/random/bot.pyo
pyminifier --obfuscate --gzip ../sample/streamer/bot.py > ../sample/streamer/bot.pyo
pyminifier --obfuscate --gzip ../sample/waiter/bot.py > ../sample/waiter/bot.pyo
pyminifier --obfuscate --gzip ../sample/fortifier/bot.py > ../sample/fortifier/bot.pyo

exit 0;
