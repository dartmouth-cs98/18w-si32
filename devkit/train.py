# train.py
# Iteratively run matches and output result metadata.

import sys
import argparse

from game.Bot import LocalBot
from game.GameState import GameState

MAX_ARGS = 4   # maximum of 4 bots in single match
MIN_ARGS = 2   # minimum of 2 bots in single match

DEFAULT_ITERS = 5   # default number of match iterations

# ------------------------------------------------------------------------------
# Main

def main():
    args = parse_arguments()

    botfiles = args.botfiles
    uniform_map = args.uniform
    n_players = len(args.botfiles)
    iters = DEFAULT_ITERS if args.iters is None else int(args.iters[0])

    wins = {}

    # wins[i] = n encodes player with playerID i has n wins
    for i in range(n_players):
        wins[i] = 0

    print_progress(0, iters)

    for i in range(iters):
        # set up bots by loading from source files
        bots = [LocalBot(arg, i) for (i, arg) in enumerate(botfiles)]

        # initialize the match
        game = GameState(bots, uniform_map)

        # run the match
        game.start()

        # get the rankings from completed match
        winnerID = game.get_ranked_players()[0].get_ID()
        wins[winnerID] += 1

        # clean up after ourselves
        for bot in bots:
            bot.cleanup()

        # display progress
        print_progress(i, iters)

    print("---------------PERFORMANCE REPORT---------------")
    for i in range(n_players):
        print("  Bot {}: {} wins".format(i, wins[i]))
    print("------------------------------------------------")

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
    parser.add_argument("-n", "--num-iterations",
                    dest="iters",
                    nargs=1,
                    default=DEFAULT_ITERS,
                    help="specify number of match iterations")
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

# print progress of training as static progress bar 
def print_progress(iters, total):
    s_p = ('{0:.1f}').format(100 * (iters / float(total)))
    s_f = int(60 * iters // total)
    s_b = '█' * s_f + '-' * (60 - s_f)

    # write onto the same line in each call
    sys.stdout.write('\rTraining Progress: |%s| %s%% (%s / %s)' % (s_b, s_p, iters, total))
    sys.stdout.flush()

    # print newline on completetion
    if iters == total:
        print()

# custom action for requiring between 2-4 botfiles specified
def required_length():
    return RequiredLength

# ------------------------------------------------------------------------------
# Helper Class Definition

class RequiredLength(argparse.Action):
    def __call__(self, parser, args, values, option_string=None):
        if (not MIN_ARGS <= len(values) <= MAX_ARGS):
            msg = "must specify between {} and {} botfiles".format(MIN_ARGS, MAX_ARGS)
            raise argparse.ArgumentTypeError(msg)

        setattr(args, self.dest, values)

# ------------------------------------------------------------------------------
# Script

if __name__ == "__main__":
    main()
