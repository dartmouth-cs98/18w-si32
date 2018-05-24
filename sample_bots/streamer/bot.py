import sys
import time
from GameHelper import GameHelper

def do_turn(game):
    commands = []

    units = game.get_my_cells()

    hives = game.get_enemy_hive_sites()

    if len(hives) > 0:
        for s in units:
            m = game.move_towards(s.position, hives[0].position)
            if m:
                commands.append(m)


    # done for this turn, send all my commands
    return commands

GameHelper.register_turn_handler(do_turn)
