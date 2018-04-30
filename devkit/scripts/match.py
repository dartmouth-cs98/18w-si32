# match.py
# Runs a single match on your local machine, outputs results to "game.json"

import os
import sys
import argparse

# boilerplate for import from parent module
sys.path.insert(1, os.path.join(sys.path[0], '..'))

from game.Bot import LocalBot
from game.GameState import GameState

MAX_ARGS = 4   # maximum of 4 bots in single match
MIN_ARGS = 2   # minimum of 2 bots in single match

REPLAY_FN = "game.json"

# ------------------------------------------------------------------------------
# Main

def main():
    args = parse_arguments()

    # set up bots by loading from source files
    bots = [LocalBot(arg, i) for (i, arg) in enumerate(args.botfiles)]

    # initialize the match
    game = GameState(bots, args.uniform)

    # run the match
    game.start()

    # clean up after ourselves
    for bot in bots:
        bot.cleanup()

    # write the replay file
    with open(REPLAY_FN, "w") as f:
        f.write(game.get_raw_log())
        f.close()

# ------------------------------------------------------------------------------
# Helpers

# parse command line arguments
def parse_arguments():
    parser = argparse.ArgumentParser(description="Run a local Monad match.")
    parser.add_argument("botfiles",
                    type=str,
                    nargs="+",
                    action=required_length(),
                    help="paths to botfiles")
    parser.add_argument("-u", "--uniform-map",
                    dest="uniform",
                    action="store_const",
                    const=True,
                    default=False,
                    help="specify use of uniform map")
    try:
        args = parser.parse_args()
    except argparse.ArgumentTypeError as error:
        print(error)
        sys.exit()

    return args

# custom action for requiring between 2-4 botfiles specified
def required_length():
    return RequiredLength

# ------------------------------------------------------------------------------
# Helper Class Definition

# consumed by argparse to define a range of arguments to accept
class RequiredLength(argparse.Action):
    def __call__(self, parser, args, values, option_string=None):
        if (not MIN_ARGS <= len(values) <= MAX_ARGS):
            m = "must specify between {} and {} botfiles".format(MIN_ARGS, MAX_ARGS)
            raise argparse.ArgumentTypeError(m)

        setattr(args, self.dest, values)

# ------------------------------------------------------------------------------
# Script

if __name__ == "__main__":
    main()
