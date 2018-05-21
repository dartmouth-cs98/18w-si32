# LocalBot.py
# Class definition for 'LocalBot'

from subprocess import Popen, PIPE, call

from game.Bot import Bot

# The Bot wrapper for local bot development.
#
# Constructor Arguments
# fp (string)       - file path to the botfile.
# player_num (int)  - player number assigned to this player in match (ID).

class LocalBot(Bot):
    def __init__(self, fp, player_num):
        self.name = fp
        self.player_num = player_num
        self.params = {}

    def prep(self):
        return

    def run(self):
        command = ["python", "./%s" % self.name]
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE, bufsize=50000)

    def cleanup(self):
        try:
            self.proc.kill()
        except Exception as e: # proc already exited
            print(e)
            pass
