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

    tiles = game.my_occupied_tiles

    for tile in tiles:
        # if dominant in units and buildings, go on the offensive
        if game.compare_total_units() & game.compare_building_count() & game.compare_resource():

            (nearest_enemy_building_position,
             distance) = game.get_nearest_building_position_and_distance_belonging_to_player(
                tile.position[0], tile.position[1], game.eId)

            # only head towards the buildings with defense weaker than the number of units you control on this tile
            if (game.get_nearest_building_position_and_distance_belonging_to_player(
                tile.position[0], tile.position[1], game.eId) is not None) & game.get_tile(nearest_enemy_building_position[0],
                                        nearest_enemy_building_position[1]).building.defense < tile.units[game.myId]:

                commands.append(game.bad_single_move_towards_tile_avoiding_things(game.myId, tile.position,
                                                                                         nearest_enemy_building_position,
                                                                                         tile.units[game.myId],
                                                                                         'stronger_buildings'))
            else:
                commands += game.efficient_mine_and_build(tile.position)
        # otherwise focus on resource gathering and building
        else:

            commands += game.efficient_mine_and_build(tile.position)


    # done for this turn, send all my commands
    game.send_commands(commands)
