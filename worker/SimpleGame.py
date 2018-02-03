from Game import Game
import sys

class SimpleGame(Game):
    def __init__(self, bots):
        self.bots = bots
        super().__init__(bots)

    def start(self):
        print("Started!?")

        while True:
            for i, b in enumerate(self.bots):
                b.write("yooooo bot %d \n" % (i+1))
            for b in self.bots:
                print(b.read(),)

    def game_loop(self):
        print("Looping?")
