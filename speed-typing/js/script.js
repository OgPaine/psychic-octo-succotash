document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const progressBar = document.querySelector('.progress-bar');
    const statusMessage = document.getElementById('statusMessage');
    const startButton = document.getElementById('start-button');
    let currentLetterIndex = 0;
    let gameInterval;

    function randomLetter() {
        // Generates a random letter from A to Z
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }

    function populateLetters() {
        // Fills the gameContainer with divs containing random letters
        gameContainer.innerHTML = '';
        for (let i = 0; i < 10; i++) {  // Assuming 10 letter boxes
            const letterBox = document.createElement('div');
            letterBox.classList.add('letter-box');
            letterBox.textContent = randomLetter();  // Use randomLetter for actual gameplay
            gameContainer.appendChild(letterBox);
        }
    }

    function startGame() {
        // Resets the game environment and starts a new game
        currentLetterIndex = 0;
        populateLetters();
        startTimer(10);  // Start the timer with 20 seconds
        statusMessage.style.visibility = 'hidden';  // Hide the status message
    }

    function startTimer(duration) {
        // Handles the game timer and updates the progress bar
        let timeLeft = duration;
        progressBar.style.width = '100%';
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            timeLeft--;
            const progressPercentage = (timeLeft / duration) * 100;
            progressBar.style.width = `${progressPercentage}%`;

            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                progressBar.style.width = '0%';
                endGame(false);
            }
        }, 1000);
    }

    function endGame(win) {
        // Handles the end of the game logic
        clearInterval(gameInterval);
        progressBar.style.width = '0%';
        statusMessage.textContent = win ? 'Success!' : 'Faild!';
        statusMessage.className = win ? 'status-message status-success' : 'status-message status-fail';
        statusMessage.style.visibility = 'visible';
    }

    document.addEventListener('keydown', (e) => {
        const letters = gameContainer.querySelectorAll('.letter-box');
        if (currentLetterIndex >= letters.length) return;  // Check to ensure index is within bounds
        const currentLetter = letters[currentLetterIndex];
        if (e.key.toUpperCase() === currentLetter.textContent) {
            currentLetter.classList.add('correct');
            currentLetterIndex++;
            if (currentLetterIndex === letters.length) {
                endGame(true);
            }
        } else {
            currentLetter.classList.add('wrong');
            endGame(false);
        }
    });

    startButton.addEventListener('click', startGame);

    // Initialize the game for the first time
    startGame();
});
