# bot.py
#
# Bot Name: Waiter
#
# Strategy Overview:
#   Waiter is Streamer's more patient older brother. Instead of immediately
#   directing available units into the fray, Waiter holds them back until
#   a critical threshold of units has been reached, at which point it
#   unleashes them in a devastating attack.
#   However, if the enemy manages to ward off this initial onslaught,
#   Waiter may prove to not have many more tricks left up its sleeves.

import sys
import time
from random import choice
from GameHelper import GameHelper

UNIT_THRESHOLD = 40

def do_turn(game):
    cells = game.get_my_cells()

    nUnits = game.get_my_total_unit_count()

    if nUnits < UNIT_THRESHOLD:
        my_hive_sites = game.get_my_hive_sites()
        if len(my_hive_sites) > 0:
            for cell in cells:
                game.move_towards(cell.position, my_hive_sites[0].position)

    else:
        enemy_hive_sites = game.get_enemy_hive_sites()
        if len(enemy_hive_sites) > 0:
            for cell in cells:
                game.move_towards(cell.position, enemy_hive_sites[0].position)

GameHelper.register_turn_handler(do_turn)
