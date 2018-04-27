import os
import sys
import msgpack 
import struct
from subprocess import Popen, PIPE, call

# read from the calling file/pipe 
def read(buf):
    # read how many bytes we're expecting
    (l,) = struct.unpack("i", buf.read(4))

    # read and unpack that many bytes as the actual message
    return msgpack.unpackb(buf.read(l), encoding='utf-8')

# write to the file/pipe
def write(buf, message):
    packed = msgpack.packb(message)

    # tell the consumer how many bytes to expect
    buf.write(struct.pack("i", len(packed)))

    # then send the actual data
    buf.write(packed)
    buf.flush() 


# Bot is our internal wrapper around an end-user implementation of a bot
# this class should handle prepping and running a bot in a separate
# process (dependent on driver) and provide a standard interface to
# send/receive info from that bot process

class Bot(object):
    def __init__(self):
        print("Bot should not be directly called")

    # just read and return the next line from the bot's stdout
    def read(self):
        return read(self.proc.stdout)

    # pass line through to the bot's stdin
    def write(self, data):
        write(self.proc.stdin, data)

# The Bot wrapper for local bot development.
#
# Constructor Arguments
# fp (string)      - file path to the botfile.
# playerNum (int)  - player number assigned to this player in match (ID).
class LocalBot(Bot):
    def __init__(self, fp, playerNum):
        self.name = fp
        self.playerNum = playerNum

    def prep(self):
        return

    def run(self):
        command = ["python", "./%s" % self.name]
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE)

    def cleanup(self):
        try:
            self.proc.kill()
        except Exception as e: # proc already exited
            print(e)
            pass
