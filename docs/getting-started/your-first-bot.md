# Your First Bot

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
Takes as input a tuple **location**, another tuple **direction**, and an integer **n_units**, returns a Command object with the inputted parameters as its characteristics. **direction** will be a vector, e.g. (1, 0) will correspond to a northern movement.

**position_towards(position_from, position_to)**
Takes as input two tuples **position_from** and **position_to**, returns a new position that is one cell away from **position_from** in a direction that is closer to **position_to** than **position_from**; the horizontal direction will take priority over the vertical.

**move_towards(position_from, position_to, n_units)**
Takes as input two tuples **position_from** and **position_to** and an integer **n_units**, returns a Command with type move that will get closer to **position_to** from **position_from**, with number of units **n_units**.

**get_occupied_tiles(playerId)**
Takes as input an integer **playerId**, returns a list of Tile objects corresponding to all Tiles in which the player with Id **playerId** controls at least one unit.

**my_occupied_tiles()**
Returns a list of Tile objects controlled by the bot calling the function.

**enemy_occupied_tiles()**
Returns a list of Tile objects controlled by the bot's enemy.

**get_tile(x, y)**
Takes as input two integers **x** and **y** and returns the Tile object with that position.

**my_buildings()**
Returns a list of tiles in which the bot controls a building

**enemy_buildings()**
Returns a list of buildings in which the bot's enemy controls a building

**my_resource_count()**
Returns the number of resource controlled by the bot

**compare_building_count()**
Returns True if the bot controls more buildings than the bot's enemy, otherwise returns False

**compare_unit_count()**
Returns True if the bot controls more units than the bot's enemy, otherwise returns False

**compare_resource()**
Returns True if the bot has more resource than the bot's enemy, otherwise returns False

**my_units_at_pos(pos)**
Takes as input a tuple **pos** and returns the number of units at the Tile with position **pos**

**move(position_from, number_of_units, direction)**
Takes as input a tuple **position_from**, an integer **number_of_units**, and another tuple **direction**, returns a Command with type **move** with position **position_from**, number of units **number_of_units**, and direction **direction**

**build(position_build, number_of_units)**
Takes as input a tuple **position_build** and an integer **number_of_units**, returns a Command with type **build** with position **position_build** and number of units **number_of_units**


**mine(position_mine, number_of_units)**
Takes as input a tuple **position_mine** and an integer **number_of_units**, returns a Command with type **mine** with position **position_mine** and number of units **number_of_units**

**get_number_of_buildings_belonging_to_player(playerId)**
Returns the number of buildings controlled by the player with Id **playerId**

**get_nearest_building_position_and_distance_belonging_to_player(x, y, playerId)**
Takes as input two integers **x** and **y** and an integer **playerId**, returns the Building closest to **(x, y)** (Manhattan distance) controlled by the player with Id **playerId**

**get_nearest_enemy_building_position()**
Returns the position of the enemy Building that is the closest to any building controlled by the bot

**get_free_position_with_greatest_resource_of_range(x, y, r)**
Takes as input three integers **x**, **y**, and **r**, returns the position with the greatest resource that is:
1. free of any building (can be mined)
2. within a Manhattan distance of **r** of **(x, y)**

**get_adjacent_free_position_with_greatest_resource(self, x, y)**
Takes as input two integers **x**, **y**, returns the building-free position with the greatest resource that is adjacent to **(x, y)**

**get_nearest_player_unit_pos_to_tile(x, y, playerId)**
Takes as input three integers **x**, **y**, and **playerId**, returns a tuple (**nearest_pos**, **distance**) where:
**nearest_pos** is the position occupied by units of player with Id **playerId** that is closest to **(x, y)** (right now, it's Manhattan distance; later on, will be the closest distance with regard to buildings and obstacles)
**distance**is that distance




