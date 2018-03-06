from game.Command import Command
# from game.Map import Map
# from game.Building import resource_cost
import sys
import json
import pickle

directions = {
    'left': [-1,0],
    'right': [1,0],
    'up': [0,-1],
    'down': [0,1],
    'none': [0,0],
}

def pos_equal(a,b):
    return a[0] == b[0] and a[1] == b[1]

class GameHelper:
    def __init__(self):
        # first thing the game server sends us through STDIN is our player id
        self.myId = pickle.load(sys.stdin.buffer)
        self.eId = 1 - self.myId
        self.me = {
            "resources": 0
        }

        self.Logfile = open("./game" + str(self.eId) + ".log", "w")

    def __del__(self):
        self.Logfile.close()

    # reads in the game state and loads it
    def load_state(self):
        state = pickle.load(sys.stdin.buffer)
        self.map = state["map"]
        self.me = state["player"]

    def create_move_command(self, location, direction, n_units):
        return {
            'playerId': self.myId,
            'location': location,
            'command': 'move',
            'number_of_units': n_units,
            'direction': directions[direction]
        }

    #makes a single move from position_from that tries to get closer to position_to while avoiding either enemy units, enemy buildings, or stronger enemy buildings
    def move_towards(self, position_from, position_to, n_units=None):
        if pos_equal(position_from, position_to):
            return None

        if position_from[0] < position_to[0]:
            d = 'right'
        elif position_from[0] > position_to[0]:
            d = 'left'
        elif position_from[1] < position_to[1]:
            d = 'down'
        elif position_from[1] > position_to[1]:
            d = 'up'

        n_units = n_units if n_units else self.my_units_at_pos(position_from)
        return self.move(position_from, n_units, d)


    def send_commands(self, commands):
        print(pickle.dumps(commands))
        # print(json.dumps(commands))
        sys.stdout.flush()

        # gets all tiles of a player with specified playerId where he has at least one unit

    def get_occupied_tiles(self, playerId):
        tiles = []

        for col in self.map.tiles:
            for tile in col:
                if tile.units[playerId] > 0:
                    tiles.append(tile)

        return tiles

    def enemy_buildings(self):
        blds = []
        for col in self.map.tiles:
            for tile in col:
                if tile.building and tile.building.ownerId != self.myId:
                    blds.append(tile)

        return blds

    def my_buildings(self):
        blds = []
        for col in self.map.tiles:
            for tile in col:
                if tile.building and tile.building.ownerId == self.myId:
                    blds.append(tile)

        return blds

    def my_occupied_tiles(self):
        return self.get_occupied_tiles(self.myId)

    def enemy_occupied_tiles(self):
        return self.get_occupied_tiles(self.eId)

        # returns a list of all tiles that have units for this player on them

    def get_my_units(self):
        return self.get_occupied_tiles(self.myId)

        # gets tile at specified xy-coordinates

    def get_tile(self, x, y):
        return self.map.get_tile((x, y))

        # get the number of units at specified square of specified player

    def get_units(self, x, y, playerId):
        return self.map.get_tile((x, y)).units[playerId]

    def my_resource_count(self):
        if "resources" in self.me:
            return self.me["resources"]
        return 0

    def building_potential(self):
        return int(self.my_resource_count() / 100)

    def my_units_at_pos(self, pos):
        return self.map.get_tile(pos).units[self.myId]


        # returns True if player with playerId1 has higher unit count at pos1 than player with playerId2 has at pos2

    def compare_unit_count(self, pos1, pos2):
        if (self.get_tile(pos1[0], pos1[1]).units[self.myId] > self.get_tile(pos2[0], pos2[1]).units[self.eId]):
            return True
        return False

        # returns True if player with playerId1 has more resource than player with playerId2

    def compare_resource(self):
        if (self.players[self.myId].resource > self.players[self.eId].resource):
            return True
        return False

        # returns True if player with playerId1 has higher building count than player with playerId2

    def compare_building_count(self):
        if (self.get_number_of_buildings_belonging_to_player(
                self.myId) > self.get_number_of_buildings_belonging_to_player(self.eId)):
            return True
        return False

        # gets the total number of units controlled by player with playerId

    def get_total_units(self, playerId=None):
        if playerId is None:
            playerId = self.myId
        count = 0
        for tile in self.get_occupied_tiles(playerId):
            count += tile.units[playerId]
        return count

        # returns True if player with playerId1 has more units than player with playerId2

    def compare_total_units(self):
        if (self.get_total_units(self.myId) > self.get_total_units(self.eId)):
            return True
        else:
            return False


            # functions to return commands of various types

    def move(self, position_from, number_of_units, direction):
        return Command(self.myId, position_from, 'move', number_of_units, directions[direction])

    def build(self, playerId, position_build, number_of_units):
        return Command(playerId, position_build, 'build', number_of_units, None)

    def mine(self, position_mine, number_of_units):
        return Command(self.myId, position_mine, 'mine', number_of_units, None)

    # returns a sequence of commands at a tile so that - if the tile has resource less than number of units, send the unneeded units to the adjacent free tile with greatest resource; then, build on the tile if it's empty
    def efficient_mine_and_build(self, position):
        commands = []

        resource_at_tile = self.get_tile(position[0], position[1]).resource
        units_at_tile = self.get_tile(position[0], position[1]).units[self.myId]

        # if there's more than enough units, move them to adjacent free tiles

        if (resource_at_tile < units_at_tile):

            if (resource_at_tile > 0):
                commands.append(self.mine(self.myId, position, resource_at_tile))
            greatest = self.get_free_position_with_greatest_resource_of_range(position[0], position[1], 1)

            # if there is a free adjacent tile, move to the one with the greatest resource
            if greatest is not None:
                if greatest[1] is not None:
                    direction = (greatest[1][0] - position[0], greatest[1][1] - position[1])
                    # build if there's room on the tile


                    if (self.get_tile(position[0], position[1]).building is not None) | (
                                self.players[self.myId].resource < resource_cost):

                        commands.append(self.move(self.myId, position, units_at_tile - resource_at_tile, direction))
                    else:

                        commands.append(self.move(self.myId, position, units_at_tile - resource_at_tile - 1, direction))
                        commands.append(self.build(self.myId, position, 1))

        # else, have them all (minus one) gather resource, then build (if there is no building), or all gather resource (if there is a building)
        else:

            if (self.get_tile(position[0], position[1]).building is not None) | (
                        self.players[self.myId].resource < resource_cost):
                commands.append(self.mine(self.myId, position, units_at_tile))
            else:
                commands.append(self.mine(self.myId, position, units_at_tile - 1))
                commands.append(self.build(self.myId, position, 1))

        for command in commands:
            if (command.number_of_units <= 0):
                commands.remove(command)

        return commands

    def single_move_towards_tile_avoiding_things(self, position_from, position_to, number_of_units, things_to_avoid):

        # returns True if tile at (x, y) contains an enemy building
        def tile_contains_enemy_building(x, y):
            return (self.get_tile(x, y).building is not None) & ((self.get_tile(x, y).building.ownerId == self.eId))

        # returns True if tile at (x, y) contains an enemy building whose defense value is higher than the number of our units to command
        def tile_contains_stronger_enemy_building(x, y):
            return tile_contains_enemy_building(x, y) & (
                self.get_tile(x, y).building.defense >= number_of_units)

        # returns True of tile at (x, y) contains enemy units
        def tile_contains_enemy_units(x, y):
            return self.get_tile(x, y).units[(self.eId)] > 0

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

        return Command(self.myId, position_from, 'move', number_of_units, direction)

        # get the number of buildings belonging to player with playerId

    def get_number_of_buildings_belonging_to_player(self, playerId):
        number_buildings = 0

        j = 0
        while (j < self.map.height):

            i = 0
            while (i < self.map.width):

                if (self.get_tile(i, j).building is not None):
                    if (self.get_tile(i, j).building.ownerId == playerId):
                        number_buildings += 1

                i += 1
            j += 1

        return number_buildings

        # get the position of the nearest building from (x, y) that belongs to a player with playerId

    def get_nearest_building_position_and_distance_belonging_to_player(self, x, y, playerId):
        if (self.get_number_of_buildings_belonging_to_player(playerId) > 0):
            current_search_distance = 0

            while (True):
                for m in range(-1 * current_search_distance, current_search_distance + 1):
                    n = current_search_distance - abs(m)

                    if (self.map.tile_in_range((x + m, y + n))):
                        if (self.get_tile(x + m, y + n).building is not None):
                            if (self.get_tile(x + m, y + n).building.ownerId == playerId):
                                return ((x + m, y + n), current_search_distance)
                    elif (self.map.tile_in_range((x + m, y + n))):
                        if (self.get_tile(x + m, y - n).building is not None):
                            if (self.get_tile(x + m, y + n).building.ownerId == playerId):
                                return ((x + m, y - n), current_search_distance)

                current_search_distance += 1
        else:
            return None

            # return the position of the tile with the greatest resource of a specified distance away from a specified tile

    def get_free_position_with_greatest_resource_of_range(self, x, y, r):
        greatest_resource = 0
        greatest_position = None

        for m in range((-1 * r), (r + 1)):
            n = r - abs(m)

            if (self.map.tile_in_range((x + m, y + n))):
                if (self.get_tile(x + m, y + n).building is None) & (
                            self.get_tile(x + m, y + n).resource > greatest_resource):
                    greatest_resource = self.get_tile(x + m, y + n).resource
                    greatest_position = self.get_tile(x + m, y + n).position

            if (self.map.tile_in_range((x + m, y - n))):
                if (self.get_tile(x + m, y - n).building is None) & (
                            self.get_tile(x + m, y - n).resource > greatest_resource):
                    greatest_resource = self.get_tile(x + m, y - n).resource
                    greatest_position = self.get_tile(x + m, y - n).position

        return (greatest_resource, greatest_position)

    def get_adjacent_free_position_with_greatest_resource(self, x, y):
        return self.get_free_position_with_greatest_resource_of_range(x, y, 1)

    def get_nearest_player_unit_pos_to_tile(self, x, y, playerId):
        nearest_enemy = None
        distance = math.inf
        for tile in self.get_occupied_tiles(playerId):
            separation = abs(tile.position[0] - x) + abs(tile.position[1] - y)
            if separation < distance:
                distance = separation
                nearest_enemy = tile.position

        return (nearest_enemy, distance)

    def get_nearest_enemy_unit_pos_to_tile(self, x, y):
        return self.get_nearest_player_unit_pos_to_tile(x, y, self.eId)

    def get_nearest_friendly_unit_pos_to_tile(self, x, y):
        return self.get_nearest_player_unit_pos_to_tile(x, y, self.eId)

    def log(self, out):
        self.Logfile.write(str(out) + "\n")
        self.Logfile.flush()
