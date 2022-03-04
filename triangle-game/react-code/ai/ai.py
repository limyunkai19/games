import json

totalRow = 5
moveStep = 3
totalDot = totalRow * (totalRow + 1) // 2
totalState = 2**totalDot

winningProbablity = [0] * totalState
winningMove = [-2] * totalState
# losing probablity = 1-winning probablity


def triangleNumber(i):
    return i*(i+1)//2

def rc2id(row, col):
    if col > row or col < 0:
        return -1
    return triangleNumber(row) + col

drArr = [0,  0, 1, -1, 1, -1]
dcArr = [1, -1, 0,  0, 1, -1]
def getNextStates(state, r, c):
    nextState = []

    if state & 2**rc2id(r, c) != 0:
        return nextState

    for dr, dc in zip(drArr, dcArr):
        curState = state
        for k in range(moveStep):
            curId = rc2id(r + dr*k, c + dc*k)
            if curId == -1 or curId >= totalDot:
                break

            if (state & 2**curId) == 0:
                # can play
                curState |= 2**curId
                if curState not in nextState:
                    nextState.append(curState)
            else:
                break

    return nextState

def compute(state):
    if winningMove[state] != -2:
        return winningProbablity[state]

    if totalDot - bin(state).count('1') == 1:
        # base case
        winningMove[state] = -1
        winningProbablity[state] = 0
        return winningProbablity[state]

    winningProbablity[state] = 2

    # for each 0 bit
    for r in range(totalRow):
        for c in range(r+1):
            nextStates = getNextStates(state, r, c)

            # go will to next state that has minimum winning probablity
            for nextState in nextStates:
                if compute(nextState) < winningProbablity[state]:
                    winningProbablity[state] = compute(nextState)
                    winningMove[state] = nextState


    winningProbablity[state] = 1 - winningProbablity[state]
    return winningProbablity[state]


winningMove[totalState-1] = -1
winningProbablity[totalState-1] = 1
for state in range(totalState-1):
    if winningMove[state] == -2:
        compute(state)


winningMoveJson = json.dumps(winningMove)
winningProbablityJson = json.dumps(winningProbablity)

with open("../src/ai.js", "w") as f:
    f.write("const winningMove = " + winningMoveJson + "\n")
    f.write("const winningProbablity = " + winningProbablityJson + "\n")
    f.write("export { winningMove, winningProbablity };")
