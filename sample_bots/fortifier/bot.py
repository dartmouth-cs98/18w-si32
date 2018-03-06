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
                game.log(game.building_potential())
                game.log(game.me["resources"])
                [x, y] = s.position

                e_buildings = game.enemy_buildings()
                e_position = e_buildings[0].position

                surrounding = []

                if x < e_position[0]:
                    surrounding.append([x + 1, y])
                elif x > e_position[0]:
                    surrounding.append([x - 1, y])

                if  y < e_position[1]:
                    surrounding.append([x, y + 1])
                elif y > e_position[1]:
                    surrounding.append([x, y - 1])


                for tile in surrounding:
                    m = game.move_towards(s.position,tile, 2)
                    if m:
                        commands.append(m)
                m = game.mine(s.position, game.my_units_at_pos(s.position) - 2 * len(surrounding))
                if m:
                    commands.append(m)


    # done for this turn, send all my commands
    game.send_commands(commands)
