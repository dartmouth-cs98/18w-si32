# Building.py
# Class definition for 'Building'

from game.params import PRODUCTION_RATE, DEFENSE_RATING

# Constructor Arguments
# ownerID: The unique ID of this building's owner.

class Building:
    def __init__(self, ownerID):
        self.ownerId = ownerID
        self.production = 0
        self.defense = DEFENSE_RATING

    # Increment the production value of this building
    # by the default production rate. 
    def increment_production(self):
        self.production += PRODUCTION_RATE

    def __str__(self):
        return ("BUILDING OWNER: " + str(self.ownerId))
