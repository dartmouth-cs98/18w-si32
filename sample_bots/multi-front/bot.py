import sys
import time
from GameHelper import GameHelper
from game.params import DEFENSE_RATING

def euclidean_distance(from_position, to_position):
    return abs(from_position.x - to_position.x) + abs(from_position.y - to_position.y)

def can_destroy(cell, building, game):
    close_enough = (euclidean_distance(cell.position, building.position) == 1)
    strong_enough = cell.units[game.myId] >  game.get_unit_count_by_position(building.position) + 10
    return close_enough and strong_enough

def do_turn(game):

    game.log(game.get_building_potential())
    game.log(game.me["resources"])

    commands = []

    units = game.get_my_cells()

    buildings = game.get_enemy_building_sites()
    if len(buildings) > 0:

        closest_to_enemy = None
        closest_to_enemy_distance = float("inf")

        for s in units:
            if (euclidean_distance(s.position, buildings[0].position) < closest_to_enemy_distance):
                closest_to_enemy = s
                closest_to_enemy_distance = euclidean_distance(s.position, buildings[0].position)

            if (s.units[game.myId] < 8):
                m = game.mine(s.position, game.get_unit_count_by_position(s.position))
                if m:
                    commands.append(m)
            else:
                [x, y] = s.position

                e_buildings = game.get_enemy_building_sites()

                doing_full_attack = False
                for building in e_buildings:
                    if (can_destroy(s, building, game)):
                        m = game.move_towards(s.position, building.position, game.get_unit_count_by_position(s.position))
                        if m:
                            commands.append(m)
                            doing_full_attack = True

                if (doing_full_attack):
                    continue

                curr_cell = game.get_cell(s.position)
                game.log('Resource count:' + str(curr_cell.resource))
                num_to_keep = min(curr_cell.resource, game.get_unit_count_by_position(s.position))
                num_available = game.get_unit_count_by_position(s.position) - num_to_keep

                m = game.mine(s.position, num_to_keep)
                if m:
                    commands.append(m)

                surrounding = [[]]

                e_position = e_buildings[0].position

                surrounding = [ [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1] ]

                most_resources = -1
                most_resource_position = None
                for position in surrounding:
                    cell = game.get_cell(s.position)
                    if (cell.building):
                        continue
                    if cell.resource > most_resources:
                        most_resource_position = cell.position

                if (most_resource_position):
                    m = game.move_towards(s.position,most_resource_position, num_available)
                    if m:
                        commands.append(m)


        if (game.get_building_potential() > 0):
            if (closest_to_enemy):
                m = game.build(closest_to_enemy.position)
                if m:
                    commands.append(m)


    # done for this turn, send all my commands
    # game.send_commands(commands)
    game.log(commands)
    return commands

GameHelper.register_turn_handler(do_turn)
