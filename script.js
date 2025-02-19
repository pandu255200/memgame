const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreElement = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

let score = 0;
let isJumping = false;
let gameInterval;
let gameStarted = false;
let obstaclePassed = false;

function jump() {
  if (!gameStarted || isJumping) return;

  isJumping = true;
  let jumpHeight = 0;

  const upInterval = setInterval(() => {
    if (jumpHeight >= 150) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        jumpHeight -= 5;
        player.style.bottom = 50 + jumpHeight + "px";
      }, 20);
    }
    jumpHeight += 5;
    player.style.bottom = 50 + jumpHeight + "px";
  }, 20);
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.left < obstacleRect.right &&
    playerRect.right > obstacleRect.left &&
    playerRect.bottom > obstacleRect.top
  ) {
    alert("Game Over! Your score: " + score);
    stopGame();
  }

  // Score increases when the obstacle completely passes the player
  if (obstacleRect.right < playerRect.left && !obstaclePassed) {
    score++;
    scoreElement.textContent = "Score: " + score;
    obstaclePassed = true;
  }

  // Reset obstaclePassed when the obstacle moves back to the right
  if (obstacleRect.right >= 800) {  // Match with CSS animation range
    obstaclePassed = false;
  }
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  score = 0;
  scoreElement.textContent = "Score: " + score;
  obstacle.style.display = "block";

  // Hide start button when game starts
  startBtn.style.display = "none";

  // Adjust obstacle speed based on screen size
  if (window.innerWidth < 600) {
    obstacle.style.animation = "moveObstacle 4s linear infinite"; // Slower for mobile
  } else {
    obstacle.style.animation = "moveObstacle 2s linear infinite"; // Normal speed for desktop
  }

  obstaclePassed = false;
  gameInterval = setInterval(() => {
    checkCollision();
  }, 100);
}

function stopGame() {
  gameStarted = false;
  clearInterval(gameInterval);
  obstacle.style.animation = "none";
  obstacle.style.display = "none"; // Hide obstacle after game over

  // Show start button again after game over
  startBtn.style.display = "block";
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    jump();
  }
});

startBtn.addEventListener("click", startGame);
