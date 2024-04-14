// Initializes the game after the window loads
window.addEventListener('load', start);

function start() {
  console.log('JavaScript loaded');
  requestAnimationFrame(tick);
  window.addEventListener('keydown', handleKey);
  window.addEventListener('keyup', handleKey);
}

// Player and control state
const player = { x: 0, y: 0 };
const controls = { up: false, down: false, left: false, right: false };

// Handles both key down and key up events
function handleKey(event) {
  const isDown = event.type === 'keydown';
  switch (event.key) {
    case 'ArrowUp': controls.up = isDown; break;
    case 'ArrowDown': controls.down = isDown; break;
    case 'ArrowLeft': controls.left = isDown; break;
    case 'ArrowRight': controls.right = isDown; break;
  }
  if (isDown) movePlayer();
}

// Updates player's position based on active controls
function movePlayer() {
  if (controls.up) player.y -= 10;
  if (controls.down) player.y += 10;
  if (controls.left) player.x -= 10;
  if (controls.right) player.x += 10;
}

// Periodically update the player's display position
function tick() {
  requestAnimationFrame(tick);
  displayPlayerAtPosition();
}

// Updates the player's position in the DOM
function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector('#player');
  visualPlayer.style.transform = `translate(${player.x}px, ${player.y}px)`;
}

