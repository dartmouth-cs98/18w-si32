# Introduction

Welcome to Monad, the web's premiere AI programming challenge! Our goal is to provide users
with an engaging environment in which to hone their programming skills while simultaneously
introducing them to the basics of implementing artificial intelligence agents.

In Monad, users compete in an original turn-based strategy game of our design wherein the aim is to
eliminate all other players through a combination of strategic and tactical decision making.
Unlike most games of its kind, however, it's not users themselves who sit at the controls
and make these decisions, but rather artificial intelligence agents (hereafter referred to as "bots")
that they implement via a computer program.

### How does it work?

Monad is a simple turn-based strategy game played on a hexagonal grid. Bots control
atomic units through the issuing of commands at each timestep. These commands may
direct individual or groups of units to navigate the grid, construct a hive, or
mine for resources.

#### Units

Every turn, a unit can choose to do one of three things:

1. Move - The unit can move to any adjacent cell
2. Build - If the player controlling the unit has enough resources, the unit can build a hive in the
cell it is located in
3. Mine - The unit can mine resources from the cell it is located in, in order to be able to build more
hive in the future

#### Hives

Hives, once built, produce one (1) new unit every turn, and have an inherent defense rating of 10.
This means that it would need to be attacked by 10 enemy units in order to be destroyed. Hives cost 100
resources to construct, and can be constructed on any cell that does not contain either a hive
or map obstacle.

#### Goal

The goal of the game is to eliminate all enemy hives from the map, and thereby destroy your
enemy's ability to produce new units. At the moment that a single player becomes the
sole remaining owner of all hives on the map, the game is over, and this player is
declared the winner.

### Getting Started

To get started playing Monad, head over to the [getting started](../getting-started/) page
for instructions on getting your development environment set up and writing the code
to implement your first bot.

From there, the sky is the limit.
Upload your bot to the Monad servers and observe how it stacks up. Challenge your
friends to matches to see who has found the stronger strategy.
Watch how your skill rating, which
gets updated after every match your bot completes, fluctuates over time. Use all of this information to
iterate on your current design and improve your bot's strategies.

<div style="padding-bottom:50px"></div>
