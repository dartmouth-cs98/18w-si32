#!/bin/bash

mkdir $1

cp ./streamer/bot.py $1/

cp ../worker/bot_common/GameHelper.py $1/
cd $1/
ln -s ../../game .
