document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const digitButtons = document.getElementById('digitButtons');
    const timeButtons = document.getElementById('timeButtons');
    const pinInput = document.getElementById('pinInput');
    const timerDisplay = document.getElementById('timerDisplay');

    let pin = [];
    let timer = null;
    let defaultTime = 20;  // Default time
    let selectedTime = defaultTime;  // Time selected by the user
    let timeLeft = selectedTime; // Initialize timeLeft to ensure it's defined
    let digits = 4;     // Default number of digits
    let gameStarted = false;

    function startGame() {
        gameStarted = true;
        startButton.textContent = 'Restart Game';
        setupGame();
        setupInputs();
        clearInterval(timer); // Clear any existing interval
        timerDisplay.style.color = 'white'; // Set timer display color to white
        timerDisplay.style.fontWeight = 'bold'; // Set timer display font weight to bold
        timerDisplay.textContent = `Time: ${selectedTime}s`; // Set default time display
        updateProgressBar(100); // Set progress bar to full
        startCountdown(); // Start the timer
    }

    function restartGame() {
        if (!successSound.paused) {
            successSound.pause();
            successSound.currentTime = 0;  // Reset the success sound to the start
        }
        clearInterval(timer); // Clear any existing interval
        timeLeft = selectedTime;  // Reset time to selected value or default if not set
        gameStarted = false;
        startButton.textContent = 'Start Game';
        timerDisplay.textContent = `Time: ${timeLeft}s`; // Ensure display is updated
        updateProgressBar(100); // Reset progress bar to full
        startGame(); // Call startGame to restart the game
    }
    

    function generatePin(d) {
        let newPin = [];
        while (newPin.length < d) {
            const randomDigit = Math.floor(Math.random() * 10).toString();
            if (!newPin.includes(randomDigit)) {
                newPin.push(randomDigit);
            }
        }
        return newPin;
    }
    
    function setupGame() {
        pin = generatePin(digits); // Ensure generatePin is defined elsewhere in your script
    }
    
    
    function setupInputs() {
        pinInput.innerHTML = '';
        for (let i = 0; i < digits; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = '1';
            input.id = `input${i + 1}`;
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleBackspace);
            pinInput.appendChild(input);
        }
        pinInput.children[0].focus();
    }

    function handleInput(e) {
        const input = e.target;
        const inputValue = input.value.trim();
        if (/^\d$/.test(inputValue)) {
            const nextSibling = input.nextElementSibling;
            if (nextSibling) {
                nextSibling.focus();
            }
        } else {
            input.value = ''; // Clear the input if it's not a digit
        }
    }

    function handleBackspace(e) {
        if (e.key === 'Backspace' && e.target.value === '') {
            const previousSibling = e.target.previousElementSibling;
            if (previousSibling) {
                previousSibling.focus();
            }
        }
    }

    function handleEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            const inputs = Array.from(pinInput.querySelectorAll('input'));
            const guess = inputs.map(input => input.value).join('');
            if (guess.length === digits) {
                validateGuess(guess.split(''));
            }
        }
    }

    function startCountdown() {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1;
                timerDisplay.textContent = `Time: ${timeLeft}s`;
                const widthPercentage = (timeLeft / selectedTime) * 100;
                updateProgressBar(widthPercentage);
                playTickSound();  // Play the tick sound every second
            } else {
                clearInterval(timer);
                stopTickSound();  // Stop the tick sound when time runs out
                gameOver();
            }
        }, 1000);
    }
    
    function updateProgressBar(widthPercentage) {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${widthPercentage}%`; // Set the width of the progress bar
    }
    
    function gameOver() {
        timerDisplay.textContent = "Time's up! The correct PIN was " + pin.join('');
        timerDisplay.className = 'timerDisplay timerDisplayGameOver'; // Change class to game over
        gameStarted = false;
        startButton.textContent = 'Start Game';
        Array.from(pinInput.querySelectorAll('input')).forEach(input => input.disabled = true);
    }

    function validateGuess(guess) {
        displayFeedback(guess);
        if (guess.join('') === pin.join('')) {
            clearInterval(timer);
            successSound.play();
            timerDisplay.textContent = 'Congratulations! You guessed the right PIN!';
            timerDisplay.className = 'timerDisplay timerDisplaySuccess';
            gameStarted = false;
            startButton.textContent = 'Start Game';
            Array.from(pinInput.querySelectorAll('input')).forEach(input => input.disabled = true);
        }
    }

    function displayFeedback(guess) {
        const inputs = pinInput.querySelectorAll('input');
        for (let i = 0; i < digits; i++) {
            const input = inputs[i];
            const feedbackColor = getFeedback(guess[i], i);
            input.style.borderBottomColor = feedbackColor;
            // Adding ARIA to dynamically update based on feedback
            input.setAttribute('aria-label', feedbackColor);
        }
    }
// Create an audio object for success sound
const successSound = new Audio('audio/win.wav');
successSound.volume = 0.2 ;

    function getFeedback(guessDigit, index) {
        const pinDigit = pin[index];
        if (guessDigit === pinDigit) {
            return 'green';
        } else if (pin.includes(guessDigit)) {
            return 'yellow';
        } else {
            return 'red';
        }
    }
    // Create an audio object
const tickSound = new Audio('audio/beep.mp3');
tickSound.volume = 0.5;  // Set volume to 50%

// Function to play the sound
function playTickSound() {
    tickSound.play();
}

// Function to stop the sound
function stopTickSound() {
    tickSound.pause();
    tickSound.currentTime = 0; // Reset the sound to the start
}


    // Event listeners for digit buttons
    digitButtons.addEventListener('click', (e) => {
        const button = e.target;
        if (button.tagName === 'BUTTON') {
            digits = parseInt(button.textContent);
            restartGame();
        }
    });

    // Event listeners for time buttons
    timeButtons.addEventListener('click', (e) => {
        const button = e.target;
        if (button.tagName === 'BUTTON') {
            selectedTime = parseInt(button.textContent);
            timerDisplay.textContent = `Time: ${selectedTime}s`;
            restartGame();
        }
    });

    // Start or restart the game
    startButton.addEventListener('click', () => {
        if (!gameStarted) {
            startGame();
        } else {
            restartGame();
        }
    });

    // Event listener for Enter key
    pinInput.addEventListener('keydown', handleEnter);

    /// Event listener for Space key to reset timer
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case ' ':
            e.preventDefault(); // Prevent the default action (page scrolling)
            if (!gameStarted) {
                startGame();
            } else {
                restartGame();
            }
            break;
        case 'Enter':
            submitGuess();
            break;
        default:
            break;
    }
});

    function submitGuess() {
        const inputs = Array.from(pinInput.querySelectorAll('input'));
        const guess = inputs.map(input => input.value).join('');
        if (guess.length === digits) {
            validateGuess(guess.split(''));
        }
    }
}); 
