class State:
    def __init__(self, units, enemy_units, buildings, enemy_buildings, tiles):
        self.units = units
        self.enemy_units = enemy_units
        self.buildings = buildings
        self.enemy_buildings = enemy_buildings
        self.tiles = tiles

    def get_successor_state(self, move): #returns state that will succeed from this state if some move is made
        pass

    def is_legal(self): #checks if the state is legal (we'll write this function, not editable to the user)
        pass