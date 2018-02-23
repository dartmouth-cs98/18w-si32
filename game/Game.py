from abc import ABC, abstractmethod
import sys
from subprocess import Popen, PIPE

class Game(ABC):
    def __init__(self, bots):
        self.bots = bots

        for b in bots:
            b.prep()

        for b in bots:
            b.run()

        for b in bots:
            print(b.read())
            sys.stdout.flush()

        for i, b in enumerate(bots):
            b.write("%d\n" % (i))

        super().__init__()


    @abstractmethod
    def start(self):
        pass

    @abstractmethod
    def game_loop(self):
        '''
        General game loop will probably look something like:
        while game not over:
            for each bot:
                send bot whatever game state they can see

            for each bot:
                read bots moves

            update game state with all moves from all bots

            (do each loop independently to benefit from the fact
            they're independent processes and we don't need to wait
            for first to finish before second starts working)
        '''
        pass
