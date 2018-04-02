import sys
import time
from GameHelper import GameHelper

def do_turn(game):
    commands = []

    units = game.get_my_cells()

    buildings = game.get_enemy_buildings()
    if len(buildings) > 0:
        for s in units:
            m = game.move_towards(s.position,buildings[0].position)
            if m:
                commands.append(m)


    # done for this turn, send all my commands
    # return commands
    return []

GameHelper.register_turn_handler(do_turn)
