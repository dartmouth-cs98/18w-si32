# Game.py
# Class definition for 'Game'

import sys
from subprocess import Popen, PIPE
from abc import ABC, abstractmethod

# Game instance is the higher order wrapper around GameState.
#
# Constructor Arguments
# bots (list) - a list of the bots involved in this game.

class Game(ABC):
    def __init__(self, bots):
        self.bots = bots
        numBots = len(self.bots)

        for b in bots:
            b.prep()

        for b in bots:
            b.run()

        super().__init__()

    def get_raw_log(self):
        return self.logger.get_raw_log()

    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def get_log(self):
        pass
