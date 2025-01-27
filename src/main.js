
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Game variables
let player = { x: 100, y: 300, width: 20, height: 20, dy: 0, jumpCount: 0, isJumping: false };
let platforms = [];
let score = 0;
let isGameOver = false;

// Constants
const gravity = 0.5;
const jumpPower = -10;
const platformSpeed = 3;
const platformWidth = 80;

// DOM elements
const gameOverDiv = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// Initialize platforms
function generatePlatforms() {
  platforms = [];
  let x = 0;
  while (x < canvas.width) {
    const hasGap = Math.random() < 0.3; // 30% chance of a gap
    if (hasGap) {
      x += Math.random() * 100 + 50; // Random gap width
    } else {
      const platformWidth = Math.random() * 50 + 80; // Random platform width
      platforms.push({ x, y: 350, width: platformWidth, height: 10 });
      x += platformWidth + Math.random() * 100;
    }
  }
  console.log('Generated platforms:', platforms);
}

// Reset game
function resetGame() {
  console.log('Game reset');
  player.y = 300;
  player.dy = 0;
  player.jumpCount = 0;
  isGameOver = false;
  score = 0;
  generatePlatforms();
  gameOverDiv.style.display = 'none';
  loop();
}

// Jump logic
function jump() {
  if (player.jumpCount < 4) {
    console.log('Jump executed, jump count:', player.jumpCount + 1);
    player.dy = jumpPower;
    player.jumpCount++;
    player.isJumping = true;
  } else {
    console.log('Jump ignored, jump count limit reached');
  }
}

// Game loop
function loop() {
  if (isGameOver) return;

  try {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update score
    score++;
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Distance: ${score}`, canvas.width - 150, 30);

    // Player physics
    player.y += player.dy;
    player.dy += gravity;

    if (player.y + player.height > canvas.height) {
      console.error('Player fell out of bounds');
      isGameOver = true;
      finalScore.textContent = `Your Score: ${score}`;
      gameOverDiv.style.display = 'block';
      return;
    }

    // Platform logic
    platforms.forEach((platform, index) => {
      platform.x -= platformSpeed;

      // Recycle platforms
      if (platform.x + platform.width < 0) {
        console.log('Platform recycled:', platform);
        platforms.splice(index, 1);
        const newPlatformWidth = Math.random() * 50 + 80;
        platforms.push({
          x: canvas.width + Math.random() * 50,
          y: 350,
          width: newPlatformWidth,
          height: 10,
        });
      }

      // Collision detection
      if (
        player.y + player.height <= platform.y &&
        player.y + player.height + player.dy >= platform.y &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width
      ) {
        console.log('Collision detected with platform:', platform);
        player.dy = 0;
        player.jumpCount = 0;
        player.y = platform.y - player.height;
        player.isJumping = false;
      }

      // Draw platform
      ctx.fillStyle = 'green';
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Request next frame
    requestAnimationFrame(loop);
  } catch (error) {
    console.error('Error in game loop:', error);
  }
}

// Key event listeners
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

// Restart button listener
restartButton.addEventListener('click', resetGame);

// Start game
resetGame();