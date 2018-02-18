
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
