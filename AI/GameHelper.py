from .Command import Command

class GameHelper:
    def __init__(self, map, players):
        self.map = map
        self.players = players

    def get_occupied_tiles(self, playerId):
        return self.players[playerId].get_occupied_tiles()

    def get_tile(self, x, y):
        return self.map.get_tile((x, y))

    def move(self, playerId, position_from, number_of_units, direction):
        return Command(playerId, position_from, 'move', number_of_units, direction)

    def build(self, playerId, position_build, number_of_units, direction):
        return Command(playerId, position_build, 'build', number_of_units, direction)

    def move_towards_tile_avoiding_things(self, playerId, position_from, position_to, number_of_units, things_to_avoid):

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
                    elif (self.get_tile(x + m, y + n).building is not None) & (self.get_tile(x + m, y - n).building.ownerId == playerId):
                        return ((x + m, y - n), current_search_distance)

                current_search_distance += 1
        else:
            return None








