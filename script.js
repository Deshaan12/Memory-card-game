const gameBoard = document.getElementById("game-board");
const resultMessage = document.getElementById("result-message");
const shuffleButton = document.getElementById("shuffle-btn");
const timerDisplay = document.getElementById("timer");

let cards = [
  "pokemon photos/Jigglypuff pokemon.png", "pokemon photos/Jigglypuff pokemon.png",
  "pokemon photos/Mew pokemon.png", "pokemon photos/Mew pokemon.png",
  "pokemon photos/Mewtwo pokemon.webp", "pokemon photos/Mewtwo pokemon.webp",
  "pokemon photos/Psyduck pokemon.png", "pokemon photos/Psyduck pokemon.png",
  "pokemon photos/Rowlet pokemon.webp", "pokemon photos/Rowlet pokemon.webp",
  "pokemon photos/Snorlax pokemon.webp", "pokemon photos/Snorlax pokemon.webp",
  "pokemon photos/squirtle.png", "pokemon photos/squirtle.png"
];

let flippedCards = [];
let matchedCards = [];
let timeLeft = 60; // Timer starts at 60 seconds
let timer;
let gameStarted = false;

// Shuffle Cards Function (Random Order)
function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

// Create a Card Element
function createCard(cardValue) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.value = cardValue;

  const img = document.createElement("img");
  img.src = cardValue;
  img.alt = "Card image";
  img.style.display = "none"; // Hide image initially
  card.appendChild(img);

  card.addEventListener("click", flipCard);
  return card;
}

// Flip Card Function
function flipCard(event) {
  if (!gameStarted) startTimer(); // Start timer when the first card is clicked

  const card = event.target;
  if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
    card.classList.add("flipped");
    card.querySelector("img").style.display = "block"; // Show image when flipped
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 500);
    }
  }
}

// Check for a Match
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCards.push(firstCard, secondCard);
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.querySelector("img").style.display = "none"; // Hide image again
      secondCard.querySelector("img").style.display = "none";
    }, 1000);
  }

  flippedCards = [];

  // Win Condition - All Cards Matched
  if (matchedCards.length === cards.length) {
    setTimeout(() => {
      resultMessage.textContent = "🎉 You won!";
      stopTimer();
    }, 500);
  }
}

// Start Countdown Timer
function startTimer() {
  if (!gameStarted) {
    gameStarted = true;
    timeLeft = 60; // Reset timer to 60 seconds
    updateTimerDisplay(); // Show initial time

    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();

      if (timeLeft <= 0) {
        clearInterval(timer);
        resultMessage.textContent = "⏳ Time's up! You lost! Try again.";
        disableGame(); // Stop the game when time runs out
      }
    }, 1000);
  }
}

// Update Timer Display
function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `Time Left: ${minutes}:${seconds}`;
}

// Stop Timer
function stopTimer() {
  clearInterval(timer);
  gameStarted = false;
}

// Disable Game When Time Runs Out
function disableGame() {
  document.querySelectorAll(".card").forEach(card => {
    card.removeEventListener("click", flipCard); // Disable flipping
  });
}

// Initialize the Game
function initializeGame() {
  gameBoard.innerHTML = ''; // Clear the board
  shuffleCards();
  matchedCards = [];
  flippedCards = [];
  gameStarted = false;
  stopTimer();
  timeLeft = 60; // Reset timer
  updateTimerDisplay();

  cards.forEach(cardValue => {
    const card = createCard(cardValue);
    gameBoard.appendChild(card);
  });

  resultMessage.textContent = ''; // Clear result message
}

// Reset the Game When Shuffle Button is Clicked
shuffleButton.addEventListener("click", initializeGame);

// Initialize the game at the start
initializeGame();
