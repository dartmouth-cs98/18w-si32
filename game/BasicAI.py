class BasicAI:

    def __init__(self, GameHelper):
        self.GameHelper = GameHelper

    def make_move(self, playerId):
        commands = []

        tiles = self.GameHelper.get_occupied_tiles(playerId)

        for tile in tiles:
            #if dominant in units and buildings, go on the offensive
            if self.GameHelper.compare_total_units(playerId, playerId ^ 1) & self.GameHelper.compare_building_count(playerId, playerId ^ 1):
                (nearest_enemy_building_position, distance) = self.GameHelper.get_nearest_building_position_and_distance_belonging_to_player(tile.position[0], tile.position[1], playerId)

                #only head towards the buildings with defense weaker than the number of units you control on this tile
                if self.GameHelper.get_tile(nearest_enemy_building_position[0], nearest_enemy_building_position[1]).building.defense < tile.units[playerId]:
                    commands.append(self.GameHelper.single_move_towards_tile_avoiding_things(playerId, tile.position, nearest_enemy_building_position, tile.units[playerId], 'stronger_buildings'))
            #otherwise focus on resource gathering and building
            else:

                commands += self.GameHelper.efficient_mine_and_build(playerId, tile.position)

        return commands






