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
