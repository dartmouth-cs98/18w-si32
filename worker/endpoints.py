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

# on success, just send the messagepack+gzipped game log
def post_match_success(matchId, log):
    files = {'log': ('log.mp.gz', log)}
    return requests.post(API + '/result/' + matchId, files=files)


# on failure, send reasoning why
def post_match_failure(matchId, result, log):
    body = {
        'gameOutput': log,
        'matchId': matchId,
        'result': result
    }

    return requests.post(API + '/result/' + matchId, json=body)
