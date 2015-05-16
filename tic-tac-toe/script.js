var player = ["O", "X"]; //o, x, or . (win)
var difficulty = ["easy", "medium", "hard"]
var turn = 0, gameEnded = false;
var gameMode = "playWithFriends"; // gameMode possible values are playWithFriends, easy, medium or hard
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

    if(gameMode !== "playWithFriends" && player[turn] !== "O" && !gameEnded){
        setTimeout(playEasy, 400);
    }
}

function interestingCell(row, col){ //a cell is consider as interesting as it will effect the winning or not after a move
    var interesting = {interestingRow: [], interestingCol: [], interestingMajorDia: [], interestingMinorDia: []};
    for(var i = 0; i < 3; i++){
        // row
        interesting.interestingRow.push([row, i]);

        // col
        interesting.interestingCol.push([i, col]);
        
        // major dia
        interesting.interestingMajorDia.push([i, i]);
        
        // minor dia
        interesting.interestingMinorDia.push([i, 2-i]);
    }

    return interesting;
}

function stateCheck(row, col){
    var winner = ".", matches = interestingCell(row, col);
    
    for(var key in matches){
        var matchedCell = 0;
        for(var i = 0; i < matches[key].length; i++){
            if(state[matches[key][i][0]][matches[key][i][1]] === state[row][col]){
                matchedCell++;
            }
        }
        if(matchedCell === 3){
            // remove previous cell hover class, IF not player
            var percellnum =  playsequence[playsequence.length-2][0]*3 + playsequence[playsequence.length-2][1];
            var id = "cell" + percellnum.toString();
            document.getElementById(id).className = "";
            
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
    if(gameMode !== "playWithFriends" && turn === 1){
        setTimeout(undo, 300);
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

function playWithFriends(){
    if(document.getElementById("playWithFriends").className.length === 0){ //not selected
        document.getElementById("challengeMe").className = "";
        document.getElementById("playWithFriends").className = "selected";
        gameMode = "playWithFriends";
        reset();
    }
}

function challengeMe(){
    var oriGameMode = gameMode;
    document.getElementById("playWithFriends").className = "";
    document.getElementById("challengeMe").className = "selected";
    for(var i = 0; i < 3; i++){
        if(document.getElementById(difficulty[i]).checked === true){
            gameMode = difficulty[i];
            break;
        }
    }
    if(gameMode === "playWithFriends"){ //radio not selected
        gameMode = difficulty[0]; //easy by defualt
        document.getElementById(difficulty[0]).checked = true;
    }
    if(gameMode !== oriGameMode){
        reset();
    }
}


function playEasy(){ // easy player will block attack then random
    var block = blockAttack();
    var random = randomMoves();
    var playing;
    if(block.length >= 1){
        // play this cell
        playing = block; 
    }
    else{
        playing = random;
    }

    var cellnum = playing[0]*3 + playing[1];
    var id = "cell" + cellnum.toString();
    document.getElementById(id).click(); //play this cell
}

function playMedium(){ // medium player will block attack and play attack then random
    var block = blockAttack();
    var attack = playAttack();
    var random = randomMoves();
    var playing;

    var cellnum = playing[0]*3 + playing[1];
    var id = "cell" + cellnum.toString();
    document.getElementById(id).click(); //play this cell
}

function playHard(){ // hard player will use my personal algorithm (gain from experience and others style)

}

function blockAttack(){
    var interesting = interestingCell(playsequence[playsequence.length-1][0], playsequence[playsequence.length-1][1]);

    for(var key in interesting){
        var setOfCell = interesting[key];
        var matches = 0;

        for(var i = 0; i < setOfCell.length; i++){
            if(state[setOfCell[i][0]][setOfCell[i][1]] === player[+!turn]){ //equal to previous player
                matches++;
            }
        }
        if(matches === 2){ //attacking
            for(var i = 0; i < setOfCell.length; i++){
                if(state[setOfCell[i][0]][setOfCell[i][1]] === "."){ //can block
                    return setOfCell[i]; //block
                }
            }
        }
    }
    return []; // nothing to block
}

function playAttack(){

}

function randomMoves(){
    var empty = 0;
    for(var i = 0; i < state.length; i++){
        for(var j = 0; j < state.length; j++){
            if(state[i][j] === "."){
                empty++;
            }
        }
    }
    var d = new Date();
    var random = d.getTime()%empty + 1;

    for(var i = 0; i < state.length; i++){
        for(var j = 0; j < state.length; j++){
            if(state[i][j] === "."){
                random--;
                if(random === 0){
                    return [i, j];
                }
            }
        }
    }

    return [0, 0];
}