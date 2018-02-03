import sys
import time

print("I'm bot1.py asjs")
sys.stdout.flush()

i = 0
while True:
    l = sys.stdin.readline()
    print(str(i) + ": bot 1 received: " + l,)
    i += 1
    sys.stdout.flush()
