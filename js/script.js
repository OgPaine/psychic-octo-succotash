document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    const progressBar = document.getElementById('progress-bar');
    const wordDisplay = document.getElementById('word-display');
    const newButton = document.getElementById('new-button');
    const seenButton = document.getElementById('seen-button');
    const buttonSound = document.getElementById('button-sound');
    const scoreDisplay = document.querySelector('.score-display'); // Score display element
    let allWords = []; // All available words loaded from JSON
    let seenWords = new Set(); // Set of words marked as seen based on player's interaction
    let wordDisplayCount = {}; // Dictionary to count displays of each word
    let correctStreak = 0; // Number of consecutive correct choices
    let gameDuration = 30000; // Duration of the game in milliseconds
    let intervalId; // Track the timer interval

    startButton.addEventListener('click', startGame);
    seenButton.addEventListener('click', function() {
        handleChoice(wordDisplay.textContent, true);
        playSound();
    });
    newButton.addEventListener('click', function() {
        handleChoice(wordDisplay.textContent, false);
        playSound();
    });

    async function loadWords() {
        const response = await fetch('json/words.json');
        const data = await response.json();
        allWords = data.words;
        shuffleArray(allWords); // Shuffle to ensure random order
    }

    async function startGame() {
        await loadWords();
        resetGame();
        nextWord();
        startTimer();
    }

    function resetGame() {
        seenWords.clear();
        wordDisplayCount = {};
        correctStreak = 0;
        updateScoreDisplay(); // Initialize score display
        allWords.forEach(word => wordDisplayCount[word] = 0); // Initialize display count
        progressBar.style.width = '100%'; // Start fully filled
        startButton.hidden = true;
        newButton.hidden = false;
        seenButton.hidden = false;
    }

    function nextWord() {
        let availableWords = allWords.filter(word => wordDisplayCount[word] < 5);
        if (availableWords.length === 0) {
            endGame(true); // End game if no words are left to display within the limit
            return;
        }
        let word;
        if (correctStreak < 2) {
            word = availableWords.find(w => !seenWords.has(w));
        } else {
            let mixedWords = availableWords.filter(w => seenWords.has(w));
            word = mixedWords.length > 0 && Math.random() > 0.5 ? 
                   mixedWords[Math.floor(Math.random() * mixedWords.length)] :
                   availableWords[Math.floor(Math.random() * availableWords.length)];
        }
        wordDisplayCount[word] = (wordDisplayCount[word] || 0) + 1;
        wordDisplay.textContent = ''; // Clear content to reset the animation
        void wordDisplay.offsetWidth; // Force DOM reflow to allow animation restart
        wordDisplay.textContent = word; // Set new word which triggers the animation
        debugDisplayHistory(word); // Debugging function call
    }

    function handleChoice(word, seenChoice) {
        const isFirstTimeSeen = !seenWords.has(word);
        if ((seenChoice && seenWords.has(word)) || (!seenChoice && isFirstTimeSeen)) {
            correctStreak++;
            updateScoreDisplay(); // Update the score display
            if (!seenChoice && isFirstTimeSeen) {
                seenWords.add(word);
            }
            if (correctStreak >= 25) {
                endGame(false); // Player wins
                return;
            }
            nextWord();
        } else {
            correctStreak = 0; // Reset the streak on a wrong answer
            updateScoreDisplay(); // Update the score display to reflect the reset
            endGame(true); // Incorrect choice, end game immediately
        }
    }

    function playSound() {
        if (buttonSound) {
            buttonSound.currentTime = 0; // Rewind to the start if already playing
            buttonSound.play().then(() => {
                console.log("Playback successful");
            }).catch((error) => {
                console.error("Playback failed", error);
            });
        }
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Score: ${correctStreak}/25`;
    }

    function debugDisplayHistory(word) {
        console.log(`Word displayed: ${word} - Display Count: ${wordDisplayCount[word]}`);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        const startTime = Date.now();
        intervalId = setInterval(() => {
            const remaining = gameDuration - (Date.now() - startTime);
            const progress = (remaining / gameDuration) * 100;
            progressBar.style.width = `${progress}%`;
            if (remaining <= 0) {
                clearInterval(intervalId);
                endGame(true); // Time's up
            }
        }, 100); // Update every 100 milliseconds for smooth transition
    }

    function endGame(lost) {
        clearInterval(intervalId);
        startButton.hidden = false; // Show start button to allow new game
        newButton.hidden = true;
        seenButton.hidden = true;
        const message = lost ? "You've lost! Try again." : "Congratulations! You've won the game!";
        wordDisplay.textContent = message;
    }
});
