# Building.py
# Class definition for 'Building'

from game.params import PRODUCTION_RATE, DEFENSE_RATING

# A Building is constructed via a 'build' command, is always located on
# a single associated Cell, and is the sole source of resource production.
#
# Constructor Arguments
# ownerID: The unique ID of this building's owner.

class Building:
    def __init__(self, ownerId):
        self.ownerId = ownerId
        self.production_status = 0
        self.defense = DEFENSE_RATING

    # increment the resource value of this building
    # by the default production rate.
    def production_tick(self):
        self.production_status += PRODUCTION_RATE

    def __str__(self):
        return ("BUILDING OWNER: " + str(self.ownerId))
