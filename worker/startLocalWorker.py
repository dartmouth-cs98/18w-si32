import sys
from Bot import LocalBot
from SimpleGame import SimpleGame
from waitForGame import pollUntilGameReady


gameClasses = {
    'SimpleGame': SimpleGame
}

# called whenever there would be a game that this worker needs to run
def play_game():
    (botNumToPlayerIds, gameType) = pollUntilGameReady()

    # setupBots()
    bots = [
        LocalBot(name="bot1", playerNum=0),
        LocalBot(name="bot2", playerNum=1)
    ]

    game = gameClasses[gameType](bots)

    result = game.start()

    print(result)

    for bot in bots:
        bot.cleanup()
            # no new game ready

    # persistently hits endpoint, api eventually says yep run a game, here are the bot ids.
    # we fetch the bot files individually by hitting an endpoint with their id and downloading the file.
    # for now in api we just put a file in public.
    # urllib.request.urlretrieve('https://www.ibm.com/support/knowledgecenter/en/SVU13_7.2.1/com.ibm.ismsaas.doc/reference/AssetsImportCompleteSample.csv', 'ibm.csv')

    # with open('./bot1/report.xls', 'rb') as f:
    #     r = requests.post('http://httpbin.org/post', files={'./bot1/report.xls': f})
    #     print(r.text)
    # gameType = sys.argv[1]
    # if gameType not in gameClasses:
    #     print(gameType + " is not a known game.")
    #     return
    #
    # # setupBots()
    # bots = []
    #
    # pythonBotCodes =
    #
    # with open('report.xls', 'rb') as f:
    #     r = requests.post('http://httpbin.org/post', files={'report.xls': f})
    # for i, arg in enumerate(sys.argv[2:]):
    #     bots.append(LocalBot(arg, i))
    #
    # game = gameClasses[gameType](bots)
    #
    # game.start()

    # get results from game and post to server

play_game()

# called whenever there would be a game that this worker needs to run
def execGame():

    gameType = sys.argv[1]
    if gameType not in gameClasses:
        print(gameType + " is not a known game.")
        return

    # setupBots()
    bots = []

    for i, arg in enumerate(sys.argv[2:]):
        bots.append(LocalBot(arg, i))

    game = gameClasses[gameType](bots)

    game.start()

    # get results from game and post to server

# execGame()
# execGame("asdf")
