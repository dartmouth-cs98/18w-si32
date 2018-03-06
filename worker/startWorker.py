import traceback
# from SimpleGame import SimpleGame
from game.Si32_Game import Game_state

from Bot import DockerBot
from waitForGame import pollUntilGameReady
from endpoints import post_match_success, post_match_crash

gameClasses = {
    'SimpleGame': Game_state
}

def run_worker():
    while True:

        # get the next game
        (botSpecs, gameType, matchId) = pollUntilGameReady()

        bots = []

        # create a bot object for each bot that's in this match
        for b in botSpecs:
            bots.append(DockerBot(b['id'], b['index'], b['url']))
        game = gameClasses[gameType](bots)

        try:
            # we'll need more than just a log at some point
            # should probably return a tuple of log and results, which would contain
            # flags/info on game termination (timeout, completion, bot error, etc.)
            game.start()

            print("Got results.")

            # send the results back to the server
            post_match_success(matchId, game.get_log())

        except Exception as err:
            print("GAME ERR")
            print(err)
            # TODO attribute fault to the bot that caused an error and set them as loser
            # or determine that the crash was our fault
            crashedBot = None
            for b in bots:
                if not b.is_running():
                    crashedBot = b.name

            print("%s crashed" % crashedBot)

            if crashedBot:
                rankedPlayers = game.get_ranked_by_units()
                reordered  = [p.bot.name for p in rankedPlayers if p.bot.name != crashedBot] + [crashedBot] # move crashed bot to the end
                post_match_crash(matchId, reordered, crashedBot)

        try:
            for b in bots:
                b.cleanup()
        except Exception as err:
            print("Issue cleaning up.")
            print(err)

        print("Done cleaning up.")


run_worker()
