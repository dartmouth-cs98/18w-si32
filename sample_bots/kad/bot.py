import sys
import time
from GameHelper import GameHelper

game = GameHelper()


while True:
    commands = []

    # load state for next turn
    game.load_state()

    tiles = game.get_my_units()
    buildings = game.enemy_buildings()

    if len(buildings) > 0:
        for t in tiles:
            if t.units[game.myId] < 8:
                continue
            else:
                [x, y] = t.position
                adjacent = [[x + 1, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1]]
                for a in adjacent:
                    m = game.move_towards(t.position, adjacent, 2)
                    if m:
                        commands.append(m)


    # done for this turn, send all my commands
    game.send_commands(commands)
