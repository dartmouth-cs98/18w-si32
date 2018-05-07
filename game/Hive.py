# Hive.py
# Class definition for 'Hive'

from game.params import PRODUCTION_RATE, DEFENSE_RATING

# A Hive is constructed via a 'build' command, is always located on
# a single associated Cell, and is the sole source of resource production.
#
# Constructor Arguments
# ownerID: The unique ID of this hive's owner.

class Hive:
    def __init__(self, ownerId):
        self.ownerId = ownerId
        self.production_status = 0
        self.defense = DEFENSE_RATING

    # increment the resource value of this hive
    # by the default production rate.
    def production_tick(self):
        self.production_status += PRODUCTION_RATE

    def __str__(self):
        return ("HIVE OWNER: " + str(self.ownerId))
