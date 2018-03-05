import sys
import time
from GameHelper import GameHelper

game = GameHelper()


while True:
    # l = sys.stdin.readline()
    # print(str(i) + ": bot 2 received: " + l,)

    commands = []

    # load state for next turn
    game.load_state()

    units = game.get_my_units()

    buildings = game.enemy_buildings()
    if len(buildings) > 0:
        for s in units:
            if (s.units[game.myId] < 8):
                continue
            else:
                [x, y] = s.position

                surrounding = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]

                for tile in surrounding:
                    m = game.move_towards(s.position,tile, 1)
                    if m:
                        commands.append(m)


    # done for this turn, send all my commands
    game.send_commands(commands)
