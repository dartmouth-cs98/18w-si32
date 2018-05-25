#!/bin/bash
#
# monad.sh
#
# Entry point for Monad CLI.
# Shell script wraps the functionality of
# various python scripts useful during local development.
#
# Usage:
#   monad.sh <command> param0 [param1, ...]
#
# Supported Commands:
#   - match
#   - train
#   - upload
#
# Exit Codes:
#   0 = clean exit
#   1 = invalid syntax
#   2 = unrecognized command

# check if a command was even specified
if [ "$#" -lt 1 ]; then
  echo "usage: monad.sh command param1 [param2 ...]"
  exit 1
fi

if [ "$1" = "match" ]; then
  # run the match script
  python ./scripts/match.py "${@:2}"
elif [ "$1" = "train" ]; then
  # run the train script
  python ./scripts/train.py "${@:2}"
elif [ "$1" = "upload" ]; then
  # run the upload script
  python ./scripts/upload.py "${@:2}"
else
  # unrecognized command
  echo "error: unrecognized command"
  exit 2
fi

exit 0
