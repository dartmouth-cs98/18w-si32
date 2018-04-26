import os
import sys
from subprocess import Popen, PIPE, call
import docker
from game.Bot import Bot
from endpoints import get_bot_file

client = docker.from_env()

# class for being run in containerized "live" environment
class DockerBot(Bot):
    def __init__(self, name, playerNum, codeUrl):
        self.playerNum = playerNum
        self.name = name
        self.codeUrl = codeUrl

    def prep(self):
        sys.stdout.flush()

        # download the user-provided bot code
        get_bot_file(self.codeUrl, self.playerNum)

        # copy everything from bot_common (provided helpers, etc.) into bot dir
        call("cp -R -L bot_common/* /bot%d" % self.playerNum, shell=True)

    def run(self):
        command = ["docker", "run", "-i",
                      "-v", "bot%d:/bot" % self.playerNum,
                      "--name", "%s" % self.name,
                      "si32-child-bot"]

        # run docker and start the bot in its own isolated environment
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE)

    def is_running(self):
        try:
            container = client.containers.get(self.name)
            return container.status == "running"
        except docker.errors.NotFound as err:
            print("Container not found, saying not running...")
            return False

    # remove docker container
    def cleanup(self):
        container = client.containers.get(self.name)
        container.remove(force=True)
        print("Killed and removed bot %d." % self.playerNum)

        # remove bot code from volume that is persistent
        call("rm -r /bot%d/*" % self.playerNum, shell=True)

