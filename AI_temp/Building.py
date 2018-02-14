class Building:
    def __init__(self, owner, position):
        self.hp = 1000  # health points
        self.position = position # position on the battleground (10 x 10 grid) (right now buildings take 1 tile of space, probably change this later)
        self.owner = owner # buildings will be owned by whichever player is occupying it at the time
        self.production_count = 0

    def set_health(self, new_hp):  # sets new value for health (i.e. when taking damage)
        self.hp = new_hp

    def add_worker(self, unit):
        self.workers.append(unit)

    def contains(self, id):
        unit_exists = False

    def increase_production_count(self, number):  # increase production count by how many workers are on the same tile
        self.production_count = self.production_count + number

    def update(self):
        if self.workers == []:
            self.occupied = False

        if self.workers != []:
            n = len(self.workers)
