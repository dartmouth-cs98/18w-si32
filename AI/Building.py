class Building:
    def __init__(self, position):
        self.hp = 1000  # health points
        self.position = position # position on the battleground (10 x 10 grid) (right now buildings take 1 tile of space, probably change this later)

    def set_health(self, new_hp):  # sets new value for health (i.e. when taking damage)
        self.hp = new_hp

