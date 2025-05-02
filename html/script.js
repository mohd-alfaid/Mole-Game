let ground = document.querySelector(".ground");
let score = 0;
let missedMoles = 0;
let gameActive = false;
let gamePaused = false;
let moleInterval;

let highScore = localStorage.getItem("highScore") || 0;
let scoreElement = document.getElementById("score");
let highScoreElement = document.getElementById("high-score");
let livesElement = document.getElementById("lives");
let playButton = document.getElementById("play-btn");
let pauseButton = document.getElementById("pause-btn");
let playAgainButton = document.getElementById("play-again-btn");
let gameTitle = document.getElementById("game-title");

highScoreElement.innerText = highScore;

// Clone 8 more holes to make total 9
let originalHole = document.querySelector(".hole");
for (let i = 0; i < 8; i++) {
    let newHole = originalHole.cloneNode(true);
    ground.appendChild(newHole);
}

// Get updated list of moles after cloning
let moles = document.querySelectorAll(".mole");

// Attach click listeners
moles.forEach(mole => {
    mole.setAttribute("draggable", false);
    mole.addEventListener("click", () => {
        if (gameActive && !gamePaused && mole.style.display === "block") {
            whacked(mole);
        }
    });
});

function whacked(mole) {
    score++;
    updateScore();
    mole.style.display = "none";
}


function updateScore() {
    scoreElement.innerText = score;
    highScoreElement.innerText = highScore;
}

 function updateLives() {
    const totalLives = 3;
    let hearts = '';
    for (let i = 0; i < totalLives - missedMoles; i++) {
        hearts += '❤️ ';
    }
    livesElement.innerHTML = hearts;
}

function showMole() {
    if (!gameActive || gamePaused) return;

    // Hide all moles first
    moles.forEach(m => m.style.display = "none");

    let index = Math.floor(Math.random() * moles.length);
    let mole = moles[index];
    mole.style.display = "block";

    setTimeout(() => {
        if (mole.style.display === "block") {
            mole.style.display = "none";
            missedMoles++;

            if (missedMoles >= 3) {
                gameOver();
            } else {
                updateLives();
            }
        }
    }, 750);
}

function startGame() {
    score = 0;
    missedMoles = 0;
    gameActive = true;
    gamePaused = false;

    updateScore();
    updateLives();

    // Hide title on game start
    gameTitle.classList.add("hidden");

    playButton.style.display = "none";
    playAgainButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    pauseButton.innerText = "Pause";

    moles.forEach(m => m.style.display = "none");

    clearInterval(moleInterval);
    moleInterval = setInterval(() => {
        if (gameActive && !gamePaused) {
            showMole();
        }
    }, 1500);
}

function gameOver() {
    gameActive = false;
    clearInterval(moleInterval);
    pauseButton.style.display = "none";
    playAgainButton.style.display = "inline-block";

    // ❗ Make sure lives are cleared on game over
    missedMoles = 3;
    updateLives();

    // Show title on game over with animation
    gameTitle.classList.remove("hidden");
    gameTitle.classList.add("fade-in-title");
    gameTitle.style.animation = "fadeInTitle 0.6s ease-in-out";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highScoreElement.innerText = highScore;
    }

    alert("Game Over! You missed 3 moles.");
}

// Button listeners
playButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

pauseButton.addEventListener("click", () => {
    gamePaused = !gamePaused;
    pauseButton.innerText = gamePaused ? "Resume" : "Pause";
});
