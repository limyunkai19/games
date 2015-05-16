var player = ["O", "X"]; //o, x, or . (win)
var turn = 0, gameEnded = false;
var playsequence = [];
var state = 
                [   [".", ".", "."],
                    [".", ".", "."],
                    [".", ".", "."],    ];

function play() {
    var cell = Number(this.id[4]);
    var row = Math.floor(cell/3), col = cell%3;
    if(state[row][col] != "." || gameEnded){
        return;
    }
    state[row][col] = player[turn];
    turn ^= 1;
    playsequence.push([row, col]);
    document.getElementById(this.id).innerHTML = state[row][col];
    document.getElementById("message").innerHTML = player[turn] + " turns";
    stateCheck(row, col);
}

function stateCheck(row, col){
    var winner = ".", match_row = 0, match_col = 0, match_dia_maj = 0, match_dia_min = 0;

    match1 = 0, match2 = 0;
    for(var i = 0; i < 3; i++){
        //check row
        if(state[row][i] == state[row][col]){
            match_row++;
        }
        //check col
        if(state[i][col] == state[row][col]){
            match_col++;
        }
        //check major dia
        if(state[i][i] == state[row][col]){
            match_dia_maj++;
        }
        //check minor dia
        if(state[i][2-i] == state[row][col]){
            match_dia_min++;
        }
    }
    if(match_row == 3 || match_col == 3 || match_dia_maj == 3 || match_dia_min == 3){
        winner = state[row][col];
        document.getElementById("message").innerHTML = winner + " wins";
        gameEnded = true;
    }
}

function undo(){
    if(playsequence.length !== 0){
        var cell = playsequence.pop();
        var cellnum = cell[0]*3 + cell[1];
        var id = "cell" + cellnum.toString();
        state[cell[0]][cell[1]] = ".";
        turn ^= 1;
        gameEnded = false;
        document.getElementById("message").innerHTML = player[turn] + " turns";
        document.getElementById(id).innerHTML = "";
    }
}