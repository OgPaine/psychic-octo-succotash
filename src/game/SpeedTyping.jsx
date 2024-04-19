import React, { useState, useEffect, useCallback } from 'react';
import PadIcon from "../assets/pad.svg"; // Importing the SVG


const SpeedTyping = () => {
  const [letters, setLetters] = useState(Array(16).fill('?')); // Initial letters are '?' to indicate uninitialized game
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(100);
  const [gameInterval, setGameInterval] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Press Start to Play!');
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState(Array(16).fill('bg-transparent')); // Initial background is gray

  const randomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  const populateLetters = () => {
    const newLetters = [];
    const newStatuses = [];
    for (let i = 0; i < 16; i++) {
      newLetters.push(randomLetter());
      newStatuses.push('bg-transparent'); // Reset to transparent when game starts
    }
    setLetters(newLetters);
    setLetterStatuses(newStatuses);
  };

  const startGame = () => {
    setCurrentLetterIndex(0);
    populateLetters();
    startTimer(10); // Start the timer with 10 seconds
    setStatusMessage('');
    setIsGameRunning(true);
  };

  const startTimer = (duration) => {
    let timeLeft = duration;
    setProgressWidth(100);
    clearInterval(gameInterval);
    const interval = setInterval(() => {
      timeLeft--;
      const progressPercentage = (timeLeft / duration) * 100;
      setProgressWidth(progressPercentage);

      if (timeLeft <= 0) {
        clearInterval(interval);
        setProgressWidth(0);
        endGame(false);
      }
    }, 1000);
    setGameInterval(interval);
  };

  const endGame = (win) => {
    clearInterval(gameInterval);
    setProgressWidth(0);
    setStatusMessage(win ? 'Success!' : 'Failed!');
    setIsGameRunning(false);
  };

  const handleKeyDown = useCallback((e) => {
    if (!isGameRunning) return;

    const currentLetter = letters[currentLetterIndex];
    let newStatuses = [...letterStatuses];

    if (e.key.toUpperCase() === currentLetter) {
      newStatuses[currentLetterIndex] = 'bg-[#095253]';
      setCurrentLetterIndex(currentLetterIndex + 1);
      if (currentLetterIndex === letters.length - 1) {
        endGame(true);
      }
    } else {
      newStatuses[currentLetterIndex] = 'bg-[#C75B62]';
      endGame(false);
    }

    setLetterStatuses(newStatuses);
  }, [isGameRunning, currentLetterIndex, letters, letterStatuses]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);



  
  return (
<div className="flex items-center justify-center h-screen bg-[#04131C]">
   <div className="bg-[#082030] w-[500px] p-0 pb-0 rounded text-center relative box-border">
   <div className="flex items-center justify-center text-center mx-auto my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7 mr-2" />{" "}
          {/* Display the SVG here */}
          <h1
            className="text-[#14c7bb] text-lg mr-2"
            style={{
              textShadow: "0 0 5px #14c7bb, 0 0 20px #14c7bb, 0 0 30px #14c7bb",
            }}
          >
            Speed Typing
          </h1>
          <p className="text-white text-xs self-center">
            tap the letters in order 
          </p>
        </div>
        <div className="subtitle text-lg text-white mb-4">{statusMessage}</div>

        <div className="game-container flex flex-col items-center bg-[#062d40] rounded p-6 mb-6 mx-6">
          <div className="flex justify-center gap-2">
            {letters.slice(0, 6).map((letter, index) => (
              <div key={index} className={`letter-box w-12 h-12 ${letterStatuses[index]} text-white flex items-center justify-center text-2xl  rounded font-bold shadow-[0px_0px_8px_0px_rgba(255,255,255,0.8)]`}>
                {letter}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 my-2">
            {letters.slice(6, 12).map((letter, index) => (
              <div key={index + 6} className={`letter-box w-12 h-12 ${letterStatuses[index + 6]} text-white flex items-center justify-center text-2xl font-bold rounded shadow-[0px_0px_8px_0px_rgba(255,255,255,0.8)]`}>
                {letter}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {letters.slice(12, 16).map((letter, index) => (
              <div key={index + 12} className={`letter-box w-12 h-12 ${letterStatuses[index + 12]} text-white flex items-center justify-center text-2xl font-bold rounded shadow-[0px_0px_8px_0px_rgba(255,255,255,0.8)]`}>
                {letter}
              </div>
            ))}
          </div>
        </div>
        <button onClick={startGame} className="start-button bg-green-500 text-white px-4 py-2 rounded mt-4">Start/Restart Game</button>
        <div className="progress-container w-full h-2 bg-gray-800 mt-4 relative">
          <div className="progress-bar bg-[#fc4207] h-full absolute top-0" style={{ width: `${progressWidth}%` }}></div>
   </div>
</div>
</div>

  );
  
};

export default SpeedTyping;