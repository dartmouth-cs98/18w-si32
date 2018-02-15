class Unit:

    def __init__(self, position, map):
        self.hp = 100 #health points
        self.position = position #position on the battleground
        self.status = 1 #whether unit is idle (1), mining (2), or building (3). If unit is dead its status is (0)
        self.map = map

    def set_health(self, new_hp): #sets new value for unit health (i.e. when unit takes damage)
        self.hp = new_hp

    def take_damage(self, damage):
        self.hp = self.hp - damage

        if self.hp <= 0: # If unit has died, update its status
            self.set_status(0)

    def set_position(self, new_position): #set new value for unit position (i.e. when unit moves)
        self.position = new_position

    def set_status(self, new_status): #change unit status
        self.status = new_status
