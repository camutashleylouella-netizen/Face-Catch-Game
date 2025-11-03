const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
const gameOverPopup = document.getElementById("gameOverPopup");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.75;

let score = 0;
let lives = 3;
let gameRunning = false;
let eggs = [];
let catcherX = canvas.width / 2;
let catcherY = canvas.height - 140;
let catcherWidth = 180;
let catcherHeight = 55;
let fallSpeed = 4;
let eggInterval;
let moveLeft = false;
let moveRight = false;
let musicOn = true;

// Load face images (eggrupts)
const faces = [];
for (let i = 1; i <= 5; i++) {
  const img = new Image();
  img.src = `procto${i}.png`;
  faces.push(img);
}

// Music toggle
musicBtn.addEventListener("click", () => {
  if (musicOn) {
    bgMusic.pause();
    musicBtn.textContent = "🔇 Music OFF";
  } else {
    bgMusic.play();
    musicBtn.textContent = "🎵 Music ON";
  }
  musicOn = !musicOn;
});

// Start Game
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  gameOverPopup.style.display = "none";
  startGame();
});

function startGame() {
  overlay.style.display = "none";
  gameOverPopup.style.display = "none";
  score = 0;
  lives = 3;
  eggs = [];
  gameRunning = true;
  bgMusic.currentTime = 0;
  if (musicOn) bgMusic.play();
  scoreText.textContent = "Score: " + score;
  livesText.textContent = "Lives: " + lives;
  spawnEgg();
  eggInterval = setInterval(spawnEgg, 1500);
  update();
}

// Spawn Egg (Face)
function spawnEgg() {
  if (!gameRunning) return;
  const img = faces[Math.floor(Math.random() * faces.length)];
  const x = Math.random() * (canvas.width - 120);
  eggs.push({ x, y: -100, img });
}

// Catcher movement
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// Touch controls for mobile phones (tap tap)
canvas.addEventListener("touchstart", (e) => {
  const touchX = e.touches[0].clientX;
  if (touchX < canvas.width / 2) moveLeft = true;
  else moveRight = true;
});
canvas.addEventListener("touchend", () => {
  moveLeft = moveRight = false;
});

// Game Loop
function update() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ground
  ctx.fillStyle = "#6fcf97";
  ctx.fillRect(0, canvas.height - 90, canvas.width, 90);

  // move catcher
  if (moveLeft) catcherX -= 7;
  if (moveRight) catcherX += 7;
  catcherX = Math.max(0, Math.min(catcherX, canvas.width - catcherWidth));

  // draw catcher
  ctx.fillStyle = "#03045e";
  ctx.beginPath();
  ctx.ellipse(
    catcherX + catcherWidth / 2,
    catcherY + 25,
    catcherWidth / 2,
    30,
    0,
    0,
    Math.PI
  );
  ctx.fill();

  // move + draw eggs
  eggs.forEach((egg, index) => {
    egg.y += fallSpeed;
    ctx.drawImage(egg.img, egg.x, egg.y, 120, 140); // 😄 BIGGER FACE IMAGE

    // check catch
    if (
      egg.y + 140 >= catcherY &&
      egg.x + 60 >= catcherX &&
      egg.x + 60 <= catcherX + catcherWidth
    ) {
      eggs.splice(index, 1);
      score += 10;
      scoreText.textContent = "Score: " + score;
    }

    // missed egg
    if (egg.y > canvas.height) {
      eggs.splice(index, 1);
      lives--;
      livesText.textContent = "Lives: " + lives;
      if (lives <= 0) endGame();
    }
  });

  requestAnimationFrame(update);
}

// End of the Game
function endGame() {
  gameRunning = false;
  clearInterval(eggInterval);
  bgMusic.pause();
  bgMusic.currentTime = 0;
  finalScore.textContent = `Your Score: ${score}`;
  gameOverPopup.style.display = "flex";
}