# API Reference

In order to simplify the game experience, we have provided a game helper which will provide
user bots with most of the information they might need for developing.
At the top of your bot.py file, you will likely see the following lines:
```
import sys
import time
from GameHelper import GameHelper

game = GameHelper()
```
Here the 'game' variable is the initialized object of the GameHelper, which provides a lot of useful methods, and allows your bot to read the game state. For the functions described below, they will be called from this GameHelper object.

For example,
```
game.move((1,1), 5, 'NORTHEAST')
```
Will return a *move* command which will move 5 of your units from the cell at coordinates (1,1) to the adjacent cell in the northeasten direction.

### Command Creation

**move()**

```
move(position_from, num_units, direction)
```

Creates and returns a _move_ command to move `num_units` units from the cell specified by `position_from` in the direction specified by `direction`.

**move_towards()**

```
move_towards(position_from, position_to, num_units=None)
```

Creates and returns a _move_ command to move `num_units` units from the cell specified by `position_from` in the direction of the cell specified by `position_to`. That is, the units are moved in such a way that the distance between the cell specified by `position_from` and the cell specified by `position_to` is decreased.

If `num_units` is not specified, all of the units in the cell specified by `position_from` will be affected by the generated command.

**build()**

```
build(position)
```

Creates and returns a _build_ command to construct a building at the location specified by `location`.

**mine()**

```
mine(position, num_units)
```

Creates and returns a _mine_ command to instruct _num\_units_ units at the position specified by _position_ to mine.

If the there are fewer than _num\_units_ units at the specified position, then all of the invoking player's units at that position will be instructed to mine.

#### Cell Data (Getters)

**get\_cell()**

```
get_cell(x, y)
```

Get (return) the cell (`Cell` instance) that exists at the location specified by (`x`, `y`).

**get\_my\_cell\_count()**

```
get_my_cell_count()
```

Get (return) a count (number) of the map cells in which the invoking player has units.

**get\_enemy\_cell\_count()**

```
get_enemy_cell_count()
```

Get (return) a count (number) of the map cells in which enemy players have units. Enemy players are defined as all players who are not the invoking player.

**get\_my\_cells()**

```
get_my_cells()
```

Get (return) a list of all of the cells (`Cell` instances) in which the invoking player has units.

**get\_enemy\_cells()**

```
get_enemy_cells()
```

Get (return) a list of all of the cells (`Cell` instances) in which enemy players have units. Enemy players are defined as all players who are not the invoking player.

**get\_my\_building\_sites()**

```
get_my_building_sites()
```

Get (return) a list of all of cells (`Cell` instances) in which the invoking player controls a building.

Notice that this is distinct from the `get_my_buildings()` function in that it returns a list of cells, rather than a list of buildings (`Building` instances).

**get\_enemy\_building\_sites()**

```
get_enemy_building_sites()
```

Get (return) a list of all of cells (`Cell` instances) in which enemy players control buildings. Enemy players are defined as all players who are not the invoking player.

Notice that this is distinct from the `get_enemy_buildings()` function in that it returns a list of cells, rather than a list of buildings (`Building` instances).

#### Building Data (Getters)

**get\_my\_building\_count()**

```
get_my_building_count()
```

Get (return) a count (number) of all buildings over which the invoking player has control.

**get\_enemy\_building\_count()**

```
get_enemy_building_count()
```

Get (return) a count (number) over which enemy players have control. Enemy players are defined as all players who are not the invoking player.

**get\_my\_buildings()**

```
get_my_buildings()
```

Get (return) a list of all buildings (`Building` instances) over which the invoking player has control.

**get\_enemy\_buildings()**

```
get_enemy_buildings()
```

Get (return) a list of all buildings (`Building` instances) over enemy players have control. Enemy players are defined as all players who are not the invoking player.

**get\_building\_potential()**

```
get_building_potential()
```

Get (return) the number of buildings that the invoking player may currently contruct given the value of resources that this player currently possesses.

### Unit Data (Getters)

**get\_my\_total\_unit\_count()**

```
get_my_total_unit_count()
```

Get (return) the total number of units on the map over which the invoking player has control.

Notice that this is distinct from the number of cells on the map over which the invoking player has control — unit count represents total offensive and defensive power, while cell count describes the number of locations over which these units are allocated.

```
get_enemy_total_unit_count()
```

Get (return) the total number of units on the map over which enemy players have control. Enemy players are defined as all players who are not the invoking player.

Notice that this is distinct from the number of cells on the map over which enemy players have control — unit count represents total offensive and defensive power, while cell count describes the number of locations over which these units are allocated.

### Resource Data (Getters)

**get\_my\_resource\_count()**

```
get_my_resource_count()
```

Get (return) the current total value of resources controlled by the invoking player.
