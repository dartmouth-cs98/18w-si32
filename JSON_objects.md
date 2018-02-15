### Unit Command
```
[
  {
     unitId: id,
     command: 'move', 'mine', 'build',
     direction: 0-360,
     velocity: 0-1, // Probably always 1 for grid-based games, possibly useful field for potential future changes though
  }
]
```


### State

Fields: 
```
class State:
	def __init__(self, map, rules, number_of_players)
		self.map = Map(map)
		self.rules = Rules(rules, self.map)
```

```
[
	{
		players: Player[],
		map: Map,
		rules: Rules,
	}
]
```

#### Player
```
[
	{
		resources: 0-9999,
		units: Unit[],
	}
]
```

### Map
```
[
	{
		tiles: Tile[][],
		buildings: Building[]
	}
]
```
