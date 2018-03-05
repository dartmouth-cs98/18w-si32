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

    tiles = self.GameHelper.get_occupied_tiles(game.myId)

    for tile in tiles:
        # if dominant in units and buildings, go on the offensive
        if self.GameHelper.compare_total_units() & self.GameHelper.compare_building_count() & self.GameHelper.compare_resource():

            (nearest_enemy_building_position,
             distance) = self.GameHelper.get_nearest_building_position_and_distance_belonging_to_player(
                tile.position[0], tile.position[1], game.eId)

            # only head towards the buildings with defense weaker than the number of units you control on this tile
            if (self.GameHelper.get_nearest_building_position_and_distance_belonging_to_player(
                tile.position[0], tile.position[1], game.eId) is not None) & self.GameHelper.get_tile(nearest_enemy_building_position[0],
                                        nearest_enemy_building_position[1]).building.defense < tile.units[game.myId]:

                commands.append(self.GameHelper.single_move_towards_tile_avoiding_things(game.myId, tile.position,
                                                                                         nearest_enemy_building_position,
                                                                                         tile.units[game.myId],
                                                                                         'stronger_buildings'))
            else:
                commands += self.GameHelper.efficient_mine_and_build(game.myId, tile.position)
        # otherwise focus on resource gathering and building
        else:

            commands += self.GameHelper.efficient_mine_and_build(game.myId, tile.position)


    # done for this turn, send all my commands
    game.send_commands(commands)
