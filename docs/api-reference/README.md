# API Reference

In order to simplify the development experience, we provided a helper library (`GameHelper`)
that provides a simple API for interacting with the game engine.

All functions described below in this API reference can be invoked on the `GameHelper` object
that is provided as an argument to your turn handling function. 


### Parameters

**param()**
```
param(param_name)
```

Returns the value you set online in Monad for the parameter `param_name`. 


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

Creates and returns a _build_ command to construct a hive at the location specified by `location`.

**mine()**

```
mine(position, num_units)
```

Creates and returns a _mine_ command to instruct _num\_units_ units at the position specified by _position_ to mine.

If the there are fewer than _num\_units_ units at the specified position, then all of the invoking player's units at that position will be instructed to mine.

### Cell Data (Getters)

**get\_cell()**

```
get_cell(x, y)
```

Get (return) the cell (`Cell` instance) that exists at the location specified by (`x`, `y`).

**get\_my\_cell\_count()**

```
get_my_cell_count()
```

Get (return) the count (number) of map cells in which the invoking player has units.

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

**get\_my\_hive\_sites()**

```
get_my_hive_sites()
```

Get (return) a list of all of cells (`Cell` instances) in which the invoking player controls a hive.

Notice that this is distinct from the `get_my_hives()` function in that it returns a list of cells, rather than a list of hives (`Hive` instances).

**get\_enemy\_hive\_sites()**

```
get_enemy_hive_sites()
```

Get (return) a list of all of cells (`Cell` instances) in which enemy players control hives. Enemy players are defined as all players who are not the invoking player.

Notice that this is distinct from the `get_enemy_hives()` function in that it returns a list of cells, rather than a list of hives (`Hive` instances).

### Hive Data (Getters)

**get\_my\_hive\_count()**

```
get_my_hive_count()
```

Get (return) a count (number) of all hives over which the invoking player has control.

**get\_enemy\_hive\_count()**

```
get_enemy_hive_count()
```

Get (return) a count (number) over which enemy players have control. Enemy players are defined as all players who are not the invoking player.

**get\_my\_hives()**

```
get_my_hives()
```

Get (return) a list of all hives (`Hive` instances) over which the invoking player has control.

**get\_enemy\_hives()**

```
get_enemy_hives()
```

Get (return) a list of all hives (`Hive` instances) over enemy players have control. Enemy players are defined as all players who are not the invoking player.

**get\_hive\_potential()**

```
get_hive_potential()
```

Get (return) the number of hives that the invoking player may currently contruct given the value of resources that this player currently possesses.

### Unit Data (Getters)

**get\_my\_total\_unit\_count()**

```
get_my_total_unit_count()
```

Get (return) the total number of units on the map over which the invoking player has control.

Notice that this is distinct from the number of cells on the map over which the invoking player has control — unit count represents total offensive and defensive power, while cell count describes the number of locations over which these units are allocated.

**get_enemy_total_unit_count()**
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

<div style="padding-bottom:50px"></div>
