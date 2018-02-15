import sys
import os
import requests
import urllib.request

# by default use localhost, but if api_route set in environment point to different url
API = 'http://localhost:3000/worker'
if 'api_route' in os.environ:
    API = os.environ['api_route']

def is_game_ready():
    return requests.get(API + '/nextTask')

def get_bot_file(url, bnum):
    urllib.request.urlretrieve(url, '/bot' + str(bnum) + '/bot.py')

# QUESTION: will api have already a game object, and we need to pass the id?
# Or will we just pass the bot ids and the results
def post_match_result(matchId, result, log):
    body = {
        'log': log,
        'matchId': matchId,
        'result': result
    }

    # TODO retry on failure?
    return requests.post(API + '/result', json=body)
