import sys
import time
from GameHelper import GameHelper

game = GameHelper()


while True:
    commands = []

    # load state for next turn
    game.load_state()

    tiles = game.get_my_cells()
    buildings = game.get_enemy_buildings()

    if len(buildings) > 0:
        for i, t in enumerate(tiles):
            # if i == 0:
            #     m = game.build(game.myId, t.position, 1)
            #     if m:
            #         commands.append(m)
            if t.units[game.myId] < 8:
                continue
            else:
                [x, y] = t.position
                adjacent = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
                for a in adjacent:
                    m = game.move_towards(t.position, a, 2)
                    if m:
                        commands.append(m)


    # done for this turn, send all my commands
    game.send_commands(commands)
