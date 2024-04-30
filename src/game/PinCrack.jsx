import React, {useReducer,useEffect,
  useRef,useCallback,useState,} from "react";
import beepSound from "../assets/beep2.mp3";
import winSound from "../assets/win.wav";
import { PadIcon, muteIcon, volumeIcon } from "../assets";


// State initial setup
const initialState = {
  pin: [],
  guess: Array(4).fill(""), // Default to 4 digits
  timer: 20,
  gameActive: false,
  digits: 4, // Default to 4 digits
  feedback: Array(4).fill(null) // Stores feedback for each guess
};

// Reducer function for state management
function reducer(state, action) {
  switch (action.type) {
    case "start_game":
      return {
        ...state,
        gameActive: true,
        timer: action.duration,
        pin: generatePin(state.digits),
        guess: Array(state.digits).fill(""),
        feedback: Array(state.digits).fill(null)
      };
    case "set_guess":
      return { ...state, guess: action.guess };
    case "set_feedback":
      return { ...state, feedback: action.feedback };
    case "set_timer":
      return { ...state, timer: action.timer };
    case "set_digits":
      return {
        ...state,
        digits: action.digits,
        guess: Array(action.digits).fill(""),
        feedback: Array(action.digits).fill(null)
      };
    case "stop_game":
      return { ...state, gameActive: false };
    default:
      return state;
  }
}

// Generate a unique PIN
function generatePin(digits) {
  let numbers = new Set();
  while (numbers.size < digits) {
    numbers.add(Math.floor(Math.random() * 10).toString());
  }
  return Array.from(numbers);
}

function PinCrack() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameDuration, setGameDuration] = useState(20);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const beepSoundRef = useRef(new Audio(beepSound));
  const winSoundRef = useRef(new Audio(winSound));
  const inputsRef = useRef([]);
  const [message, setMessage] = useState("");

  const startGame = () => {
    setShowFeedback(false);
    setMessage("");
    dispatch({
      type: "start_game",
      duration: gameDuration,
    });
    setTimeout(() => {
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus();
      }
    }, 0);
  };

  const handleDigitChange = (value) => {
    dispatch({ type: "set_digits", digits: parseInt(value, 10) });
  };

  const gameOver = useCallback(() => {
    setMessage(`Time's up! The correct PIN was ${state.pin.join("")}`);
    dispatch({ type: "stop_game" });
  }, [state.pin, dispatch]);

  useEffect(() => {
    if (state.gameActive && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [state.gameActive]);

  useEffect(() => {
    if (state.gameActive) {
      const interval = setInterval(() => {
        if (soundEnabled) {
          beepSoundRef.current.volume = 0.5;
          beepSoundRef.current.play();
        }
        const newTime = state.timer - 1;
        dispatch({ type: "set_timer", timer: newTime });
        if (newTime <= 0) {
          clearInterval(interval);
          gameOver();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.gameActive, state.timer, soundEnabled, gameOver]);

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      const newFeedback = state.guess.map((guess, idx) => {
        if (guess === state.pin[idx]) {
          return 'correct';
        } else if (state.pin.includes(guess)) {
          return 'wrong-position';
        } else {
          return 'incorrect';
        }
      });

      dispatch({ type: "set_feedback", feedback: newFeedback });
      setShowFeedback(true);

      const isCompleteGuess = state.guess.every((val) => val !== "");
      const isCorrect = isCompleteGuess && newFeedback.every(f => f === 'correct');
      if (isCorrect) {
        if (soundEnabled) {
          winSoundRef.current.volume = 0.3;
          winSoundRef.current.play();
        }
        setMessage("Congratulations! You guessed the right PIN!");
        dispatch({ type: "stop_game" });
      } else {
        setMessage("Incorrect PIN. Try again!");
      }
    } else if (/^\d$/.test(event.key)) {
      const newGuess = [...state.guess];
      newGuess[index] = event.key;
      dispatch({ type: "set_guess", guess: newGuess });
      if (index < state.digits - 1) {
        inputsRef.current[index + 1].focus();
      }
      event.preventDefault();
    } else if (event.key === "Backspace") {
      const newGuess = [...state.guess];
      newGuess[index] = ""; // Clear the current field
      if (newGuess[index] === "" && index > 0) {
        // Move back and clear previous if current was already empty
        newGuess[index - 1] = "";
        inputsRef.current[index - 1].focus();
      }
      dispatch({ type: "set_guess", guess: newGuess });
      event.preventDefault();
    }
  };

  const getBorderClass = (index) => {
    if (!showFeedback) return "border-white";
    const feedback = state.feedback[index];
    switch (feedback) {
      case 'correct':
        return "border-green-500";
      case 'wrong-position':
        return "border-yellow-500";
      case 'incorrect':
        return "border-red-500";
      default:
        return "border-white";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#04131C]">
      <div className="settings mb-6">
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
        <div>
          <label htmlFor="digits">Digits:</label>
          <input
            id="digits"
            type="range"
            className="slider"
            min="3"
            max="5"
            step="1"
            value={state.digits}
            onChange={(e) => handleDigitChange(e.target.value)}
          />
          <div className="slider-value">{state.digits}</div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="mute-button"
        >
          <img
            src={soundEnabled ? volumeIcon : muteIcon}
            alt={soundEnabled ? "Unmute" : "Mute"}
          />
        </button>
      </div>

      <div className="bg-[#082030] w-[500px] p-0 pb-0 rounded text-center relative box-border">
        <div className="flex lg:w-[500px] ml-2 my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7" />
          <h1 className="text-[#14c7bb] font-semibold text-lg mx-2" style={{
            textShadow: "0 0 5px #14c7bb, 0 0 10px #14c7bb, 0 0 20px #14c7bb",
          }}>
            Pin Crack
          </h1>
          <p className="text-neutral-400 text-xs self-center mt-1">
            Enter the correct PIN
          </p>
        </div>
        <div className="text-white font-bold text-xl mb-2">{message}</div>

        <div className="bg-[#062d40] rounded p-6 mb-0 mx-6 flex justify-center">
          {state.guess.map((g, index) => (
            <input
              key={index}
              type="tel"
              className={`bg-transparent border-b-3 ${getBorderClass(index)} text-white text-center w-16 h-12 text-3xl m-1 focus:outline-none`}
              maxLength="1"
              value={g}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              disabled={!state.gameActive}
            />
          ))}
        </div>

        <button
          className="bg-green-700 text-green-400 py-2 px-24 rounded-none border-none cursor-pointer hover:bg-green-600 mt-4"
          onClick={startGame}
        >
          {state.gameActive ? "Restart" : "Start Game"}
        </button>

        <div className="w-full bg-gray-700 h-2 relative mt-4">
          <div
            className="bg-orange-600 h-2 transition-all duration-1000 ease-linear"
            style={{ width: `${(state.timer / gameDuration) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PinCrack;
