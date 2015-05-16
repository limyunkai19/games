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
    var winner = ".", matches = {match_row: [], match_col: [], match_dia_maj: [], match_dia_min: []};

    match1 = 0, match2 = 0;
    for(var i = 0; i < 3; i++){
        //check row
        if(state[row][i] == state[row][col]){
            matches.match_row.push([row, i]);
        }
        //check col
        if(state[i][col] == state[row][col]){
            matches.match_col.push([i, col]);
        }
        //check major dia
        if(state[i][i] == state[row][col]){
            matches.match_dia_maj.push([i, i]);
        }
        //check minor dia
        if(state[i][2-i] == state[row][col]){
            matches.match_dia_min.push([i, 2-i]);
        }
    }
    
    for(var key in matches){
        //alert(key + "->" + matches[key].length);
        if(matches[key].length === 3){
            var wincell = matches[key];
            for(var i = 0; i < wincell.length; i++){
                var wincellnum =  wincell[i][0]*3 + wincell[i][1];
                var id = "cell" + wincellnum.toString();
                document.getElementById(id).className = "winner";
            }
            winner = state[row][col]; 
            document.getElementById("message").innerHTML = winner + " wins";
            gameEnded = true;
        }
    }

    
    if(playsequence.length === 9 && !gameEnded){
        document.getElementById("message").innerHTML = "Draws";
        gameEnded = true;
    }
}

function undo(){
    if(playsequence.length !== 0 && !gameEnded){
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

function touch(){
    if(!gameEnded){
        var cell = Number(this.id[4]);
        var row = Math.floor(cell/3), col = cell%3;
        if(state[row][col] === "."){
            document.getElementById(this.id).className = "mouseovercell"
        }
    }
}

function reset(){
    turn = 0, gameEnded = false;
    playsequence = [];
    state = [   [".", ".", "."],
                [".", ".", "."],
                [".", ".", "."],    ];
    for(var i = 0; i < 9; i++){
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).className = "";
    }
    document.getElementById("message").innerHTML = "O turns";
}