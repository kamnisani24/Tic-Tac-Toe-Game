
let cells = document.querySelectorAll(".cell");
let statusText = document.getElementById("status");
let resetButton = document.getElementById("reset");
let soundOn = true;
let soundToggle = document.getElementById("soundToggle");

let scoreX = 0;
let scoreO = 0;
let drawScore = 0;

let currentPlayer = "X";
let gameActive = true;

let winnerPopup = document.getElementById("winnerPopup");
let winnerMessage = document.getElementById("winnerMessage");
let closePopup = document.getElementById("closePopup");

let welcomeScreen = document.getElementById("welcomeScreen");
let startGameButton = document.getElementById("startGame");
let newGameButton = document.getElementById("newGame");

let winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

 function playClickSound() {
    if (!soundOn) return;
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioContext.createOscillator();
    let volume = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 600;
    volume.gain.value = 0.1;

    oscillator.connect(volume);
    volume.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);

    oscillator.onended = () => audioContext.close();
}

// Congratulations voice
function speakCongratulations() {
    if (!soundOn) return;
    window.speechSynthesis.cancel();

    function speakNow() {
        let voices = window.speechSynthesis.getVoices();

        let davidVoice = voices.find(voice =>
            voice.name.includes("David")
        );

        let message = new SpeechSynthesisUtterance(
            "Congratulations! You Win!"
        );

        message.voice = davidVoice || null;
        message.lang = "en-US";
        message.rate = 0.9;
        message.pitch = 1;
        message.volume = 1;

        window.speechSynthesis.speak(message);
    }

    if (window.speechSynthesis.getVoices().length > 0) {
        speakNow();
    } else {
        window.speechSynthesis.onvoiceschanged = speakNow;
    }
}
// Cell click
cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        if (cell.innerText !== "" || !gameActive) {
            return;
        }

        cell.innerText = currentPlayer;
        playClickSound();
        checkWinner();
    });
});

// Check winner
function checkWinner() {
    for (let pattern of winningPatterns) {
        let [a, b, c] = pattern;

        if (
            cells[a].innerText !== "" &&
            cells[a].innerText === cells[b].innerText &&
            cells[b].innerText === cells[c].innerText
        ) {
            statusText.innerText = "Player " + currentPlayer + " Wins!";

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");

            winnerMessage.innerText = "Player " + currentPlayer + " Wins!";
            winnerPopup.style.display = "flex";

            gameActive = false;

            speakCongratulations();

            if (currentPlayer === "X") {
                scoreX++;
                document.getElementById("scoreX").innerText = scoreX;
            } else {
                scoreO++;
                document.getElementById("scoreO").innerText = scoreO;
            }

            return;
        }
    }

    // Draw
    let isDraw = [...cells].every(cell => cell.innerText !== "");

    if (isDraw) {
        statusText.innerText = "It's a Draw!";

        drawScore++;
        document.getElementById("drawScore").innerText = drawScore;

        gameActive = false;
        return;
    }

    // Change player
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = "Player " + currentPlayer + "'s Turn";
}

// Restart
resetButton.addEventListener("click", () => {
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("winner");
    });

    window.speechSynthesis.cancel();
    winnerPopup.style.display = "none";

    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = "Player X's Turn";
});

// Welcome screen
startGameButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
});
newGameButton.addEventListener("click", () => {

    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove("winner");
    });

    scoreX = 0;
    scoreO = 0;
    drawScore = 0;

    document.getElementById("scoreX").innerText = 0;
    document.getElementById("scoreO").innerText = 0;
    document.getElementById("drawScore").innerText = 0;

    window.speechSynthesis.cancel();
    winnerPopup.style.display = "none";

    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = "Player X's Turn";
});

// Close popup
closePopup.addEventListener("click", () => {
    winnerPopup.style.display = "none";
});
soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;

    if (soundOn) {
        soundToggle.innerText = "🔊 Sound ON";
    } else {
        soundToggle.innerText = "🔇 Sound OFF";
        window.speechSynthesis.cancel();
    }
});
