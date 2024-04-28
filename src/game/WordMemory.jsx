import React, { useState, useEffect, useRef } from "react";
import wordsData from "../data/words.json";
import { beepSound, PadIcon, muteIcon, volumeIcon } from "../assets";
import '../App.css'; 



const WordMemory = () => {
  const [allWords, setAllWords] = useState([]);
  const [seenWords, setSeenWords] = useState(new Set());
  const [currentWord, setCurrentWord] = useState("");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [progressWidth, setProgressWidth] = useState(100);
  const [gameActive, setGameActive] = useState(false);
  const [gameDuration, setGameDuration] = useState(30); // Initial duration in seconds
  const [maxScore, setMaxScore] = useState(25); // Initial max score
  const [soundEnabled, setSoundEnabled] = useState(true);  // Sound control state


  const intervalId = useRef(null);
  const clickSound = useRef(new Audio(beepSound));

  useEffect(() => {
    shuffleArray(wordsData.words);
    setAllWords([...wordsData.words]);
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const startGame = () => {
    clearInterval(intervalId.current);
    setSeenWords(new Set());
    shuffleArray(allWords);
    setAllWords([...wordsData.words]);
    setCorrectStreak(0);
    setProgressWidth(100);
    setGameActive(true);
    nextWord();
    startTimer();
  };

  const nextWord = () => {
    let unseenWords = allWords.filter(word => !seenWords.has(word));
    if (unseenWords.length === 0 || correctStreak >= maxScore) {
      endGame(false);
      return;
    }

    const seenProbability = 0.2 + 0.02 * Math.min(correctStreak, maxScore);
    let newWord = unseenWords[Math.floor(Math.random() * unseenWords.length)];
    if (Math.random() < seenProbability && seenWords.size > 0) {
      newWord = Array.from(seenWords)[Math.floor(Math.random() * seenWords.size)];
    }

    setCurrentWord(newWord);
  };

  const handleChoice = (seenChoice) => {
    playSound();
    const hasBeenSeen = seenWords.has(currentWord);
    if ((seenChoice && hasBeenSeen) || (!seenChoice && !hasBeenSeen)) {
      seenWords.add(currentWord);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      if (newStreak >= maxScore) {
        endGame(false);
        return;
      }
    } else {
      endGame(true);
      return;
    }
    nextWord();
  };

  const startTimer = () => {
    const startTime = Date.now();
    intervalId.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const width = Math.max(0, 100 - (elapsed / (gameDuration * 1000)) * 100);
      setProgressWidth(width);
      if (elapsed >= gameDuration * 1000) {
        endGame(true);
      }
    }, 100);
  };

  const endGame = (lost) => {
    clearInterval(intervalId.current);
    setGameActive(false);
    const message = lost ? "You've lost! Try again." : "Congratulations! You've won!";
    setCurrentWord(message);
    setProgressWidth(100);
  };

  const playSound = () => {
    if (soundEnabled) {
      clickSound.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#04131C]">
           {/* Settings Section */}
    <div className="settings">
      <div>
        <label htmlFor="game-duration">Speed:</label>
        <input id="game-duration" type="range" className="slider" min="30" max="60" step="5" value={gameDuration} onChange={(e) => setGameDuration(parseInt(e.target.value))} />
        <div className="slider-value">{gameDuration}s</div>
      </div>
      <div>
        <label htmlFor="max-score">Score:</label>
        <input id="max-score" type="range" className="slider" min="20" max="50" step="5" value={maxScore} onChange={(e) => setMaxScore(parseInt(e.target.value))} />
        <div className="slider-value">{maxScore} </div>
      </div>
         {/* Mute button */}
         <button onClick={() => setSoundEnabled(!soundEnabled)} className="mute-button">
  <img src={soundEnabled ? volumeIcon : muteIcon} alt={soundEnabled ? "Unmute" : "Mute"} />
</button>
    </div>
      <div className="bg-[#082030] w-[500px] p-0 pb-0 rounded text-center relative box-border">
      <div className="flex lg:w-[500px] ml-2 my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7" />
          {/* Display the SVG here */}
          <h1
            className="text-[#14c7bb] font-semibold text-lg mx-2"
            style={{
              textShadow: "0 0 5px #14c7bb, 0 0 10px #14c7bb, 0 0 20px #14c7bb",
            }}
          >
            Word Memory
          </h1>
          <p className="text-neutral-400 text-xs self-center mt-1">
          Memorize the words seen
          </p>
        </div>

        <div className="text-white font-bold text-xl mb-4">
          Score: {correctStreak}/{maxScore}
        </div>

        <div className="bg-[#062d40] rounded p-6 mb-6 mx-6">
          <span className="text-2xl text-custom-white font-bold inline-block">
            {currentWord || "Press start to play!"}
          </span>
        </div>

        {gameActive ? (
          <div className="flex justify-center gap-2 mb-4">
            <button onClick={() => handleChoice(true)} className="bg-[#593074] text-[#a139bb] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#81389b]">
              Seen
            </button>
            <button onClick={() => handleChoice(false)} className="bg-[#006763] text-[#02c4ab] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#6fffe9]">
              New
            </button>
          </div>
        ) : (
          <button onClick={startGame} className="bg-[#39883b] text-[#61e065] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#45a049] mb-4">
            Start Game
          </button>
        )}

        <div className="w-full bg-[#1b1f25] overflow-hidden h-2 mb-0">
          <div className="bg-[#fc4207] h-full" style={{ width: `${progressWidth}%` }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordMemory;
