// script.js

const cardsArray = [
    { name: 'A', img: 'A' },
    { name: 'B', img: 'B' },
    { name: 'C', img: 'C' },
    { name: 'D', img: 'D' },
    { name: 'E', img: 'E' },
    { name: 'F', img: 'F' },
    { name: 'G', img: 'G' },
    { name: 'H', img: 'H' },
];

const gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());

let firstCard = '';
let secondCard = '';
let firstCardElement, secondCardElement;
let lockBoard = false;
let matchedPairs = 0;
let gameStarted = false;
let timerInterval;
let seconds = 0;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('time').textContent = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetGame() {
    const memoryGame = document.querySelector('.memory-game');
    memoryGame.innerHTML = '';
    seconds = 0;
    document.getElementById('time').textContent = '00:00';
    gameStarted = false;
    matchedPairs = 0;
    stopTimer();
    initializeGame();
}

function initializeGame() {
    gameGrid.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = item.name;

        const front = document.createElement('div');
        front.classList.add('front-face');
        front.textContent = item.img;

        const back = document.createElement('div');
        back.classList.add('back-face');

        card.appendChild(front);
        card.appendChild(back);

        document.querySelector('.memory-game').appendChild(card);

        card.addEventListener('click', flipCard);
    });
}

function flipCard() {
    
    if (lockBoard) return;
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    if (this === firstCardElement) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this.dataset.name;
        firstCardElement = this;
    } else {
        secondCard = this.dataset.name;
        secondCardElement = this;
        checkForMatch();
    }
}

function checkForMatch() {
    if (firstCard === secondCard) {
        disableCards();
        matchedPairs++;
        if (matchedPairs === cardsArray.length) {
            stopTimer();
            const score1 = document.getElementById('score');
            score1.classList.add('game_score')
            score1.textContent = `Score: ${matchedPairs}`;
            setTimeout(() => alert('Congratulations! You won!'), 500);
        }
    } else {
        unflipCards();
        const score = document.getElementById('score');
        score.classList.add('game_score')
        score.textContent = `Score: ${matchedPairs}`;
    }
}

function disableCards() {
    firstCardElement.removeEventListener('click', flipCard);
    secondCardElement.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCardElement.classList.remove('flip');
        secondCardElement.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, firstCardElement, secondCardElement, lockBoard] = ['', '', null, null, false];
}

document.getElementById('restart').addEventListener('click', resetGame);

initializeGame();
