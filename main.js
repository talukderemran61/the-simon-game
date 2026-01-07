let randomSequence = [];
let userSequence = [];
let score = 0;
let highestScore = 0;
let started = false;
let acceptingInput = false;

// start game after pressing "A"
$(document).on("keydown", function (event) {
    if (event.key.toLowerCase() === 'a' && !started) {
        console.log("Game on");
        gameStartAnimation();
        displayCurrentScore(score);
        displayHighestScore(score);
        getSavedHighScore();
        started = true;

        setTimeout(() => {
            nextRound();
        }, 6000);
    }
})

let lastTap = 0;

$(".mobile-btn").on("pointerdown", function (event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) return; // ignore if double
    lastTap = currentTime;

    console.log(event.target.getAttribute("type"));
    if (event.target.getAttribute("type") === "play" && !started) {
        console.log("Game on");
        $(".mobile-btn").addClass("hidden");
        gameStartAnimation();
        displayCurrentScore(score);
        displayHighestScore(score);
        getSavedHighScore();
        started = true;

        setTimeout(() => {
            nextRound();
        }, 6000);
    }
})

function gameStartAnimation() {
    $(".animate-container").addClass("game-on");
    $(".animate-container").removeClass("game-over");
    countdownStart();
}

function countdownStart() {
    let count = 3;
    const countdownEl = document.querySelector(".count-start");

    const interval = setInterval(() => {
        if (count < 1) {
            clearInterval(interval);
            countdownEl.textContent = "Go!";
            countdownEl.classList.remove("countdown");
            void countdownEl.offsetWidth;
            countdownEl.classList.add("countdown");
            setTimeout(() => countdownEl.classList.add("hidden"), 1000);
            return;
        }
        countdownEl.classList.remove("hidden")
        countdownEl.textContent = count;
        countdownEl.classList.remove("countdown");
        void countdownEl.offsetWidth;
        countdownEl.classList.add("countdown");
        count--;
    }, 1000);
    setTimeout(() => playAudio(score), 800);
}

// start a new round
function nextRound() {
    userSequence = []; // reset user clicks for this round
    console.log("Round " + (score + 1));
    addRandomNumber(); // extend the sequence
    playSequence(); // play it visually
}

// add one random number to the random sequence
function addRandomNumber() {
    let randomNum = Math.floor(Math.random() * 4) + 1;
    randomSequence.push(randomNum);
    console.log("random sequence: ", randomSequence);
}

// play entire sequence with delay
function playSequence() {
    for (let i = 0; i < randomSequence.length; i++) {
        const delay = i * 500;
        setTimeout(() => {
            playAudio(randomSequence[i]);
            clickAnimation(randomSequence[i], i);
        }, delay)
    }
    setTimeout(() => acceptingInput = true, randomSequence.length * 500);
}

// click animation
function clickAnimation(numberbtn) {
    const button = $(".btn-" + numberbtn);
    button.addClass("pressed");
    setTimeout(() => button.removeClass("pressed"), 300);
}

// handle player clicks
$(".btn").on("pointerdown", function (event) {
    if (!acceptingInput) return;

    let clickedBtnNum = Number(event.target.getAttribute("position"));
    // playAudio(clickedBtnNum);
    userSequence.push(clickedBtnNum);
    clickAnimation(clickedBtnNum);
    console.log("user sequence: ", userSequence);

    checkAnswer(userSequence.length - 1);
});

// compare player clicks vs random sequence
function checkAnswer(currentNumIndex) {
    if (userSequence[currentNumIndex] === randomSequence[currentNumIndex]) {
        // correct so far
        playAudio(userSequence[currentNumIndex]);
        if (randomSequence.length === userSequence.length) {
            console.log("Round Passed!");

            acceptingInput = false;
            score++;
            displayCurrentScore(score);
            playAudio("score+");

            flashybg();
            $(".animate-container").addClass("bg-glow");
            setTimeout(() => {
                flashybg();
                $(".animate-container").removeClass("bg-glow");
            }, 400);

            setTimeout(() => nextRound(), 1500);
        }
    } else {
        console.log("Game Over!");
        gameOverAnimation();
        playAudio();
        startOver();
    }
}

function gameOverAnimation() {
    $(".animate-container").removeClass("game-on");
    $(".animate-container").addClass("game-over");

    setTimeout(() => $(".mobile-btn").removeClass("hidden"), 2000); // reappear mobile play btn
}

function displayCurrentScore(score) {
    $("#level-score").text("Score: " + score);
}

function displayHighestScore(lastScore) {
    if (lastScore > highestScore) {
        highestScore = lastScore;

        // save high score to localstorage
        localStorage.setItem("savedHighestScore", highestScore);
    }
    $("#level-hscore").text("Highest score: " + highestScore);
}

// get saved high score when the page load
function getSavedHighScore() {
    const savedHighScore = localStorage.getItem("savedHighestScore");
    if (savedHighScore) {
        highestScore = Number(savedHighScore);
        $("#level-hscore").text("Highest score: " + highestScore);
    }
}

// reset game
function startOver() {
    displayHighestScore(score); // check before reset

    randomSequence = [];
    userSequence = [];
    score = 0;
    started = false;
    acceptingInput = false;
    displayCurrentScore(score);
    console.log("Please press A to restart");
}

// play click audio
function playAudio(num) {
    let audio;
    switch (num) {
        case 0: audio = new Audio('sounds/game-countdown.mp3'); break;
        case 1: audio = new Audio('sounds/green.mp3'); break;
        case 2: audio = new Audio('sounds/red.mp3'); break;
        case 3: audio = new Audio('sounds/yellow.mp3'); break;
        case 4: audio = new Audio('sounds/blue.mp3'); break;
        case "score+": audio = new Audio('sounds/score-up.mp3'); break;
        default: audio = new Audio('sounds/game-over.mp3');
    }
    audio.play();
}

// flashy effect on round win
function flashybg() {
    setTimeout(() => {
        $(".animate-container").addClass("flashywhite");
        setTimeout(() => {
            $(".animate-container").removeClass("flashywhite");
        }, 200);
    }, 300);
}