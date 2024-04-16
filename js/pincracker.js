let code;
let timer;
let timeLeft = 10; // Default time limit
let selectedTime = 10; // Variable to store selected time limit
const guessDigitInputs = document.querySelectorAll(".guessDigit");
const errorElement = document.getElementById("error");
const resultElement = document.getElementById("result");
const progressBar = document.getElementById("progress-bar");

// Function to generate the code efficiently
function generateCode() {
    const codeSet = new Set();
    while (codeSet.size < 4) {
        codeSet.add(Math.floor(Math.random() * 10));    }
    return Array.from(codeSet);
}

// Function to set the time limit
function setTimeLimit(seconds) {
    selectedTime = timeLeft = seconds;
}

// Add event listener to handle input and backspace efficiently
document.addEventListener("input", function(event) {
    const input = event.target;
    if (input.classList.contains("guessDigit")) {
        const value = input.value.trim();
        input.value = value.replace(/\D/g, ''); // Allow only digits
        if (value.length === 1) {
            focusNextInput(input);
        }
    }
});

document.addEventListener("keydown", function(event) {
    const input = event.target;
    if (event.key === "Backspace" && input.classList.contains("guessDigit") && input.value === "") {
        focusPreviousInput(input);
    }
});

// Function to move focus to the next input field
function focusNextInput(currentInput) {
    const nextInput = currentInput.nextElementSibling;
    if (nextInput && nextInput.classList.contains("guessDigit")) {
        nextInput.focus();
    }
}

// Function to move focus to the previous input field
function focusPreviousInput(currentInput) {
    const previousInput = currentInput.previousElementSibling;
    if (previousInput && previousInput.classList.contains("guessDigit")) {
        previousInput.focus();
    }
}

// Function to check the guess and provide feedback
function checkGuess(guess) {
    return guess.map((digit, index) => {
        if (digit == code[index]) {
            return "Green";
        } else if (code.includes(digit)) {
            return "Yellow";
        } else {
            return "Red";
        }
    });
}

// Function to display feedback efficiently
function displayFeedback(guess, feedback) {
    guessDigitInputs.forEach((input, index) => {
        input.style.borderBottomColor = feedback[index];
    });
}

// Submit the guess and move focus to the last input field
function submitGuess() {
    if (timeLeft <= 0) {
        return;
    }

    const guess = Array.from(guessDigitInputs, input => parseInt(input.value.trim()));
    if (guess.some(isNaN)) {
        errorElement.textContent = "Please enter a valid 4-digit number.";
        return;
    }
    errorElement.textContent = "";

    const feedback = checkGuess(guess);
    displayFeedback(guess, feedback);
    if (feedback.every(color => color === "Green")) {
        clearInterval(timer);
        resultElement.textContent = "Congratulations! You guessed the code!";
    }
    guessDigitInputs[guessDigitInputs.length - 1].focus();
}

// Function to restart the game
function restartGame() {
    clearInterval(timer);
    errorElement.textContent = "";
    resultElement.textContent = "";
    guessDigitInputs.forEach(input => {
        input.value = "";
        input.style.borderBottomColor = "white";
    });
    guessDigitInputs[0].focus();
    code = generateCode();
    timeLeft = selectedTime;
    progressBar.style.width = "100%";
    countdown();
}

// Function for the countdown timer
function countdown() {
    const totalTime = timeLeft;
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultElement.textContent = "Time's up! The code was: " + code.join("");
        } else {
            resultElement.textContent = "Time left: " + timeLeft + " seconds";
            timeLeft--;
            const progressPercentage = (timeLeft / totalTime) * 100;
            progressBar.style.width = progressPercentage + "%";
        }
    }, 1000);
}


// Handle Enter key press to submit guess
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});

// Handle Space key press to restart/start the game
document.addEventListener("keydown", function(event) {
    if (event.key === " ") {
        restartGame();
    }
});


