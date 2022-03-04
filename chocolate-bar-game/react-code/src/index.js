import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const winningMove = [][[1, 2]]

const QUERYROW = 'row';
const QUERYCOL = 'col';
const DEFAULTROW = 8;
const DEFAULTCOL = 15;
const MAXROW = 50;
const MAXCOL = 120;
const [ ROW, COL ] = getGameInformation();
const color = Object.freeze({'validCell': 'brown', 'invalidCell': 'white', 'validDivider': 'black', 'invalidDivider': 'gray', 'selectedDivider': 'red'})

const Chocolate = ({ row, col, chocolateState, cutHorizontalHandler, cutVerticalHandler }) => {
  const [hoverH, setHoverH] = useState(-1);
  const [hoverV, setHoverV] = useState(-1);

  // c | c | c | c
  // 0 1 2 3 4 5 6
  // c | c | c | c
  // -------------
  // c | c | c | c

  let chocolate = [];
  for(let r = 0; r < 2 * row - 1; r++) {
    let chocolateRow = [];
    for(let c = 0; c < 2 * col - 1; c++) {
      let validCellr1 = 2 * chocolateState.row;
      let validCellr2 = validCellr1 + 2 * (chocolateState.height - 1);
      let validCellc1 = 2 * chocolateState.col;
      let validCellc2 = validCellc1 + 2 * (chocolateState.width - 1);

      let valid = false;
      if(validCellr1 <= r && r <= validCellr2 && validCellc1 <= c && c <= validCellc2) {
        valid = true;
      }

      if(r % 2 === 1 && c % 2 === 1) {
        // . dot divider that acts as vertical divider
        let bgColor = (hoverV === c || hoverH == r ? color.selectedDivider : color.validDivider);
        if(!valid) {
          bgColor = color.invalidDivider;
        }

        chocolateRow.push(
          <div
            key={ c }
            className='dot-divider'
            onClick={ () => cutVerticalHandler(Math.floor(c/2)) }
            onMouseEnter={ () => setHoverV(valid ? c : -1) }
            onMouseLeave={ () => setHoverV(-1) }
            style={ {backgroundColor: bgColor} }
          />
        );
      }
      else if(c % 2 === 1) {
        // | vertical divider
        let bgColor = (hoverV === c ? color.selectedDivider : color.validDivider);
        if(!valid) {
          bgColor = color.invalidDivider;
        }

        chocolateRow.push(
          <div
            key={ c }
            className='vertical-divider'
            onClick={ () => cutVerticalHandler(Math.floor(c/2)) }
            onMouseEnter={ () => setHoverV(valid ? c : -1) }
            onMouseLeave={ () => setHoverV(-1) }
            style={ {backgroundColor: bgColor} }
          />
        );
      }
      else if(r % 2 === 1) {
        // - horizontal divider
        let bgColor = (hoverH === r ? color.selectedDivider : color.validDivider);
        if(!valid) {
          bgColor = color.invalidDivider;
        }

        chocolateRow.push(
          <div
            key={ c }
            className='horizontal-divider'
            onClick={ () => cutHorizontalHandler(Math.floor(r/2)) }
            onMouseEnter={ () => setHoverH(valid ? r : -1) }
            onMouseLeave={ () => setHoverH(-1) }
            style={ {backgroundColor: bgColor} }
          />
        );
      }
      else {
        // cell
        chocolateRow.push(
          <div
            key={ c }
            className='cell'
            style={ {backgroundColor: (valid ? color.validCell : color.invalidCell)} }
          />
        );
      }
    }

    chocolate.push(
      <div key={ r } className='chocolate-row'>
        { chocolateRow }
      </div>
    );
  }

  return (
    <div className='chocolate'>
      { chocolate }
    </div>
  );
};

const Game = ({ row, col }) => {
  const [gameState, setGameState] = useState([{row: 0, col: 0, width: col, height: row}]);

  const curGameState = gameState[gameState.length-1];

  // cell idx: 0   1   2   3
  // position: c 0 c 1 c 2 c
  const handleCutHorizontal = (position) => {
    // check to discard which side
    const start = curGameState.row;
    const end = start + curGameState.height - 1;

    const upperHeight = position - start + 1;
    const lowerHeight = end - position;

    let newGamePartialState;
    if(lowerHeight >= upperHeight) {
      // discard upper
      newGamePartialState = {row: position+1, height: lowerHeight};
    }
    else {
      // discard lower
      newGamePartialState = {height: upperHeight};
    }

    setGameState([...gameState.slice(), Object.assign({}, curGameState, newGamePartialState)]);
  }

  // cell idx: 0   1   2   3
  // position: c 0 c 1 c 2
  const handleCutVertical = (position) => {
    // check to discard which side
    const start = curGameState.col;
    const end = start + curGameState.width - 1;

    const leftWidth = position - start + 1;
    const rightWidth = end - position;

    let newGamePartialState;
    if(rightWidth >= leftWidth) {
      // discard left
      newGamePartialState = {col: position+1, width: rightWidth};
    }
    else {
      // discard right
      newGamePartialState = {width: leftWidth};
    }

    setGameState([...gameState.slice(), Object.assign({}, curGameState, newGamePartialState)]);
  }

  const handleNextAction = () => {
    // fix me
    // setGameState([...gameState.slice(), nextOptimalMove(curGameState)]);
  }

  const handleUndoAction = () => {
    setGameState([...gameState.slice(0, -1)]);
  }

  return (
    <div className='game'>
      <h1 className='game-title'>Chocolate Bar Game</h1>
      <h2 className='game-information'>
        Size: { row } x { col }
      </h2>
      <div className='game-board'>
        <Chocolate
          row={ row }
          col={ col }
          chocolateState={ curGameState }
          cutHorizontalHandler={ handleCutHorizontal }
          cutVerticalHandler={ handleCutVertical }
        />
      </div>
      <div className='game-control'>
        <button
          disabled={ curGameState.width === 1 && curGameState.height === 1 }
          onClick={ handleNextAction }
        >
          Next
        </button>
        <button
          disabled={ gameState.length === 1 }
          onClick={ handleUndoAction }
        >
          Undo
        </button>
      </div>
    </div>
  )
};

ReactDOM.render(
  <Game
    row={ ROW }
    col={ COL }
  />, document.getElementById('root')
);

/* ----------------------------- Helper Function ---------------------------- */
function getGameInformation() {
  const query = new URLSearchParams(window.location.search);

  return [
    getDimentionFromQuery(query, QUERYROW, DEFAULTROW, MAXROW),
    getDimentionFromQuery(query, QUERYCOL, DEFAULTCOL, MAXCOL)
  ];
}

function getDimentionFromQuery(query, queryString, defaultVal, maxVal) {
  let n = parseInt(query.get(queryString));

  if(!n) {
    n = defaultVal;
  }

  n = Math.min(n, maxVal);
  n = Math.max(n, 1);

  return n;
}

function isWinningState(gameState) {
  // fix me
}

function nextOptimalMove(gameState) {
  // fix me
}
