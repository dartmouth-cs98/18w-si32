#!/bin/bash

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
  exit 1
fi

exit 0
