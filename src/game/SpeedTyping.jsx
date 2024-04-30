import React, { useState, useEffect, useCallback, useRef } from 'react';
import beepSound from "../assets/beep3.mp3"; 
import { PadIcon, muteIcon, volumeIcon } from "../assets";


const SpeedTyping = () => {
  const [letters, setLetters] = useState(Array(17).fill('?')); // Initial letters are '?' to indicate uninitialized game
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(100);
  const [gameInterval, setGameInterval] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Press Start to Play!');
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [letterStatuses, setLetterStatuses] = useState(Array(17).fill('bg-transparent')); // Initial background is gray
  const [letterCount, setLetterCount] = useState(10); 
  const [soundEnabled, setSoundEnabled] = useState(true); 
  const [isTimerEnabled, setIsTimerEnabled] = useState(true); 
  const hiddenInputRef = useRef(null);
  const audioRef = useRef(new Audio(beepSound)); 

  const randomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  
  const beepAudios = useRef(Array(17).fill(null).map(() => new Audio(beepSound)));

  useEffect(() => {
 
    const initialVolume = soundEnabled ? 0.3 : 0;
    audioRef.current.volume = initialVolume;

    
    beepAudios.current.forEach(audio => {
      audio.volume = initialVolume;
    });
  }, [soundEnabled]);

  



  const populateLetters = () => {
    const easyLetters = Array(10).fill('?').map(() => randomLetter());
    const hardLetters = Array(17).fill('?').map(() => randomLetter());

    setLetters(letterCount === 10 ? easyLetters : hardLetters);
    setLetterStatuses(Array(letterCount).fill('bg-transparent')); 
  };

  const startGame = () => {
    setCurrentLetterIndex(0);
    populateLetters();
    if (isTimerEnabled) {
      startTimer(7); 
    }
    setStatusMessage('');
    setIsGameRunning(true);
    hiddenInputRef.current.focus(); 
  };

  useEffect(() => {
    if (isGameRunning) {
      hiddenInputRef.current.focus();
    }
  }, [isGameRunning]);

  const startTimer = (duration) => {
    let timeLeft = duration;
    setProgressWidth(100);
    clearInterval(gameInterval);
    const interval = setInterval(() => {
      timeLeft -= 0.1;
      const progressPercentage = (timeLeft / duration) * 100;
      setProgressWidth(progressPercentage);

      if (timeLeft <= 0) {
        clearInterval(interval);
        setProgressWidth(0);
        endGame(false);
      }
    }, 100);
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

    const inputChar = e.key.toUpperCase(); 
    const expectedChar = letters[currentLetterIndex].toUpperCase(); 

    let newStatuses = [...letterStatuses];

    if (inputChar === expectedChar) {
      
      if (soundEnabled) {
        beepAudios.current[currentLetterIndex].play();
      }

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
  }, [isGameRunning, currentLetterIndex, letters, letterStatuses, soundEnabled]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Mute or unmute all beep audios
    beepAudios.current.forEach(audio => {
      audio.volume = soundEnabled ? 0 : 0.05;
    });
  };

  const toggleTimer = () => {
    setIsTimerEnabled(!isTimerEnabled);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#04131C]">
      <div className="settings mb-6">
        <div>
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            className="difficulty-select"
            value={letterCount}
            onChange={(e) => setLetterCount(parseInt(e.target.value))}
          >
            <option value={10}>Easy</option>
            <option value={17}>Hard</option>
          </select>
        </div>
        {/* Timer toggle button */}
        <button onClick={toggleTimer} className="practice-button">
          {isTimerEnabled ? "Disable Timer" : "Enable Timer"}
        </button>
        {/* Mute button */}
        <button onClick={toggleSound} className="mute-button">
          <img src={soundEnabled ? volumeIcon : muteIcon} alt={soundEnabled ? "Unmute" : "Mute"} />
        </button>
      </div>

      <div className="bg-[#082030] w-[500px] p-0 pb-0 rounded text-center relative box-border">
        <div className="flex lg:w-[500px] ml-2 my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7" />{" "}
          <h1
            className="text-[#14c7bb] font-semibold text-lg mx-2"
            style={{
              textShadow: "0 0 5px #14c7bb, 0 0 10px #14c7bb, 0 0 20px #14c7bb",
            }}
          >
            Speed Typing
          </h1>
          <p className="text-neutral-400 text-xs self-center mt-1">
            Tap the letters in order
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
          {letterCount === 17 && (
            <div className="flex justify-center gap-2 mt-2.5">
              {letters.slice(6, 12).map((letter, index) => (
                <div key={index + 6} className={`letter-box w-12 h-12 ${letterStatuses[index + 6]} text-white flex items-center justify-center text-2xl  rounded font-bold shadow-[0px_0px_8px_0px_rgba(255,255,255,0.8)]`}>
                  {letter}
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center gap-2 mt-2.5">
            {letters.slice(letterCount === 17 ? 12 : 6, letterCount === 17 ? 17 : 10).map((letter, index) => (
              <div key={index + (letterCount === 17 ? 12 : 6)} className={`letter-box w-12 h-12 ${letterStatuses[index + (letterCount === 17 ? 12 : 6)]} text-white flex items-center justify-center text-2xl  rounded font-bold shadow-[0px_0px_8px_0px_rgba(255,255,255,0.8)]`}>
                {letter}
              </div>
            ))}
          </div>
          <input
            ref={hiddenInputRef}
            type="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
        </div>
        <button
          onTouchStart={startGame} 
          onClick={startGame} 
          className="start-button bg-green-500 text-white px-4 py-2 rounded mt-4"
        >
          Start/Restart Game
        </button>
        <div className="progress-container w-full h-2 bg-gray-800 mt-4 relative">
          <div className="progress-bar bg-orange-600 h-full absolute top-0" style={{ width: `${progressWidth}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default SpeedTyping;
