import os
import sys
import msgpack 
import struct
import json
from subprocess import Popen, PIPE, call
import msgpack

# read from the calling file/pipe 
def read(buf):
    # always read how long first
    #sys.stderr.write("reading\n")

    # read how many bytes we're expecting
    (l,) = struct.unpack("i", buf.read(4))

    #sys.stderr.write(str(l))
    #sys.stderr.write(" is the len\n")

    # read and unpack the actual message
    m = msgpack.unpackb(buf.read(l), encoding='utf-8')
    #sys.stderr.write(str(m))

    return m

# write to the file/pipe
def write(buf, message):
    packed = msgpack.packb(message)
    n = len(packed)

    buf.write(struct.pack("i", n))
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

    # pass binary data through to the bot's stdin
    def write_binary(self, data):
        print("writing binarY!")

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
