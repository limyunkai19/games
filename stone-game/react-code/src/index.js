import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const QUERYTOTALSTONE = 'total';
const QUERYMOVESSTONE = 'moves';
const DEFAULTTOTALSTONE = 15;
const DEFAULTMOVESSTONE = 3;
const MAXTOTALSTONE = 25;
const [ TOTALSTONE, MOVESSTONE ] = getGameInformation();
const color = Object.freeze({'played': 'green', 'playing': 'orange', 'empty': 'white', 'illegal': 'red'})

const Cell = ({ cellColor, cellHoverColor, clickHandler }) => {
  const [hover, setHover] = useState(false);

  let backgroundColor = cellColor;
  if(hover) {
    backgroundColor = cellHoverColor;
  }

  return (
    <div
      className='dot'
      onClick={ clickHandler }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
      style={ {backgroundColor: backgroundColor} }
    ></div>
  );
};

const Board = ({ gameState, totalCell, cellPlayedHandler }) => {
  const getCellColor = (cellIdx) => {
    if(cellIdx >= gameState) {
      return color.played;
    }
    return color.empty;
  }

  const getCellHoverColor = (cellIdx) => {
    if(cellIdx >= gameState) {
      return color.played;
    }
    if(cellIdx >= gameState - MOVESSTONE) {
      return color.playing;
    }
    return color.illegal;
  }

  return (
    <div className='row'>
      {
        Array(totalCell).fill(0).map((_, cellIdx) => {
          return (
            <Cell
              key = { cellIdx }
              cellColor = { getCellColor(cellIdx) }
              cellHoverColor = { getCellHoverColor(cellIdx) }
              clickHandler = { () => cellPlayedHandler(cellIdx) }
            />
          )
        })
      }
    </div>
  );
};

const Game = ({ movesCell, totalCell }) => {
  const [gameState, setGameState] = useState([totalCell]);

  const curGameState = gameState[gameState.length-1];

  const handleCellPlayed = (cellIdx) => {
    if(cellIdx >= curGameState || cellIdx < curGameState - movesCell) {
      return; // illegal
    }

    setGameState([...gameState.slice(), cellIdx]);
  }

  const handleNextAction = () => {
    setGameState([...gameState.slice(), nextOptimalMove(curGameState, movesCell, totalCell)])
  }

  const handleUndoAction = () => {
    setGameState([...gameState.slice(0, -1)]);
  }

  return (
    <div className='game'>
      <h1 className='game-title'>Stone Game</h1>
      <h2 className='game-information'>
        Total Stone: { totalCell }
        &emsp;
        Single Moves: 1 - { movesCell } Stone
      </h2>
      <div className='game-board'>
        <Board
          gameState={ curGameState }
          totalCell={ totalCell }
          cellPlayedHandler={ handleCellPlayed }
        />
      </div>
      <div className='game-control'>
        <button
          disabled={ curGameState === 0 }
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
    totalCell={ TOTALSTONE }
    movesCell={ MOVESSTONE }
  />, document.getElementById('root')
);

/* ----------------------------- Helper Function ---------------------------- */
function getGameInformation() {
  const query = new URLSearchParams(window.location.search);

  let qTotal = parseInt(query.get(QUERYTOTALSTONE));
  let qMoves = parseInt(query.get(QUERYMOVESSTONE));

  if(!qTotal) {
      qTotal = DEFAULTTOTALSTONE;
  }

  if(!qMoves) {
      qMoves = DEFAULTMOVESSTONE;
  }

  qMoves = Math.max(qMoves, 1);
  qTotal = Math.max(qTotal, 1);
  qTotal = Math.min(qTotal, MAXTOTALSTONE);

  return [ qTotal, qMoves ];
}

function isWinningState(gameState, movesCell, totalCell) {
  if(gameState % (movesCell + 1) === 0) {
    return false;
  }
  return true;
}

function nextOptimalMove(gameState, movesCell, totalCell) {
  if(!isWinningState(gameState, movesCell, totalCell)) {
    return gameState - 1;
  }

  for(let i = 1; i <= movesCell; i++) {
    if(!isWinningState(gameState - i, movesCell, totalCell)) {
      return gameState - i;
    }
  }

  return gameState;
}
