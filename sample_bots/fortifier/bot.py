import sys
import time
from GameHelper import GameHelper

def euclidean_distance(from_position, to_position):
    return abs(from_position[0] - to_position[0]) + abs(from_position[1] - to_position[1])

def do_turn(game):

    game.log(game.building_potential())
    game.log(game.me["resources"])

    commands = []

    units = game.get_my_units()

    buildings = game.enemy_buildings()
    if len(buildings) > 0:

        closest_to_enemy = None
        closest_to_enemy_distance = float("inf")

        for s in units:
            if (euclidean_distance(s.position, buildings[0].position) < closest_to_enemy_distance):
                closest_to_enemy = s
                closest_to_enemy_distance = euclidean_distance(s.position, buildings[0].position)

            if (s.units[game.myId] < 8):
                m = game.mine(s.position, game.my_units_at_pos(s.position))
                if m:
                    commands.append(m)
            else:
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

        if (game.building_potential() > 0):
            m = game.build(game.myId, closest_to_enemy.position, game.my_units_at_pos(closest_to_enemy.position))
            if m:
                commands.append(m)


    # done for this turn, send all my commands
    # game.send_commands(commands)
    return commands

GameHelper.register_turn_handler(do_turn)
