# bot.py
# The humble beginnings of a Monad bot.

from random import choice

from GameHelper import GameHelper

def do_turn(game):

    # YOUR BOT LOGIC HERE

GameHelper.register_turn_handler(do_turn)
