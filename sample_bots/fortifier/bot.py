import sys
import time
from GameHelper import GameHelper

# comment

def euclidean_distance(from_position, to_position):
    return abs(from_position.x - to_position.x) + abs(from_position.y - to_position.y)

def do_turn(game):
    commands = []

    units = game.get_my_cells()

    hives = game.get_enemy_hive_sites()
    if len(hives) > 0:

        closest_to_enemy = None
        closest_to_enemy_distance = float("inf")

        for s in units:
            if (euclidean_distance(s.position, hives[0].position) < closest_to_enemy_distance):
                closest_to_enemy = s
                closest_to_enemy_distance = euclidean_distance(s.position, hives[0].position)

            if (s.units[game.myId] < 8):
                m = game.mine(s.position, game.get_unit_count_by_position(s.position))
                if m:
                    commands.append(m)
            else:
                [x, y] = s.position

                e_hives = game.get_enemy_hive_sites()
                e_position = e_hives[0].position

                surrounding = []

                if x < e_position.x:
                    surrounding.append([x + 1, y])
                elif x > e_position.y:
                    surrounding.append([x - 1, y])

                if  y < e_position.y:
                    surrounding.append([x, y + 1])
                elif y > e_position.y:
                    surrounding.append([x, y - 1])


                for cell in surrounding:
                    m = game.move_towards(s.position,cell, 2)
                    if m:
                        commands.append(m)
                m = game.mine(s.position, game.get_unit_count_by_position(s.position) - 2 * len(surrounding))
                if m:
                    commands.append(m)

        if (game.get_hive_potential() > 0):
            if (closest_to_enemy):
                m = game.build(closest_to_enemy.position)
                if m:
                    commands.append(m)


    # done for this turn, send all my commands
    # game.send_commands(commands)
    return commands

GameHelper.register_turn_handler(do_turn)
