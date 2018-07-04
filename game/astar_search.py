# astar_search.py 

# Code taken from previously written code in CS 76 (Artificial Intelligence), adapted from code written by CS 76 instructors

from game.SearchSolution import SearchSolution
from heapq import heappush, heappop


class AstarNode:
    # each search node except the root has a parent node
    # and all search nodes wrap a state object

    def __init__(self, state, heuristic, parent=None, transition_cost=0, cost=0):

        self.state = state #the state that the node is wrapping
        self.heuristic = heuristic #heuristic function output value given input self.state
        self.parent = parent #the parent of the node (along the least-expensive-so-far path from start)
        self.transition_cost = transition_cost #the cost to get from the node's parent to the node
        self.cost = cost #cost of the least-expensive-so-far path from start

    def priority(self):
        return self.cost + self.heuristic #priority for a node in  A-star search is the cost of the
                                          # least-expensive-so-far path plus its heuristic


    # comparison operator,
    # needed for heappush and heappop to work with AstarNodes:
    def __lt__(self, other):
        return self.priority() < other.priority()


# take the current node, and follow its parents back
# as far as possible. Grab the states from the nodes,
# and reverse the resulting list of states.
def backchain(node):
    result = []
    current = node
    cost = 0
    while current:
        result.append(current.state)

        current = current.parent

    result.reverse()

    return result


def astar_search(search_problem, heuristic_fn):
    start_node = AstarNode(search_problem.start_state, heuristic_fn(search_problem.start_state))
    pqueue = []
    heappush(pqueue, start_node)

    solution = SearchSolution(search_problem, "Astar with heuristic " + heuristic_fn.__name__)

    visited_cost = {}
    visited_cost[start_node.state] = 0


    # you write the rest:
    while (pqueue):
        node = heappop(pqueue)

        if search_problem.goal_test(node.state): # if we reach the goal, backchain and return the solution path
                                                 # along with its cost
            path = backchain(node)
            solution.path = path
            solution.cost = node.cost
            return solution

        successor_state_list = search_problem.get_successors(node.state) # list of current state's successors

        for successor_state in successor_state_list:
            solution.nodes_visited += 1 # checking a node for addition to the frontier counts as "visiting" it

            # add the node to the frontier if:

            # it hasn't been visited yet
            if successor_state not in visited_cost:
                visited_cost[successor_state] = visited_cost[node.state] + search_problem.transition_cost_fn(node.state, successor_state)
                successor_node = AstarNode(successor_state, heuristic_fn(successor_state), node, search_problem.transition_cost_fn(node.state, successor_state), visited_cost[node.state] + search_problem.transition_cost_fn(node.state, successor_state))
                heappush(pqueue, successor_node)
            # if it's been visited but we just found a lower path cost for it
            elif visited_cost[node.state] + search_problem.transition_cost_fn(node.state, successor_state) < visited_cost[successor_state]:
                visited_cost[successor_state] = visited_cost[node.state] + search_problem.transition_cost_fn(node.state, successor_state)
                successor_node = AstarNode(successor_state, heuristic_fn(successor_state), node, search_problem.transition_cost_fn(node.state, successor_state), visited_cost[node.state] + search_problem.transition_cost_fn(node.state, successor_state))
                heappush(pqueue, successor_node)

    return solution
