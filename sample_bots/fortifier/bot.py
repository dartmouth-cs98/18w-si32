import sys
import time
from GameHelper import GameHelper

def euclidean_distance(from_position, to_position):
    return abs(from_position.x - to_position.x) + abs(from_position.y - to_position.y)

def do_turn(game):
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
                game.mine(s.position, game.get_unit_count_by_position(s.position))
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
                    game.move_towards(s.position,cell, 2)

                game.mine(s.position, game.get_unit_count_by_position(s.position) - 2 * len(surrounding))

        if (game.get_hive_potential() > 0):
            if (closest_to_enemy):
                game.build(closest_to_enemy.position)

GameHelper.register_turn_handler(do_turn)
