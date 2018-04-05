# Game Rules

### General
Monad (a.k.a. Si32) is a RTS (real-time-strategy) style game played by AI agents designed by you, the user. Users upload bots based on a template (see 'Your First Bot'), which can then compete against Monad bots written by other users over the internet. 

Monad is a turn-based strategy game played in a grid of **Cells**. Each player controls an army of **units**, each with the ability to mine **resource** (a type of currency used to build **buildings** - which spawn more units), move around the grid, or build **buildings**. During
each turn in Monad, each player's bot will process information about the game state and determine its next move, which will be communicated as an array of **Command** objects. A **Command** will determine what the units in each Cell will do in the player's turn. It contains the following information - it will specify a **Cell**, a type of action (**move**, **build**, or **mine**), a direction (if the action is of type **move** or **build**), and a number of **units**. The game will then execute these **Commands** (perform the action for the specified number of **units** in the specified cell), update the locations of the players'
**units**, updates the status of the map and the players, and then await another set of **Commands** from each player.

### Objective
The objective of Monad is to destroy each enemy player's buildings and become the sole player with buildings on the map.

Usually, this goal is achieved by performing several subtasks better or more efficiently than enemy players, namely:
- Gathering **resources** (to accelerate **building** production)
- Constructing **buildings** (to accelerate **unit** production)
- Controlling the map area to maximize favorable combat scenarios (destroying enemy **buildings**) and to minimize opponent **unit** mobility

Each player starts the game with a single **unit** and 100 **resources** (just enough to create one building).

### Victory
There are three ways in which a player can win a game of Monad
1. They are the only player controlling a nonzero number of **buildings**.
2. They have been the only player controlling a nonzero number of **units** for the last **10** turns.
3. If **2000** turns have passed and no winner has been determined by the last two conditions, the player controlling more units at the time is the winner.

### Maps
The map is the environment in which Monad games will be played. In order to test the versatility of bots and to decrease predictability of matches, the map will be randomized in terms of **resource** distribution and **obstacle** distribution. However, they all share a few basic characteristics:

The map is *grid-based*:

The map is composed of discrete **Cells**, defined by a Cartesian coordinate; each free **Cell** will initially contain some randomized amount of **resource**, and also up to one **building**, and any number of **units**. **Units** and **buildings** each occupy 1 **cell** at a time. A **cell** with an obstacle has no **resource**, and can contain no **units** or **buildings**. A **cell** containing a **building** cannot be mined for **resource** by any **unit**.

The map is *symmetric*:

In order to make games as fair as possible, and to minimize the effects of luck and variance in determining the outcome of the match, the map will be symmetric in terms of **resource** and **obstacle** distribution, and each player will start in a symmetric part of the map (e.g. in a 4-player game, each player will begin with their starter unit at the center of a quadrant of the map, and each quadrant will initially contain the same total amount of **resource** and **obstacles**). This will make sure that each player will initially have access to the same environment/resources.


### Units
**Units** are the mobile agents controlled by the **player**, responsible for combat, **resource** gathering, and **building** construction. Each **unit** occupies one **cell** in the map. Each player controls a number of **units**, which is produced by the **buildings** they control. **Units** have no concept of health points and have no identifying characteristic besides their position on the map; they are essentially indistinguishable from one another. Therefore, there is no concept of a separate **unit** Object, and the map contains all the information about each player's **units** - each **Cell** of the map will simply hold an array of numbers indicating the numbers of **units** controlled by each player in that **Cell**.

Units can be ordered around by **Commands** which have three possible types.

('current **cell**' refers to the **cell** occupied by the unit)

- **Move** - Move the unit in some direction by one **cell**

- **Build** - If there is no **building** in the current **cell**, and the player has enough **resource** for a building, create a building in the current **cell**. If there is a **building** in the **cell**, help the **building** produce new **units** faster. A **building** will be created instantly (within the turn) if it's possible to do so (unlike conventional RTS games like Warcraft where building production is an extended process and can be disrupted by enemies).

- **Mine** - Gather a unit of **resource** from the current **cell**, if there is any resource remaining.

### Buildings
**Buildings** are static objects controlled by the **player**, which spawn new **units**. have several noteworthy properties. A **building** can be created by any **unit** on a free **cell**, and costs 100 units of **resource**. Each building occupies one **cell** in the map (although this may be changed later). A building will continuously spawn new **units** in the **cell** at a rate proportional to the number of allied **units** stationed at the building's **cell**. 

Each building has a default **intrinsic defense rating** of 10. The building essentially serves as an additional force of 10 **units** in combat when defending, which regenerates every turn.

Buildings can destroyed through combat. If an enemy player sends a number of **units** equal to or greater than the number of allied units + the building's **intrinsic defense rating**, the building and all its allied **units** are destroyed (along with a number of enemy **units** equal to the number of allied **units** + the building's **intrinsic defense rating**). If the enemy player sends a number of **units** less than the building's **intrinsic defense rating**, all attacking enemy **units** are destroyed and the building and its allied **units** are unharmed. If the enemy player sends a number of **units** larger than the building's **intrinsic defense rating** but smaller than the sum of the **intrinsic defense rating** and its number of docked allied **units**, all attacking enemy **units** are destroyed but the building loses a number of allied **units** equal to the difference of the number of attacking enemy **units** and the **intrinsic defense rating** plus one.

