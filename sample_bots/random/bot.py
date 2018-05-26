# bot.py
#
# Bot Name: Random
#
# Strategy Overview:
#   Random appears to be the result of an unconstrained evolutionary process
#   — one without the feedback provided by natural selection.
#   Random makes not effort to increase the number of hives it controls,
#   and simply directs each unit to move in a random direction on each turn.
#   A loss to Random may suggest that something is desperately wrong with a bot's strategy.

import sys
import time
from random import choice

from GameHelper import GameHelper

def do_turn(game):
    cells = game.get_my_cells()
    for cell in cells:
        game.move(cell.position, 1, choice(game.get_movement_directions()))

GameHelper.register_turn_handler(do_turn)
