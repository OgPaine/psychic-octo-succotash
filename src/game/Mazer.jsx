import React, { useState, useEffect } from 'react';
import PadIcon from '../assets/pad.svg';
import '../App.css'; 

// Consolidating all image imports
import transparent from '../images/transparent.webp';
import greenBird from '../images/green_bird.webp';
import greenBirdHighlighted from '../images/green_bird_highlighted.webp';
import greenFrog from '../images/green_frog.webp';
import greenFrogHighlighted from '../images/green_frog_highlighted.webp';
import greenMouse from '../images/green_mouse.webp';
import greenMouseHighlighted from '../images/green_mouse_highlighted.webp';
import greyBird from '../images/grey_bird.webp';
import greyBirdHighlighted from '../images/grey_bird_highlighted.webp';
import greyFrog from '../images/grey_frog.webp';
import greyFrogHighlighted from '../images/grey_frog_highlighted.webp';
import greyMouse from '../images/grey_mouse.webp';
import greyMouseHighlighted from '../images/grey_mouse_highlighted.webp';

const images = {
  greenBird, greenBirdHighlighted, greenFrog, greenFrogHighlighted,
  greenMouse, greenMouseHighlighted, greyBird, greyBirdHighlighted,
  greyFrog, greyFrogHighlighted, greyMouse, greyMouseHighlighted,
  transparent
};

const creatures = ['mouse', 'frog', 'bird'];