Some examples:
- **Building** has no allied **units** docked, enemy attacking force has 8 **units** --> enemy loses 8 attacking **units**, **building** unaffected.
- **Building** has no allied **units** docked, enemy attacking force has 10 **units** --> enemy loses 10 attacking **units**, **building** is destroyed.
- **Building** has 3 allied **units** docked, enemy attacking force has 8 **units** --> enemy loses 8 attacking **units**, **building** and 3 allied **units** unaffected.
- **Building** has 3 allied **units** docked, enemy attacking force has 15 **units** --> enemy loses 13 attacking **units**, **building** and 3 allied **units** are destroyed.
- **Building** has 3 allied **units** docked, enemy attacking force has 12 **units** --> enemy loses 12 attacking **units**, **building** loses 3 allied **units**.
**Building** has 3 allied **units** docked, enemy attacking force has 13 **units** --> enemy loses 13 attacking **units**, **building** and 3 allied **units** are destroyed.



### Combat
Combat in Monad takes place in two discrete phases:

#### First phase: collision phase:

 If enemy players would send units in opposite directions from adjacent **Cells**, the enemy groups of **units** would fight, with the weaker group eliminated and the stronger group losing a number of **units** equal to the weaker group's number.

 After the game state receives all **Commands** for the turn from all players, it checks if any of the **Commands** would send enemy **unit** groups from adjacent **Cells** into each other. If there are any such 'collisions' between **unit** groups, **units** will be subtracted from each **unit** group until only the stronger group remains or both groups are eliminated. 

#### Second phase: cell-update phase:

A **Cell** is defined to not have **units** of more than one player at the start of every turn. If a **Cell** ends up having nonzero numbers of **units** of more than one player (as a result of **unit** movement), the game state will process some combat operation which will result in only one or less players with remaining units in the **Cell**.

For example, Player A sends 8 **units** North from **(2, 4)** and Player B sends 5 **units** South from **(2, 5)**; these two **Commands** will be replaced by an effectively equal single **Command** of "Player A sending 3 **units** North from **(2, 4)**.

 - In the case of two players:
The player with the greater number of **units** in the **Cell** will lose a number of **units** equal to the other player's number of **units**, and the other player's number of **units** will be set to zero.

- In the case of three or more players:
  - **1**. Each player with nonzero **units** in the **Cell** will assign some number of **units** towards each other player with nonzero **units** in the **Cell** proportional to the enemy player's number of **units**, rounded down. Any leftover units will be randomly assigned towards an enemy player. 
  
    - For example, Player A has 8 units, Player B has 12 units, and Player C has 7 units. 
      - Player A will send (12/19) of his 8 **units**, rounded down --> 5 **units** to Player B and (7/19) of his 8 **units**, rounded down --> 2 **units** to Player C. The remaining **unit** (8 - 5 - 2 = 1) will be randomly assigned to Player B or Player C. 
      - Player B will send (8/15) of his 12 **units**, rounded down --> 6 **units** to Player A and (7/15) of his 8 **units**, rounded down --> 5 **units** to Player C. The remaining **unit** (12 - 6 - 5 = 1) will be randomly assigned to Player A or Player C.
      - Player C will send (8/20) of his 7 **units**, rounded down --> 2 **units** to Player A and (12/20) of his 7 **units**, rounded down --> 4 **units** to Player B. The remaining **units** (8 - 2 - 4 = 2) will be randomly assigned to Player A or Player B.

  - **2**. After assignments are complete, the assigned **units** between each pair of players will fight, with the weaker group eliminated and the strong group losing a number of **units** equal to the number of the weaker group. Let's assume that all randomly assigned **units** are just sent to the first enemy player, alphabetically. If we use tuples to represent the players and the **units** they send towards each other:

     (A, B): (5 + 1, 6 + 1) = (6, 7) (Player A sends 6 **units** to Player B and Player B sends 7 **units** to Player A)
     Player A sends 6 **units** to Player B, Player B sends 7 **units** to Player A; Player A loses all sent **units**, Player B keeps 1 **unit**
     
     (A, C): (2, 2 + 1) = (2, 3)
     Player A sends 2 **units** to Player C, Player C sends 3 **units** to Player A; Player A loses all sent **units**, Player C keeps 1 **unit**
   
     (B, C): (5, 4)
     Player B sends 5 **units** to Player C, Player C sends 4 **units** to Player B; Player B keeps 1 **unit**, Player C loses all sent **units**
     
     ![https://i.imgur.com/MnDKg7u.png](Alt Text)
       
  - **3**. After combat, the number of **units** in each **Cell** will be updated accordingly.
    
     So Player B keeps 2 **units** in total and Player C keeps 1 **unit** in total.
    
  - **4**. Keep repeating the above process until there are no more than one players with nonzero **units** in the **Cell**.
    
     So Player B would fight Player C, and Player B would keep 1 **unit**, and Player C would lose all **units**.
    
  **Result**: Player B keeps 1 **unit**, Players A and C lose all **units**.
    
    

