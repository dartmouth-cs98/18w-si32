import endpoints

# called whenever there would be a game that this worker needs to run
def pollUntilGameReady():

    r = endpoints.is_game_ready()
    response_json = r.json()

    while not new_game_available(response_json):
        time.sleep(5)
        r = endpoints.is_game_ready()
        response_json = r.json()

    # now fetch the bots from the array of ids.
    players = response_json['players']
    botNumToPlayerIds = {}
    for i, player in enumerate(players):
        botNumToPlayerIds[i] = player
        endpoints.get_bot_file(id=player, bnum=i)

    return botNumToPlayerIds, response_json['gameType']

def new_game_available(response_json):
    if ('newGame' in response_json) and (response_json['newGame']):
        return True

    return False
