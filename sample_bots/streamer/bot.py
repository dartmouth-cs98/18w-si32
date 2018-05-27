# bot.py
#
# Bot Name: Streamer
#
# Strategy Overview:
#   Streamer does one thing and does it well: streams units as quickly as
#   they become available towards an enemy hive.
#   Opponents not prepared to put up an immediate defense against Streamer's
#   early offensive posture may find themselves in trouble.
#   However, the low dimensionality of Streamer's strategy may prove easily defensible.

import sys
import time
from random import choice
from GameHelper import GameHelper

def do_turn(game):
    cells = game.get_my_cells()

    hive_sites = game.get_enemy_hive_sites()

    if len(hive_sites) > 0:
        for cell in cells:
            game.move_towards(cell.position, hive_sites[0].position)

GameHelper.register_turn_handler(do_turn)
