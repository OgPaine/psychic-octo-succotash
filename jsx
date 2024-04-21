import React, { useState, useEffect } from 'react';
import PadIcon from '../assets/pad.svg';
import '../App.css'; // Adjust the path as necessary

// Importing state-dependent images for different creatures
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

const creatures = ['mouse', 'frog', 'bird'];

const Mazer = () => {
  const [board, setBoard] = useState([]);
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const isValidPosition = (row, col) => row >= 0 && row < 6 && col >= 0 && col < 6;

  useEffect(() => {
    const initialBoard = Array.from({ length: 36 }, (_, index) => ({
      creature: creatures[Math.floor(Math.random() * creatures.length)],
      state: 'green',
      index: index
    }));
    setBoard(initialBoard);
    setHighlightedTiles(Array.from({ length: 36 }, (_, index) => index)); // Highlight all tiles initially
  }, []);

  const debug = (message) => {
    console.log(message);
  };

  const updateHighlightedTiles = (currentPosition, creature) => {
    const currentRow = Math.floor(currentPosition / 6);
    const currentCol = Math.floor(currentPosition % 6);
    const newHighlightedTiles = [];

    switch (creature) {
      case 'mouse':
        debug('Updating highlighted tiles for mouse');
        // For mouse, add all adjacent tiles to the highlighted list
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if ((dr !== 0 || dc !== 0) && (Math.abs(dr) === 1 || Math.abs(dc) === 1)) {
              const newRow = currentRow + dr;
              const newCol = currentCol + dc;
              if (isValidPosition(newRow, newCol)) {
                newHighlightedTiles.push(newRow * 6 + newCol);
              }
            }
          }
        }
        break;
      case 'frog':
        debug('Updating highlighted tiles for frog');
        // For frog, add the tile 2 steps away in all directions
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if ((Math.abs(dr) === 2 && Math.abs(dc) === 0) || (Math.abs(dr) === 0 && Math.abs(dc) === 2) || (Math.abs(dr) === 2 && Math.abs(dc) === 2)) {
                const newRow = currentRow + dr;
              const newCol = currentCol + dc;
              if (isValidPosition(newRow, newCol)) {
                newHighlightedTiles.push(newRow * 6 + newCol);
              }
            }
          }
        }
        break;
      case 'bird':
        debug('Updating highlighted tiles for bird');
        // For bird, add the tile 3 steps away in all directions
        for (let dr = -3; dr <= 3; dr++) {
          for (let dc = -3; dc <= 3; dc++) {
            if ((Math.abs(dr) === 3 && Math.abs(dc) === 0) || (Math.abs(dr) === 0 && Math.abs(dc) === 3) || (Math.abs(dr) === 3 && Math.abs(dc) === 3)) {
              const newRow = currentRow + dr;
              const newCol = currentCol + dc;
              if (isValidPosition(newRow, newCol)) {
                newHighlightedTiles.push(newRow * 6 + newCol);
              }
            }
          }
        }
        break;
      default:
        break;
    }

    // Remove the current position from highlighted tiles
    const currentIndex = currentRow * 6 + currentCol;
    const currentIndexIndex = newHighlightedTiles.indexOf(currentIndex);
    if (currentIndexIndex !== -1) {
      newHighlightedTiles.splice(currentIndexIndex, 1);
    }

    setHighlightedTiles(newHighlightedTiles);
  };


  const handleTileClick = (index) => {
    if (gameOver || !highlightedTiles.includes(index)) return;

    const newBoard = [...board];
    const tile = {...newBoard[index]};

    // Handle tile interactions based on their current state
    if (tile.state === 'grey') {
      // Change grey tiles to transparent and increment the score by 1
      tile.state = 'transparent';
      setScore(prev => {
        const updatedScore = prev + 1;
        // Check if updating the score reaches the win condition of 25 points
        if (updatedScore >= 25) {
          setWon(true); // Set the game to won
          setGameOver(true); // End the game
        }
        return updatedScore; // Return the updated score
      });
    } else if (tile.state === 'green') {
      // Change green tiles to grey when clicked
      tile.state = 'grey';
    }

    newBoard[index] = tile; // Update the tile on the new board
    setBoard(newBoard); // Set the updated board state
    updateHighlightedTiles(index, tile.creature); // Update tiles based on the clicked tile's creature rules
};

  const images = {
    greenBird, greenBirdHighlighted, greenFrog, greenFrogHighlighted,
    greenMouse, greenMouseHighlighted, greyBird, greyBirdHighlighted,
    greyFrog, greyFrogHighlighted, greyMouse, greyMouseHighlighted,
    transparent
};

const getImage = (creature, state, isHighlighted) => {
    const baseName = `${state}${creature.charAt(0).toUpperCase() + creature.slice(1)}`;
    const imageName = isHighlighted ? `${baseName}Highlighted` : baseName;
    return images[imageName];
};
return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#04131C]">
      <div className="bg-[#082030] w-[500px] p-0 pb-0 rounded text-center relative box-border">
        <div className="flex items-center justify-center text-center mx-auto my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7 mr-2" />
          <h1 className="text-[#14c7bb] text-lg mr-2" style={{ textShadow: "0 0 5px #14c7bb, 0 0 20px #14c7bb, 0 0 30px #14c7bb" }}>
            Mazer
          </h1>
          <div className="text-lg text-white">Score: {score}/25</div>
        <div className="grid grid-cols-6 gap-1 p-4">
          {board.map((tile, index) => {
            const isHighlighted = highlightedTiles.includes(index);
            const imageUrl = getImage(tile.creature, tile.state, isHighlighted);
            return (
              <div key={index} onClick={() => handleTileClick(index)}
                className={`cursor-pointer ${tile.state === 'transparent' ? 'opacity-50' : ''}`}>
                <img src={imageUrl} alt={`${tile.creature}`} className="tile-image" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </div>
  );
  
};

export default Mazer;