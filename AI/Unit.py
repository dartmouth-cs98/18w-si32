class Unit:
    def __init__(self, position, unitId):
        self.HP = 1
        self.position = position
        self.unitId = unitId

    def __str__(self):
        return "Unit " + str(self.unitId) + " --- " + "HP: " + str(self.HP) + ", Position: " + str(self.position)


