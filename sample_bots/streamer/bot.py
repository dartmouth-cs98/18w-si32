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
