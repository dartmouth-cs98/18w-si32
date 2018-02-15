class Building:
    def __init__(self, owner, tile):
        self.tile = tile # position on the battleground (10 x 10 grid) (right now buildings take 1 tile of space, probably change this later)
        self.position = self.tile.position
        self.owner = owner  # buildings will be owned by whichever player is occupying it at the time
        self.production_count = 0
        self.defense = 10  # defense rating - default 10

    def increase_production_count(self, number):  # increase production count by how many workers are on the same tile
        self.production_count += number

    def destroy_self(self):
        self.tile.destroy_building()
