import React, { useState, useEffect } from 'react';
import { PadIcon } from "../assets"; 

const generateGrid = (rows, cols) => {
    const colors = ['bg-red-700', 'bg-lime-600', 'bg-cyan-600'];
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => colors[Math.floor(Math.random() * colors.length)])
    );
};

const isPartOfGroup = (grid, x, y) => {
    const targetColor = grid[x][y];
    const rows = grid.length;
    const cols = grid[0].length;
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    let visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    function dfs(cx, cy) {
        if (cx >= 0 && cx < rows && cy >= 0 && cy < cols && !visited[cx][cy] && grid[cx][cy] === targetColor) {
            visited[cx][cy] = true;
            directions.forEach(([dx, dy]) => dfs(cx + dx, cy + dy));
        }
    }

    dfs(x, y);
    return visited.flat().filter(Boolean).length > 1;
};

const clickableGroupsExist = (grid) => {
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[0].length; y++) {
            if (grid[x][y] !== 'bg-transparent' && isPartOfGroup(grid, x, y)) {
                return true;
            }
        }
    }
    return false;
};

const applyGravity = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;
    for (let col = 0; col < cols; col++) {
        for (let row = rows - 1; row > 0; row--) {
            if (grid[row][col] === 'bg-transparent') {
                for (let above = row - 1; above >= 0; above--) {
                    if (grid[above][col] !== 'bg-transparent') {
                        grid[row][col] = grid[above][col];
                        grid[above][col] = 'bg-transparent';
                        break;
                    }
                }
            }
        }
    }
};
const compressColumns = (grid) => {
    const rows = grid.length;
    const cols = grid[0].length;
    let emptyColumns = [];
    for (let col = 0; col < cols; col++) {
        if (grid.every(row => row[col] === 'bg-transparent')) {
            emptyColumns.push(col);
        }
    }

    emptyColumns.reverse().forEach(emptyCol => {
        for (let col = emptyCol; col < cols - 1; col++) {
            for (let row = 0; row < rows; row++) {
                grid[row][col] = grid[row][col + 1];
                grid[row][col + 1] = 'bg-transparent';
            }
        }
    });
};

const RoofRunning = () => {
    const [gridSize, setGridSize] = useState({ rows: 5, cols: 5 });
    const [grid, setGrid] = useState(generateGrid(gridSize.rows, gridSize.cols));
    const [gameOverMessage, setGameOverMessage] = useState(null);
    const [timer, setTimer] = useState(20);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameDuration, setGameDuration] = useState(20); 

    useEffect(() => {
        setGrid(generateGrid(gridSize.rows, gridSize.cols));
        setTimer(gameDuration); 
    }, [gridSize, gameDuration]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0 && gameStarted) { 
                setTimer(prevTimer => prevTimer - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, gameStarted]);

    useEffect(() => {
        if (grid.every(row => row.every(cell => cell === 'bg-transparent'))) {
            setGameOverMessage('+1 AC unit');
        } else if (!clickableGroupsExist(grid)) {
            setGameOverMessage('No more moves!');
        }
        if (timer === 0) {
            setGameOverMessage("Time's up!");
        }
    }, [grid, timer]);

    const clearAdjacent = (x, y, color, newGrid) => {
        if (x < 0 || x >= gridSize.rows || y < 0 || y >= gridSize.cols || newGrid[x][y] !== color || newGrid[x][y] === 'bg-transparent') {
            return;
        }

        newGrid[x][y] = 'bg-transparent'; // Mark as cleared
        clearAdjacent(x + 1, y, color, newGrid);
        clearAdjacent(x - 1, y, color, newGrid);
        clearAdjacent(x, y + 1, color, newGrid);
        clearAdjacent(x, y - 1, color, newGrid);
    };

    const handleClick = (x, y) => {
        if (gameOverMessage) return; 

        if (!gameStarted) { 
            setGameStarted(true);
        }

        if (isPartOfGroup(grid, x, y)) {
            const newGrid = grid.map(row => [...row]);
            clearAdjacent(x, y, grid[x][y], newGrid);
            applyGravity(newGrid);
            compressColumns(newGrid);
            setGrid(newGrid);
        }
    };

    const handleSizeChange = (event) => {
        const size = event.target.value.split('x').map(Number);
        setGridSize({ rows: size[0], cols: size[1] });
        setGameOverMessage(null); // Reset game over message when grid size changes
        setGameStarted(false); // Reset gameStarted state when grid size changes
    };

    const handleRestart = () => {
        setGrid(generateGrid(gridSize.rows, gridSize.cols));
        setGameOverMessage(null);
        setTimer(gameDuration); // Reset timer to gameDuration when restarting the game
        setGameStarted(false); // Reset gameStarted state when restarting the game
    };

    // Calculate cell size dynamically based on container size and grid dimensions
    const cellSize = 600 / Math.max(gridSize.rows, gridSize.cols);
    const containerHeight = cellSize * gridSize.rows;
    const progress = (timer / gameDuration) * 100;

    return (
        <div className='flex flex-col items-center justify-center min-h-screen p-4'>

            <div className="settings mb-6">
                <div>
                    <label htmlFor="difficulty">Difficulty:</label>
                    <select
                        id="difficulty"
                        className="difficulty-select"
                        value={`${gridSize.rows}x${gridSize.cols}`} // Set the value to match the gridSize format
                        onChange={handleSizeChange} // Use the handleSizeChange function to update gridSize
                    >
                        <option value="5x5">5x5</option>
                        <option value="7x7">7x7</option>
                        <option value="8x8">8x8</option>
                        <option value="8x11">8x11</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="game-duration">Speed:</label>
                    <input
                        id="game-duration"
                        type="range"
                        className="slider"
                        min="20"
                        max="60"
                        step="5"
                        value={gameDuration}
                        onChange={(e) => setGameDuration(parseInt(e.target.value, 10))}
                    />
                    <div className="slider-value">{gameDuration}s</div>
                </div>
            </div>

            <div className="bg-[#04131C] flex items-center justify-center">
                <div className="bg-[#082030] p-0 pb-0  text-center relative box-border">

                    <div className="flex  ml-2 my-2">
                        <img src={PadIcon} alt="Pad Icon" className="h-7" />
                        <h1 className="text-[#14c7bb] font-semibold text-lg mx-2" style={{
                            textShadow: "0 0 5px #14c7bb, 0 0 10px #14c7bb, 0 0 20px #14c7bb",
                        }}>
                            Same Game
                        </h1>
                        <p className="text-neutral-400 text-xs self-center mt-1">
                            Click on matching groups of blocks
                        </p>
                    </div>

                    <div className="bg-[#082030] rounded p-6 mx-6 flex justify-center">

                        <div>
                            <div style={{ width: '600px', height: `${containerHeight}px` }}>
                                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize.cols}, ${cellSize}px)`, gridTemplateRows: `repeat(${gridSize.rows}, ${cellSize}px)`, gap: '1px' }}>
                                    {grid.map((row, i) =>
                                        row.map((color, j) => (
                                            <button
                                                key={`${i}-${j}`}
                                                style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                                                className={`${color}`}
                                                onClick={() => handleClick(i, j)}
                                            >
                                                &nbsp; 
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom left-0 right-0">
                        <div className="bg-gray-800 h-2 relative">
                            <div className="bg-orange-600 h-2" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="text-white text-sm text-center mt-1">Time left: {timer}s</div>
                    </div>
                </div>
            </div>
            {gameOverMessage && (
                <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white text-xl font-semibold">
                    <div>{gameOverMessage}</div>
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleRestart}>Restart</button>
                </div>
            )}
        </div>
    );
};

export default RoofRunning;
