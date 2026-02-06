const words = [
    "javascript", "python", "react", "html", "css",
    "vercel", "github", "coding", "design", "frontend",
    "backend", "database", "server", "api", "function",
    "variable", "constant", "array", "object", "string",
    "syntax", "loop", "condition", "promise", "async",
    "await", "component", "hook", "state", "props",
    "router", "middleware", "token", "auth", "login",
    "logout", "session", "cookie", "storage", "cache"
];

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameArea = document.getElementById('game-area');
const wordContainer = document.getElementById('word-container');
const messageInput = document.getElementById('word-input');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');

let score = 0;
let time = 60;
let isPlaying = false;
let timeInterval;
let gameInterval;
let activeWords = [];

// Init
messageInput.disabled = true;

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

messageInput.addEventListener('input', (e) => {
    const typedText = e.target.value.trim().toLowerCase();
    
    // Find matching word
    const matchIndex = activeWords.findIndex(wordObj => wordObj.text === typedText);

    if (matchIndex !== -1) {
        // Correct Word
        const matchedWord = activeWords[matchIndex];
        removeWord(matchedWord.element, matchIndex);
        score += 10;
        scoreEl.innerText = score;
        e.target.value = '';
        
        // Add visual feedback (can improve later)
        messageInput.classList.add('correct');
        setTimeout(() => messageInput.classList.remove('correct'), 100);
    }
});

function startGame() {
    // Reset Data
    score = 0;
    time = 60;
    activeWords = [];
    scoreEl.innerText = score;
    timeEl.innerText = time;
    wordContainer.innerHTML = '';
    
    // UI Updates
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    messageInput.disabled = false;
    messageInput.value = '';
    messageInput.focus();
    
    isPlaying = true;

    // Start Loops
    timeInterval = setInterval(updateTime, 1000);
    gameInterval = setInterval(spawnWord, 2000); // New word every 2s
    spawnWord();
}

function updateTime() {
    time--;
    timeEl.innerText = time;

    if (time === 0) {
        endGame();
    }
}

function spawnWord() {
    if (!isPlaying) return;

    const randIndex = Math.floor(Math.random() * words.length);
    const wordText = words[randIndex];
    
    // Create Element
    const wordEl = document.createElement('div');
    wordEl.classList.add('floating-word');
    wordEl.innerText = wordText;
    
    // Random Position
    const maxX = gameArea.clientWidth - 100; // rough width of word
    const randomX = Math.floor(Math.random() * maxX);
    wordEl.style.left = `${randomX}px`;
    
    // Random Speed
    const duration = Math.random() * 3 + 3; // 3s to 6s
    wordEl.style.animationDuration = `${duration}s`;

    wordContainer.appendChild(wordEl);
    
    // Track word
    activeWords.push({
        text: wordText,
        element: wordEl
    });

    // Cleanup when animation ends (missed word)
    wordEl.addEventListener('animationend', () => {
        if(document.body.contains(wordEl)) {
             // Word reached bottom
             // Penalty logic could go here
             const index = activeWords.findIndex(w => w.element === wordEl);
             if (index !== -1) {
                 activeWords.splice(index, 1);
                 wordEl.remove();
             }
        }
    });
}

function removeWord(element, index) {
    element.classList.add('matched');
    element.addEventListener('transitionend', () => {
        element.remove();
    });
    activeWords.splice(index, 1);
}

function endGame() {
    isPlaying = false;
    clearInterval(timeInterval);
    clearInterval(gameInterval);
    
    messageInput.disabled = true;
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
}
