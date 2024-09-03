"use client";
import React from "react";

function MainComponent() {
  const [grid, setGrid] = React.useState([]);
  const [gameOver, setGameOver] = React.useState(false);
  const [flagMode, setFlagMode] = React.useState(false);

  React.useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: 10 })
      .fill()
      .map(() =>
        Array.from({ length: 10 })
          .fill()
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );

    let bombsPlaced = 0;
    while (bombsPlaced < 10) {
      const i = Math.floor(Math.random() * 10);
      const j = Math.floor(Math.random() * 10);
      if (!newGrid[i][j].isMine) {
        newGrid[i][j].isMine = true;
        bombsPlaced++;
      }
    }

    calculateNeighborMines(newGrid);
    setGrid(newGrid);
  };

  const calculateNeighborMines = (newGrid) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!newGrid[i][j].isMine) {
          let count = 0;
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (
                ni >= 0 &&
                ni < 10 &&
                nj >= 0 &&
                nj < 10 &&
                newGrid[ni][nj].isMine
              ) {
                count++;
              }
            }
          }
          newGrid[i][j].neighborMines = count;
        }
      }
    }
  };

  const handleCellClick = (i, j) => {
    if (gameOver) return;

    const newGrid = [...grid];
    if (flagMode) {
      newGrid[i][j].isFlagged = !newGrid[i][j].isFlagged;
    } else if (!newGrid[i][j].isFlagged) {
      if (newGrid[i][j].isMine) {
        setGameOver(true);
        revealAllMines(newGrid);
      } else {
        revealCell(newGrid, i, j);
      }
    }
    setGrid(newGrid);
  };

  const revealCell = (newGrid, i, j) => {
    if (
      i < 0 ||
      i >= 10 ||
      j < 0 ||
      j >= 10 ||
      newGrid[i][j].isRevealed ||
      newGrid[i][j].isFlagged
    )
      return;

    newGrid[i][j].isRevealed = true;

    if (newGrid[i][j].neighborMines === 0) {
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          revealCell(newGrid, i + di, j + dj);
        }
      }
    }
  };

  const revealAllMines = (newGrid) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (newGrid[i][j].isMine) {
          newGrid[i][j].isRevealed = true;
        }
      }
    }
  };

  const toggleFlagMode = () => {
    setFlagMode(!flagMode);
  };

  const resetGame = () => {
    setGameOver(false);
    initializeGrid();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <h1 className="text-3xl font-bold mb-4">マインスイーパー</h1>
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            flagMode ? "bg-yellow-500" : "bg-blue-500"
          } text-white`}
          onClick={toggleFlagMode}
        >
          {flagMode ? "旗モード：オン" : "旗モード：オフ"}
        </button>
        <button
          className="px-4 py-2 rounded bg-green-500 text-white"
          onClick={resetGame}
        >
          リセット
        </button>
      </div>
      <div className="grid grid-cols-10 gap-1 bg-gray-300 p-2 rounded">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
                cell.isRevealed
                  ? cell.isMine
                    ? "bg-red-500"
                    : "bg-gray-200"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              onClick={() => handleCellClick(i, j)}
            >
              {cell.isRevealed &&
                !cell.isMine &&
                cell.neighborMines > 0 &&
                cell.neighborMines}
              {cell.isRevealed && cell.isMine && "💣"}
              {!cell.isRevealed && cell.isFlagged && "🚩"}
            </div>
          ))
        )}
      </div>
      {gameOver && (
        <div className="mt-4 text-xl font-bold text-red-500">
          ゲームオーバー！
        </div>
      )}
    </div>
  );
}

export default MainComponent;