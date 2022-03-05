import json

# will be off by 1
totalRow = 101
totalCol = 151

winningMove = [[[-2, -2] for c in range(totalCol)] for r in range(totalRow)]

def isWinningState(r, c):
    if winningMove[r][c][0] != -2:
        return winningMove[r][c]

    if r == 0 or c == 0:
        # invalid state
        winningMove[r][c] = [-1, -1]
        return winningMove[r][c]

    winningMove[r][c] = [-1, -1]
    for tryR in range(1, r):
        nextR = max(tryR, r-tryR)
        if isWinningState(nextR, c)[0] == -1:
            winningMove[r][c] = [nextR, c]

    for tryC in range(1, c):
        nextC = max(tryC, c-tryC)
        if isWinningState(r, nextC)[0] == -1:
            winningMove[r][c] = [r, nextC]

    return winningMove[r][c]



for r in range(totalRow):
    for c in range(totalCol):
        if winningMove[r][c][0] == -2:
            isWinningState(r, c)

winningMoveJson = json.dumps(winningMove)
with open("../src/ai.js", "w") as f:
    f.write("const winningMove = " + winningMoveJson + "\n")
    f.write("export { winningMove };")