const Mazer = () => {
  const [board, setBoard] = useState([]);
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40); // Total time in seconds
  const [progress, setProgress] = useState(100); // Progress in percentage
  const [hasStarted, setHasStarted] = useState(false);


    // Function to initialize or restart the game
    const restartGame = () => {
        setBoard(Array.from({ length: 36 }, (_, index) => ({
          creature: creatures[Math.floor(Math.random() * creatures.length)],
          state: 'green',
          index
        })));
        setHighlightedTiles(Array.from({ length: 36 }, (_, index) => index));
        setScore(0);
        setGameOver(false);
        setWon(false);
        setTimeLeft(40);
        setProgress(100);
        setHasStarted(false);
      };
    
      // Call restartGame initially to set up the board
      useEffect(() => {
        restartGame();
      }, []);
    

      useEffect(() => {
        let interval;
        if (hasStarted) {
          interval = setInterval(() => {
            setTimeLeft(prevTime => {
              if (prevTime > 0) {
                const newTime = prevTime - 1;
                setProgress(newTime / 40 * 100);
                return newTime;
              } else {
                clearInterval(interval);
                setGameOver(true);
                return 0;
              }
            });
          }, 1000);
        } else {
          setTimeLeft(40); // Reset time when hasStarted is false
          setProgress(100);
        }
      
        return () => {
          if (interval) {
            clearInterval(interval);
          }
        };
      }, [hasStarted]);

  const isValidPosition = (row, col) => row >= 0 && row < 6 && col >= 0 && col < 6;

  const updateHighlightedTiles = (index, creature) => {
    const currentRow = Math.floor(index / 6);
    const currentCol = index % 6;
    const newHighlightedTiles = [];
  
    // Define the distance based on the creature type
    let distances = [];
    switch (creature) {
      case 'mouse':
        distances = [
          { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
          { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
          { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 }
        ];
        break;
      case 'frog':
        distances = [
          { dr: -2, dc: -2 }, { dr: -2, dc: 0 }, { dr: -2, dc: 2 },
          { dr: 0, dc: -2 }, { dr: 0, dc: 2 },
          { dr: 2, dc: -2 }, { dr: 2, dc: 0 }, { dr: 2, dc: 2 }
        ];
        break;
      case 'bird':
        distances = [
          { dr: -3, dc: -3 }, { dr: -3, dc: 0 }, { dr: -3, dc: 3 },
          { dr: 0, dc: -3 }, { dr: 0, dc: 3 },
          { dr: 3, dc: -3 }, { dr: 3, dc: 0 }, { dr: 3, dc: 3 }
        ];
        break;
      default:
        return; // Do nothing if creature type is not recognized
    }
  
    // Check each potential move to see if it's valid
    distances.forEach(({ dr, dc }) => {
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;
      if (isValidPosition(newRow, newCol)) {
        const newIndex = newRow * 6 + newCol;
        if (board[newIndex].state !== 'transparent') { // Check if the tile is not already 'removed'
          newHighlightedTiles.push(newIndex);
        }
      }
    });
  
    setHighlightedTiles(newHighlightedTiles);
  


    // Check if there are no more highlighted tiles and set the game over if true
    if (newHighlightedTiles.length === 0) {
      setGameOver(true);
    }
  
    // Check each potential move to see if it's valid
    distances.forEach(({ dr, dc }) => {
      const newRow = currentRow + dr;
      const newCol = currentCol + dc;
      if (isValidPosition(newRow, newCol)) {
        const newIndex = newRow * 6 + newCol;
        if (board[newIndex].state !== 'transparent') { // Check if the tile is not already 'removed'
          newHighlightedTiles.push(newIndex);
        }
      }
    });
  
    setHighlightedTiles(newHighlightedTiles);
  };

  const handleTileClick = (index) => {
    if (gameOver || !highlightedTiles.includes(index)) return;
  
    if (!hasStarted) {
      setHasStarted(true); // Start the timer on the first tile click
    }
  
    const newBoard = [...board];
    const tile = {...newBoard[index]};
    const originalCreature = tile.creature; 
  
    if (tile.state === 'grey') {
      tile.state = 'transparent';
      setScore(prev => prev + 1);
      if (score + 1 >= 25) {
        setWon(true);
        setGameOver(true);
      }
    } else if (tile.state === 'green') {
      tile.state = 'grey';
      tile.creature = creatures[Math.floor(Math.random() * creatures.length)];
    }
  
    newBoard[index] = tile;
    setBoard(newBoard);
    updateHighlightedTiles(index, originalCreature);
  
    if (highlightedTiles.length === 0) {
      setGameOver(true);
    }
  };
  

  const getImage = (creature, state, isHighlighted) => {
    const baseName = `${state}${creature.charAt(0).toUpperCase() + creature.slice(1)}`;
    const imageName = isHighlighted ? `${baseName}Highlighted` : baseName;
    return images[imageName] || transparent;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#04131C]">
      <div className="bg-[#082030] lg:w-[500px]  pb-0 rounded text-center relative box-border">
      <div className="flex lg:w-[500px] ml-2 my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7" />{" "}
          {/* Display the SVG here */}
          <h1
            className="text-[#14c7bb] font-semibold text-lg mx-2"
            style={{
              textShadow: "0 0 5px #14c7bb, 0 0 10px #14c7bb, 0 0 20px #14c7bb",
            }}
          >
            Mazer
          </h1>
          <p className="text-neutral-400 text-xs self-center mt-1">
          Decrypt the required number of bytes
          </p>
        </div>
        <div className="text-lg mb-1 font-bold text-white">{score}/24</div>

        <div className="grid grid-cols-6 gap-1 p-2">
  {board.map((tile, index) => {
    const isHighlighted = highlightedTiles.includes(index);
    const imageUrl = getImage(tile.creature, tile.state, isHighlighted); 

    return (
      <div key={index} onClick={() => handleTileClick(index)}
        className={`cursor-pointer p-0.5 ${tile.state === 'transparent' ? 'opacity-50' : ''}`}>
        <img src={imageUrl} alt={`${tile.creature}`} className="tile-image" onDragStart={(e) => e.preventDefault()} />
      </div>
    );
  })}
</div>
        <div className="w-full bg-orange-600 full h-2 dark:bg-gray-700">
        <div className="bg-orange-600 h-2 full" style={{ width: `${progress}%` }}></div>
      </div>
        {gameOver && (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="text-center">
      {won ? (
        <p className="text-lg font-extrabold text-green-500">Success, You Won!</p>
      ) : (
        <p className="text-lg font-extrabold text-red-500">Game Over! Try again.</p>
      )}
      <button
        onClick={restartGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Restart Game
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default Mazer;