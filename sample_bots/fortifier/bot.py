# bot.py
#
# Bot Name: Fortifier
#
# Strategy Overview:
#   Fortifier seeks to expand outward slowly from the starting
#   hive location, building new hives in the process.
#   As its name suggests, Fortifer eventually construct a formidable
#   map position, but does so in a deliberate, often time consuming manner.
#   This delay may prove costly against an adapatable opponent.

import sys
import time
from random import choice

from GameHelper import GameHelper

def euclidean_distance(from_position, to_position):
    return abs(from_position.x - to_position.x) + abs(from_position.y - to_position.y)

def do_turn(game):
    cells = game.get_my_cells()

    hive_sites = game.get_enemy_hive_sites()
    if len(hive_sites) > 0:

        closest_to_enemy = None
        closest_to_enemy_distance = float("inf")

        for cell in cells:
            if (euclidean_distance(cell.position, hive_sites[0].position) < closest_to_enemy_distance):
                closest_to_enemy = cell
                closest_to_enemy_distance = euclidean_distance(cell.position, hive_sites[0].position)

            if (cell.units[game.myId] < 8):
                game.mine(cell.position, game.get_unit_count_by_position(cell.position))
            else:
                [x, y] = cell.position

                e_hive_sites = game.get_enemy_hive_sites()
                e_position = e_hive_sites[0].position

                surrounding = []

                if x < e_position.x:
                    surrounding.append([x + 1, y])
                elif x > e_position.y:
                    surrounding.append([x - 1, y])

                if  y < e_position.y:
                    surrounding.append([x, y + 1])
                elif y > e_position.y:
                    surrounding.append([x, y - 1])

                for s_cell in surrounding:
                    game.move_towards(cell.position, s_cell, 2)

                game.mine(cell.position, game.get_unit_count_by_position(cell.position) - 2 * len(surrounding))

        if (game.get_hive_potential() > 0):
            if (closest_to_enemy):
                game.build(closest_to_enemy.position)

GameHelper.register_turn_handler(do_turn)
