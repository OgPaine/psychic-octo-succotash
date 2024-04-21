import React, { useState, useEffect, useRef } from "react";
import wordsData from "../data/words.json"; // Ensure the path is correct based on your project structure
import beepSound from "../assets/beep.mp3"; // Ensure this import path is correct based on your project structure
import PadIcon from "../assets/pad.svg"; // Importing the SVG

const WordMemory = () => {
  const [allWords, setAllWords] = useState([]);
  const [seenWords, setSeenWords] = useState(new Set());
  const [currentWord, setCurrentWord] = useState("");
  const [correctStreak, setCorrectStreak] = useState(0);
  const [progressWidth, setProgressWidth] = useState(100);
  const [gameActive, setGameActive] = useState(false);

  const intervalId = useRef(null);
  const clickSound = useRef(new Audio(beepSound));

  useEffect(() => {
    shuffleArray(wordsData.words);
    setAllWords([...wordsData.words]);
  }, []);
  // Duration of the game in milliseconds
  const gameDuration = 30000;
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
    let unseenWords = allWords.filter((word) => !seenWords.has(word));
    if (unseenWords.length === 0 || correctStreak >= 25) {
      endGame(false);
      return;
    }

    const seenProbability = 0.2 + 0.02 * Math.min(correctStreak, 25);
    let newWord = unseenWords[Math.floor(Math.random() * unseenWords.length)];
    if (Math.random() < seenProbability && seenWords.size > 0) {
      newWord =
        Array.from(seenWords)[Math.floor(Math.random() * seenWords.size)];
    }

    setCurrentWord(newWord);
  };

  const handleChoice = (seenChoice) => {
    playSound(); // Play sound whenever an option is chosen
    const hasBeenSeen = seenWords.has(currentWord);
    if ((seenChoice && hasBeenSeen) || (!seenChoice && !hasBeenSeen)) {
      seenWords.add(currentWord);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      if (newStreak === 25) {
        // Check if player has won
        endGame(false); // False indicates the player won (not lost)
        return;
      }
    } else {
      endGame(true); // True indicates the player lost
      return;
    }
    nextWord();
  };

  const startTimer = () => {
    const startTime = Date.now();
    intervalId.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const width = Math.max(0, 100 - (elapsed / gameDuration) * 100);
      setProgressWidth(width);
      if (elapsed >= gameDuration) {
        endGame(true);
      }
    }, 100);
  };

  const endGame = (lost) => {
    clearInterval(intervalId.current);
    setGameActive(false);
    const message = lost
      ? "You've lost! Try again."
      : "Congratulations! You've won!";
    setCurrentWord(message);
    setProgressWidth(100);
  };

  const playSound = () => {
    clickSound.current.play();
  };
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
            Word Memory Game
          </h1>
          <p className="text-white text-xs self-center">
            Memorize the words seen
          </p>
        </div>

        {/* Score Display */}
        <div className="text-white font-bold text-xl mb-4">
          Score: {correctStreak}/25
        </div>

        {/* Word Box */}
        <div className="bg-[#062d40] rounded p-6 mb-6 mx-6">
          <span className="text-2xl text-custom-white font-bold inline-block">
            {currentWord || "Press start to play!"}
          </span>
        </div>

        {/* Game Control Buttons */}
        {gameActive ? (
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => handleChoice(true)}
              className="bg-[#593074] text-[#a139bb] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#81389b]"
            >
              Seen
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="bg-[#006763] text-[#02c4ab] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#6fffe9]"
            >
              New
            </button>
          </div>
        ) : (
          <button
            onClick={startGame}
            className="bg-[#39883b] text-[#61e065] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#45a049] mb-4"
          >
            Start Game
          </button>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-[#1b1f25] overflow-hidden h-2 mb-0">
          <div
            className="bg-[#fc4207] h-full"
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WordMemory;
