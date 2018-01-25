import sys
from subprocess import Popen, PIPE

# this function is a placeholder for the entry point
# of the actual game. It will consume a list of Bots
# and loop, receiving/writing to the bots until game is over.
# It should probably write to a file that represents the game log,
# and stdout from the master be left for debugging purposes.
def start(bots):
    for b in bots:
        b.prep()

    for b in bots:
        b.run()

    for b in bots:
        print b.read(),
        sys.stdout.flush()

    for i, b in enumerate(bots):
        b.write("hello bot %d \n" % (i+1))

    for b in bots:
        print b.read(),

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
