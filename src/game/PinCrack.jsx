import React, {
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import beepSound from "../assets/beep2.mp3";
import winSound from "../assets/win.wav";
import PadIcon from "../assets/pad.svg"; // Make sure you have a pad icon SVG

// State initial setup
const initialState = {
  pin: [],
  guess: Array(4).fill(""), // Assuming 'digits' is 4, adjust if 'digits' can vary
  timer: 20,
  gameActive: false,
  digits: 4,
};

// Reducer function for state management
function reducer(state, action) {
  switch (action.type) {
    case "start_game":
      return {
        ...state,
        gameActive: true,
        timer: 20,
        pin: generatePin(state.digits),
        guess: Array(state.digits).fill(""),
      };
    case "set_guess":
      return { ...state, guess: action.guess };
    case "set_timer":
      return { ...state, timer: action.timer };
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

// Main component
function PinCrack() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showFeedback, setShowFeedback] = useState(false);
  const beepSoundRef = useRef(new Audio(beepSound));
  const winSoundRef = useRef(new Audio(winSound));
  const inputsRef = useRef([]);

  // Handle game over condition
  const gameOver = useCallback(() => {
    setMessage(`Time's up! The correct PIN was ${state.pin.join("")}`);
    dispatch({ type: "stop_game" });
  }, [state.pin, dispatch]);

  // Effect to handle automatic focus
  useEffect(() => {
    if (state.gameActive && inputsRef.current[0]) {
      inputsRef.current[0].focus(); // Automatically focus the first input field when the game starts
    }
  }, [state.gameActive]);

  // Timer management
  useEffect(() => {
    if (state.gameActive) {
      const interval = setInterval(() => {
        // Play beep sound
        beepSoundRef.current.volume = 0.5; // Set volume to half
        beepSoundRef.current.play();

        const newTime = state.timer - 1;
        dispatch({ type: "set_timer", timer: newTime });
        if (newTime <= 0) {
          clearInterval(interval);
          gameOver();
          setMessage(`Time's up! The correct PIN was ${state.pin.join("")}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.gameActive, state.timer, gameOver, state.pin]);

  const [message, setMessage] = useState(""); // Holds messages like winning or game over notices

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      setShowFeedback(true);
      const isCompleteGuess = state.guess.every((val) => val !== "");
      const isCorrect =
        isCompleteGuess && state.guess.join("") === state.pin.join("");
      if (isCorrect) {
        winSoundRef.current.volume = 0.3; // Set the volume to half before playing
        winSoundRef.current.play();
        setMessage("Congratulations! You guessed the right PIN!");
        dispatch({ type: "stop_game" });
      }
    } else if (event.key === "Backspace") {
      const newGuess = [...state.guess];
      if (newGuess[index] !== "") {
        newGuess[index] = "";
        dispatch({ type: "set_guess", guess: newGuess });
      }
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
      setShowFeedback(false);
      setMessage(""); // Always clear the message on edit or backspace
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d$/.test(value)) return; // Ignore non-numeric input
    const newGuess = [...state.guess];
    newGuess[index] = value;
    dispatch({ type: "set_guess", guess: newGuess });

    // Move focus to the next input field automatically after a valid input
    if (index < state.digits - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Determine border class based on feedback
  const getBorderClass = (index) => {
    if (!showFeedback) return "border-white"; // Return default border if feedback is not enabled
    const digit = state.guess[index];
    if (digit === state.pin[index]) {
      return "border-green-500"; // Correct digit in the correct position
    } else if (state.pin.includes(digit)) {
      return "border-yellow-500"; // Correct digit but in the wrong position
    } else {
      return "border-red-500"; // Incorrect digit
    }
  };

  const startGame = () => {
    setShowFeedback(false); // Reset feedback visibility
    setMessage(""); // Clear any end game messages
    dispatch({
      type: "start_game",
      digits: initialState.digits, // Reset the game with initial settings
    });
    // Ensuring the inputs are cleared and ready for a new game
    setTimeout(() => {
      if (inputsRef.current[0]) {
        inputsRef.current[0].focus(); // Focus the first input field
      }
    }, 0);
  };

  // Render function
  return (
    <div className="flex items-center justify-center h-screen bg-[#04131C]">
      <div className="bg-[#082030] w-full lg:w-[500px] p-0 pb-0 rounded text-center relative box-border">
        <div className="flex items-center justify-center text-center mx-auto my-2">
          <img src={PadIcon} alt="Pad Icon" className="h-7 mr-2" />
          <h1
            className="text-[#14c7bb] text-lg mr-2"
            style={{
              textShadow:
                "0 0 5px #14c7bb, 0 0 20px #14c7bb, 0 0 30px #14c7bb",
            }}
          >
            Pin Crack
          </h1>
          <p className="text-white text-xs self-center">
            Enter the correct PIN
          </p>
        </div>
        <div className="text-white font-bold text-xl mb-2">{message}</div>

        <div className="bg-[#062d40] rounded p-6 mb-0 mx-6 flex justify-center">
          {state.guess.map((g, index) => (
            <input
              key={index}
              type="tel" // Use type "tel" to hint to mobile browsers to show the numeric keypad
              className={`bg-transparent border-b-3 ${getBorderClass(
                index
              )} text-white text-center w-16 h-12 text-3xl m-1 focus:outline-none`}
              maxLength="1"
              value={g}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              disabled={!state.gameActive} // Disable input fields when the game is not active
            />
          ))}
        </div>

        <button
          className="bg-[#39883b] text-[#61e065] py-2 px-24 rounded-none border-none cursor-pointer hover:bg-[#45a049] mt-4"
          onClick={startGame}
        >
          {state.gameActive ? "Restart" : "Start Game"}
        </button>

        <div className="w-full bg-gray-700 h-2 relative mt-4">
          <div
            className="bg-[#fc4207] h-2 transition-all duration-1000 ease-linear"
            style={{ width: `${(state.timer / initialState.timer) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PinCrack;
