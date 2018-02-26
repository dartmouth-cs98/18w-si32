from .Command import Command

class GameHelper:
    def __init__(self, map, players):
        self.map = map
        self.players = players

    #gets all tiles of player with specified playerId
    def get_occupied_tiles(self, playerId):
        return self.players[playerId].get_occupied_tiles()

    #gets Tile object at specified xy-coordinate
    def get_tile(self, x, y):
        return self.map.get_tile((x, y))

    #get unit strength at specified square of specified player
    def get_player_units(self, x, y, playerId):
        return self.map.get_tile((x, y)).units[playerId]

    #returns True if player with playerId1 has higher strength at pos1 than player with playerId2 has higher strength at pos2
    def compare_strength(self, pos1, pos2, playerId1, playerId2):
        if (self.get_tile(pos1[0], pos1[1]).units[playerId1] < self.get_tile(pos2[0], pos2[1]).units[playerId2]):
            return True
        return False

    #returns True if player with playerId1 has higher resource than player with playerId2
    def compare_resource(self, playerId1, playerId2):
        if (self.players[playerId1].resource > self.players[playerId2].resource):
            return True
        return False

    # returns True if player with playerId1 has higher building count than player with playerId2
    def compare_building_count(self, playerId1, playerId2):
        if (self.get_number_of_buildings_belonging_to_player(playerId1) > self.get_number_of_buildings_belonging_to_player(playerId2)):
            return True
        return False

    #functions to return commands of various types
    def move(self, playerId, position_from, number_of_units, direction):
        return Command(playerId, position_from, 'move', number_of_units, direction)

    def build(self, playerId, position_build, number_of_units):
        return Command(playerId, position_build, 'build', number_of_units, None)

    def mine(self, playerId, position_mine, number_of_units):
        return Command(playerId, position_mine, 'mine', number_of_units, None)


    #efficient delegation of units when mining - if a tile has resource less than number of units, send the unneeded units to the adjacent free tile with greatest resource
    def efficient_mine(self, playerId, position_mine):
        commands = []

        resource_at_tile = self.get_tile(position_mine[0], position_mine[1]).resource
        units_at_tile = self.get_tile(position_mine[0], position_mine[1]).units[playerId]
        if (resource_at_tile < units_at_tile):
            commands.append(self.mine(playerId, position_mine, resource_at_tile))
            greatest_pos = self.get_free_position_with_greatest_resource_within_range(position_mine[0], position_mine[1], 1)


            if greatest_pos is not None:
                direction = (greatest_pos[0] - position_mine[0], greatest_pos[1] - position_mine[1])
                commands.append(self.move(playerId, position_mine, units_at_tile - resource_at_tile, direction))

        else:
            commands.append(self.mine(playerId, position_mine, units_at_tile))





    #makes a single move from position_from that tries to get closer to position_to while avoiding either enemy units, enemy buildings, or stronger enemy buildings
    def single_move_towards_tile_avoiding_things(self, playerId, position_from, position_to, number_of_units, things_to_avoid):

        def tile_contains_enemy_building(x, y):
            return (self.get_tile(x, y).building is not None) & ((self.get_tile(x, y).building.ownerId + playerId) == 1)

        def tile_contains_stronger_enemy_building(x, y):
            return (self.get_tile(x, y).building is not None) & ((self.get_tile(x, y).building.ownerId + playerId) == 1) & (self.get_tile(x, y).building.defense >= number_of_units)

        def tile_contains_enemy_units(x, y):
            return self.get_tile(x, y).units[(playerId ^ 1)] > 0

        x0 = position_from[0]
        y0 = position_from[1]
        x1 = position_to[0]
        y1 = position_to[1]

        xy_difference = (x1 - x0, y1 - y0)

        if (things_to_avoid == 'buildings'):
            if (xy_difference[0] > 0) & (not tile_contains_enemy_building(x0 + 1, y0)):
                direction = (1, 0)
            elif (xy_difference[1] > 0) & (not tile_contains_enemy_building(x0, y0 + 1)):
                direction = (0, 1)
            elif (not tile_contains_enemy_building(x0 - 1, y0)):
                direction = (-1, 0)
            elif (not tile_contains_enemy_building(x0, y0 - 1)):
                direction = (0, -1)
            else:
                direction = (0, 0)
        elif (things_to_avoid == 'stronger buildings'):
            if (xy_difference[0] > 0) & (not tile_contains_stronger_enemy_building(x0 + 1, y0)):
                direction = (1, 0)
            elif (xy_difference[1] > 0) & (not tile_contains_stronger_enemy_building(x0, y0 + 1)):
                direction = (0, 1)
            elif (not tile_contains_enemy_building(x0 - 1, y0)):
                direction = (-1, 0)
            elif (not tile_contains_enemy_building(x0, y0 - 1)):
                direction = (0, -1)
            else:
                direction = (0, 0)
        elif (things_to_avoid == 'units'):
            if (xy_difference[0] > 0) & (not tile_contains_enemy_units(x0 + 1, y0)):
                direction = (1, 0)
            elif (xy_difference[1] > 0) & (not tile_contains_enemy_units(x0, y0 + 1)):
                direction = (0, 1)
            elif (not tile_contains_enemy_building(x0 - 1, y0)):
                direction = (-1, 0)
            elif (not tile_contains_enemy_building(x0, y0 - 1)):
                direction = (0, -1)
            else:
                direction = (0, 0)
        else:
            direction = (0, 0)



        return Command(playerId, position_from, 'move', number_of_units, direction)

    def move_towards_tile_avoiding_things(self, playerId, position_from, position_to, number_of_units, things_to_avoid):
        commands = []
        while (position_from != position_to):
            single_move = self.single_move_towards_tile_avoiding_things(playerId, position_from, position_to, number_of_units, things_to_avoid)

            if (single_move.direction == (0, 0)):
                commands.clear()
                break

            commands.append(single_move)


    def get_number_of_buildings_belonging_to_player(self, playerId):
        number_buildings = 0
        i = 0
        j = 0
        while (j < self.map.height):
            while (i < self.map.width):
                if self.get_tile(i, j).building.ownerId == playerId:
                    number_buildings += 1

            i += 1
            j += 1

        return number_buildings

    def get_nearest_building_and_distance_belonging_to_player(self, x, y, playerId):
        if (self.get_number_of_buildings_belonging_to_player(playerId) > 0):
            current_search_distance = 1

            while (True):
                for m in range(-1 * current_search_distance, current_search_distance + 1):
                    n = current_search_distance - abs(m)

                    if (self.get_tile(x + m, y + n).building is not None) & (self.get_tile(x + m, y + n).building.ownerId == playerId):
                        return ((x + m, y + n), current_search_distance)
                    elif (self.get_tile(x + m, y - n).building is not None) & (self.get_tile(x + m, y - n).building.ownerId == playerId):
                        return ((x + m, y - n), current_search_distance)

                current_search_distance += 1
        else:
            return None

    def get_free_position_with_greatest_resource_within_range(self, x, y, range):
        greatest_resource = 0
        greatest_position = None
        for m in range(-1 * range, range + 1):
            n = range - abs(m)

            if (self.get_tile(x + m, y + n).building is None) & (self.get_tile(x + m, y + n).resource > greatest_resource):
                greatest_resource = self.get_tile(x + m, y + n).resource
                greatest_position = self.get_tile(x + m, y + n).position

            if (self.get_tile(x + m, y + n).building is None) & (self.get_tile(x + m, y - n).resource > greatest_resource):
                greatest_resource = self.get_tile(x + m, y - n).resource
                greatest_position = self.get_tile(x + m, y - n).position

        return (greatest_resource, greatest_position)










