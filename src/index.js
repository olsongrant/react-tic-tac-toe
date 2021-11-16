import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useState } from "react";

function Square(props) {	
  return (
    <button className="square" 
	  onClick={props.onClick}>
	  {props.value}
    </button>
  );
}

function Board(props) { 
  const renderSquare = (i) => {
    return (
		<Square value={props.squares[i]} 
		onClick={() => props.onClick(i)}
		/>
	);
  }

  return (
	<div>
	  <div className="board-row">
		{renderSquare(0)}
        {renderSquare(1)}
		{renderSquare(2)}
	  </div>
	  <div className="board-row">
		{renderSquare(3)}
		{renderSquare(4)}
		{renderSquare(5)}
	  </div>
	  <div className="board-row">
		{renderSquare(6)}
		{renderSquare(7)}
		{renderSquare(8)}
	  </div>
	</div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Game(props) {
  var initialSquares = Array(9).fill(null);
  var initialHistory = [{ squares: initialSquares, }];
  var initial = {
    boardHist: initialHistory,
	boardNow: initialHistory[0],
	stepNumber: 1,
    xIsNext: true,
	status: 'Next Player: X',
	gameOver: false,
  };
	
  const [conditions, setConditions] = useState(initial);
  
  const setNextConditions = (fullHistory) => {
	const topLevelBoard = fullHistory[fullHistory.length - 1];
	const nextStepNumber = fullHistory.length;
	const nextPlayer = ((nextStepNumber % 2) === 0) ? 'O' : 'X';
	const topLevelSquares = topLevelBoard.squares.slice();
	let aStatus;
	let gameOverFlag = false;
	let winner = calculateWinner(topLevelSquares);
	if (winner) {
      aStatus = 'Winner: ' + winner;
	  gameOverFlag = true;
    } else if (fullHistory.length > 9) {
	  aStatus = 'Cat Game';
	  gameOverFlag = true;
	} else {	
      aStatus = ('Next Player: ' + nextPlayer);
	}	
    let xIsNextFlag = !((nextStepNumber % 2) === 0);
	setConditions({
	  boardHist: fullHistory,
	  boardNow: topLevelBoard,
	  stepNumber: nextStepNumber,
      xIsNext: xIsNextFlag,
	  status: aStatus, 
	  gameOver: gameOverFlag,
	});
  }
	
  const handleClick = (i) => {
	if (conditions.gameOver) {
      return;
	}
	const boardHist = conditions.boardHist.slice();
    const recentBoard = boardHist[boardHist.length - 1];	
    const squares = recentBoard.squares.slice();

    squares[i] = conditions.xIsNext ? 'X' : 'O';
	var newHistory = boardHist.concat( { squares: squares, } );
	setNextConditions(newHistory);
  }
  
  const jumpTo = (step) => {
	const boardHist = conditions.boardHist.slice(0, step + 1);
	setNextConditions(boardHist);
  }  
 
  const moves = conditions.boardHist.map((step, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  }); 
  
  return (
    <div className="game">
      <div className="game-board">
        <Board 
          squares={conditions.boardNow.squares}
		  onClick={(i) => handleClick(i)}
		/>
      </div>
      <div className="game-info">
        <div>{conditions.status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  ); 
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
