resource_cost = 1
class Building:

    def __init__(self, position, buildingId, owner):
        self.defense = 3  # health points
        self.position = position # position on the battleground (10 x 10 grid) (right now buildings take 1 tile of space, probably change this later)
        self.buildingId = buildingId
        self.owner = owner


    def set_health(self, new_hp):  # sets new value for health (i.e. when taking damage)
        self.HP = new_hp

    def __str__(self):
        return "Building " + str(self.buildingId) + " --- " + ", Position: " + str(
            self.position)
