import sys
import os
import requests
import urllib.request

API = 'http://localhost:5000/worker'
if 'API_ROUTE' in os.environ:
    API = os.environ['API_ROUTE']

def is_game_ready():
    return requests.get(API + '/nextTask')

def get_bot_file(id, bnum):
    urllib.request.urlretrieve(API + '/file/' + str(id), 'bot' + str(bnum + 1) + '/bot.py')
