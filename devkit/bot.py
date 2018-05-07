# bot.py
# The humble beginnings of a Monad bot.

from GameHelper import GameHelper

def do_turn(game):
    # TURN START ---------------------------------------------------------------
    commands = []

    # implement your bot logic here.

    return commands
    # TURN END -----------------------------------------------------------------

GameHelper.register_turn_handler(do_turn)
