class AI: #class for an AI that will make decisions throughout the Si32 game

    def __init__(self, initial_game_state): #initial "knowledge" the AI has -
                                            #right now I'm just going to assume that there is perfect information (will modify this later)

        self.update(initial_game_state)

    def get_next_move(self, game_state): #user writes this function (we'll need to check if their successor state is legal or not)
        #TODO: USER WRITES THIS
        #RETURNS A MOVE OBJECT
        pass


    def update(self, game_state): #updates the knowledge of the state of this AI
        # these five variables should constitute the state
        self.units = game_state.units  # a list of the units oontrolled by this AI
        self.enemy_units = game_state.enemy_units  # a list of the units oontrolled by the enemy AI
        self.buildings = game_state.buildings  # a list of the buildings controlled by this AI
        self.enemy_buildings = game_state.enemy_buildings  # a list of the buildings controlled by the enemy AI
        self.tiles = game_state.tiles  # a list of the tiles on the battleground

        # maybe this can just be done with a large tuple of numbers instead of classes, but the tuple will be atrociously large

