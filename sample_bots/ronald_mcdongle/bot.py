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

    eBuildings = game.enemy_buildings()

    if len(buildings) > 0:
        for s in units:
            m = game.move_towards(s.position,buildings[0].position)
            if m:
                commands.append(m)


    # done for this turn, send all my commands
    game.send_commands(commands)
