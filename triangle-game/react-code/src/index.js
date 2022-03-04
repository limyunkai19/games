import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { winningMove } from './ai.js'

const TOTALROWCOUNT = 5;
const MAXMOVESTEP = 3
const color = Object.freeze({"played": "green", "playing": "orange", "empty": "white", "illegal": "red"})

const Cell = ({ cellColor, cellHoverColor, clickHandler }) => {
  const [hover, setHover] = useState(false);

  let backgroundColor = cellColor;
  if(hover) {
    backgroundColor = cellHoverColor;
  }

  return (
    <div
      className="dot"
      onClick={ clickHandler }
      onMouseEnter={ () => setHover(true) }
      onMouseLeave={ () => setHover(false) }
      style={ {backgroundColor: backgroundColor} }
    ></div>
  );
};

const Board = ({ gameState, cellPlayed, cellPlayedHandler }) => {
  const getCellColor = (cellIdx) => {
    if(cellIdx === cellPlayed) {
      return color.playing;
    }
    if(getBit(gameState, cellIdx) === 1) {
      return color.played;
    }
    return color.empty;
  }

  const getCellHoverColor = (cellIdx) => {
    if(getBit(gameState, cellIdx) === 1) {
      return color.played;
    }
    if(cellPlayed === null) {
      return color.playing;
    }
    if(validMove(gameState, cellPlayed, cellIdx)) {
      return color.playing;
    }
    return color.illegal;
  }

  const renderRow = (startCellIdx, cellCount) => {
    return Array(cellCount).fill(0).map((_, rowCellIdx) => {
      const cellIdx = rowCellIdx + startCellIdx;
      return (
        <Cell
          key = { cellIdx }
          cellColor = { getCellColor(cellIdx) }
          cellHoverColor = { getCellHoverColor(cellIdx) }
          clickHandler = { () => cellPlayedHandler(cellIdx) }
        />
      )
    });
  };

  const renderBoard = (rowCount) => {
    let rowStartIdx = [0];
    for(let r = 1; r < rowCount; r++) {
      rowStartIdx.push(rowStartIdx[r-1]+r);
    }

    const boardRow = rowStartIdx.map(
      (startIdx, r) =>
        <div key={r} className="row">
          { renderRow(startIdx, r+1) }
        </div>
    );

    return boardRow;
  }

  return (
    <div>{renderBoard(TOTALROWCOUNT)}</div>
  );
};

const Game = () => {
  const [gameState, setGameState] = useState([0]);
  const [cellPlayed, setCellPlayed] = useState(null);

  const curGameState = gameState[gameState.length-1];

  const handleCellPlayed = (cellIdx) => {
    if(cellPlayed === null) {
      setCellPlayed(cellIdx);
      return;
    }

    // move is cellPlayed -> cellIdx
    const nextGameState = computeNextState(curGameState, cellPlayed, cellIdx);

    if(nextGameState === null) {
      // illegal move, do nothing
      return;
    }

    setGameState([...gameState.slice(), nextGameState]);
    setCellPlayed(null);
  };

  const handleNextAction = () => {
    setGameState([...gameState.slice(), winningMove[curGameState]]);
  };

  const handleUndoAction = () => {
    if(cellPlayed !== null) {
      setCellPlayed(null);
      return;
    }

    setGameState([...gameState.slice(0, -1)]);
  };

  return (
    <div className="game">
      <h1 className="game-title">Triangle Game</h1>
      <div className="game-board">
        <Board
          gameState={curGameState}
          cellPlayed={cellPlayed}
          cellPlayedHandler={handleCellPlayed}
        />
      </div>
      <div className="game-control">
        <button
          disabled={ cellPlayed !== null || winningMove[curGameState] === -1}
          onClick={ handleNextAction }
        >
          Next
        </button>
        <button
          disabled={ gameState.length === 1 && cellPlayed === null }
          onClick={ handleUndoAction }>
          { cellPlayed === null ? "Undo" : "Cancel" }
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById('root'));

/* ----------------------------- Helper Function ---------------------------- */
function getBit(bitmask, i) {
  return (bitmask & (1<<i)) >> i;
}

function setBit(bitmask, i) {
  return bitmask | (1<<i);
}

function triangleNumber(i) {
  return i*(i+1)/2;
}

function rc2id(row, col) {
  if(col > row || col < 0)
      return -1;
  return triangleNumber(row) + col;
}

function id2rc(id) {
  let row = 0;
  while(triangleNumber(row) <= id) {
      row++;
  }
  row--;

  let col = id - triangleNumber(row);

  return {"row": row, "col": col};
}

function getDirectionVector(startCellIdx, endCellIdx) {
  const allowedDirection = [
    [0, 0], [1, 1], [-1, -1],
    [0, 1], [0, -1],
    [1, 0], [-1, 0],
  ];

  const rc1 = id2rc(startCellIdx);
  const rc2 = id2rc(endCellIdx);

  let gr = rc2.row - rc1.row;
  let gc = rc2.col - rc1.col;
  let steps = Math.max(Math.abs(gr), Math.abs(gc));

  if(steps >= MAXMOVESTEP) {
    return { valid: false };
  }

  const direction = allowedDirection.filter((val) => {
    const [dr, dc] = val;
    return dr * steps === gr && dc * steps === gc;
  });

  if(direction.length === 0) {
    return { valid: false };
  }

  return {
    valid: true,
    dr: steps === 0 ? 0 : gr / steps,
    dc: steps === 0 ? 0 : gc / steps,
    steps: steps,
  };
}

function validMove(gameState, cellPlayedIdx, curCellIdx) {
  return computeNextState(gameState, cellPlayedIdx, curCellIdx) !== null;
}

function computeNextState(gameState, startCellIdx, endCellIdx) {
  const { valid, dr, dc, steps } = getDirectionVector(startCellIdx, endCellIdx);

  if(!valid) {
    return null;
  }

  const rc1 = id2rc(startCellIdx);
  for(let s = 0; s <= steps; s++) {
    const idx = rc2id(rc1.row + dr * s, rc1.col + dc * s);

    if(getBit(gameState, idx) === 1) {
      return null;
    }

    gameState = setBit(gameState, idx);
  }

  return gameState;
}
