// Initializes the game after the window loads
window.addEventListener("load", start);

function start() {
  console.log("JavaScript loaded");
  requestAnimationFrame(tick);
  window.addEventListener("keydown", handleKey);
  window.addEventListener("keyup", handleKey);
}

// Player and control state
const player = { x: 0, y: 0, speed: 100 };
const controls = { up: false, down: false, left: false, right: false };

const gamefieldDimensions = {
    width: 512, // Width in pixels (16 * 32px from your CSS)
    height: 372 // Height in pixels (12 * 32px from your CSS)
};


function handleKey(event) {
    const isDown = event.type === "keydown";
    const playerElement = document.getElementById('player');

    // Determine which direction to animate based on the key press
    switch (event.key) {
        case 'ArrowUp':
            controls.up = isDown;
            updateAnimation(playerElement, 'up', isDown);
            break;
        case 'ArrowDown':
            controls.down = isDown;
            updateAnimation(playerElement, 'down', isDown);
            break;
        case 'ArrowLeft':
            controls.left = isDown;
            updateAnimation(playerElement, 'left', isDown);
            break;
        case 'ArrowRight':
            controls.right = isDown;
            updateAnimation(playerElement, 'right', isDown);
            break;
    }

    if (isDown) movePlayer(0); // Only call movePlayer if a key is pressed down
}

// This function updates the class list for animation based on direction and whether the key is pressed or released
function updateAnimation(element, direction, isActive) {
    if (isActive) {
        element.classList.add('animate', direction);
    } else {
        element.classList.remove('animate', direction);
    }
}



function movePlayer(deltaTime) {
    const potentialX = player.x + (controls.right - controls.left) * player.speed * deltaTime;
    const potentialY = player.y + (controls.down - controls.up) * player.speed * deltaTime;

    // Check boundaries before updating player's position
    if (potentialX >= 0 && potentialX <= gamefieldDimensions.width - 48) { // 48 is the player width
        player.x = potentialX;
    }
    if (potentialY >= 0 && potentialY <= gamefieldDimensions.height - 48) { // 48 is the player height
        player.y = potentialY;
    }
}


let lastTimestamp = 0;
// Periodically update the player's display position
function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp )/ 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);

  displayPlayerAtPosition();
}

// Updates the player's position in the DOM
function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.transform = `translate(${player.x}px, ${player.y}px)`;
}
