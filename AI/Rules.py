
class Rules:

    def __init__(self, map, players):
        self.map = map
        self.players = players

    def verify_move(self, move):
        return self.within_bounds(move) and self.enough_units(move)

    def within_bounds(self, move):
        return self.map.tile_in_range(move.tile)

    def enough_units(self, move):
        tile = self.map.get_tile(move.tile.position)
        return tile.units[move.playerId] >= move.number_of_units

    def update_by_move(self, move):
        if move.command == 'move':
            self.update_move_command(move)

    def update_move_command(self, move):
        old_tile = move.tile
        new_tile = self.map.get_tile([old_tile.position[0] + move.direction[0], old_tile.position[1] + move.direction[1]])

        old_tile.decrement_units(move.playerId, move.number_of_units)
        new_tile.increment_units(move.playerId, move.number_of_units)

        new_tile.update_units_number()

    def update_build_command(self, move):
        if (self.player_has_enough_resources(move.playerId)) and (self.map.get_tile(move.tile.position).units[playerId] > 0):
            move.tile.create_building(move.playerId)
            self.players[move.playerId].decrement_resource(100)

    def player_has_enough_resources(self, playerId):
        return self.players[playerId].resources >= 100
