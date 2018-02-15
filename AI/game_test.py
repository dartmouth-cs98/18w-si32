from Game import Game
from time import sleep

print("Initial state:" + "\n")
game = Game()

print(game)
print('------------------------------------------------------')


while (((len(game.playerA.units)) > 0) | ((len(game.playerA.buildings)) > 0)) & (((len(game.playerB.units)) > 0) | ((len(game.playerB.buildings))) > 0):

    game.execute_turn(0)

    print('------------------------------------------------------')
    print(game)
    print('------------------------------------------------------')
    sleep(1.5)

    print('------------------------------------------------------')

    game.execute_turn(1)
    print('------------------------------------------------------')
    print(game)
    print('------------------------------------------------------')
    sleep(1.5)

    #for tile in game.map.tiles:
        #print(tile)

if (len(game.playerA.buildings) > 0):
    print("Player A wins")
elif(len(game.playerB.buildings) > 0):
    print("Player B wins")
else:
    print("Tie")

