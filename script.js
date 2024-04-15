// Initializes the game after the window loads
window.addEventListener("load", start);

function start() {
  console.log("JavaScript loaded");
  requestAnimationFrame(tick);
  window.addEventListener("keydown", handleKey);
  window.addEventListener("keyup", handleKey);
  createTiles();
  display();
  
}

// Player and control state
const player = { x: 0, y: 0, speed: 100, regX: 0, regY: 10 };
const controls = { up: false, down: false, left: false, right: false };
const tiles = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0],
  [0, 0, 3, 0, 3, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 2, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 3, 0, 0, 2, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 3, 0, 2, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 3, 0, 3, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0],
];

const GRID_WIDTH = tiles[0].length;
const GRID_HEIGHT = tiles.length;
const TILE_SIZE = 64;

function getTilesAtCoord({ row, col }) {
  return tiles[row][col];
}

function coordFromPosition(x, y) {
  return {
    row: Math.floor(y / TILE_SIZE),
    col: Math.floor(x / TILE_SIZE),
  };
}

function positionFromCoord({ row, col }) {
  return {
    x: col * TILE_SIZE,
    y: row * TILE_SIZE,
  };
}

const gamefieldDimensions = {
  // Width in pixels (16 * 64px from your CSS)
  width: 1024,
  // Height in pixels (12 * 46px from your CSS)
  height: 552,
};

function handleKey(event) {
  const isDown = event.type === "keydown";
  const playerElement = document.getElementById("player");

  // Determine which direction to animate based on the key press
  switch (event.key) {
    case "ArrowUp":
      controls.up = isDown;
      updateAnimation(playerElement, "up", isDown);
      break;
    case "ArrowDown":
      controls.down = isDown;
      updateAnimation(playerElement, "down", isDown);
      break;
    case "ArrowLeft":
      controls.left = isDown;
      updateAnimation(playerElement, "left", isDown);
      break;
    case "ArrowRight":
      controls.right = isDown;
      updateAnimation(playerElement, "right", isDown);
      break;
  }

  if (isDown) movePlayer(0); // Only call movePlayer if a key is pressed down
}

// This function updates the class list for animation based on direction and whether the key is pressed or released
function updateAnimation(element, direction, isActive) {
  if (isActive) {
    element.classList.add("animate", direction);
  } else {
    element.classList.remove("animate", direction);
  }
}

function movePlayer(deltaTime) {
    const potentialX = player.x + (controls.right - controls.left) * player.speed * deltaTime;
    const potentialY = player.y + (controls.down - controls.up) * player.speed * deltaTime;
  
    if (!checkCollision(potentialX, player.y)) {
      player.x = potentialX;
    }
    if (!checkCollision(player.x, potentialY)) {
      player.y = potentialY;
    }
  }
  
  

  function checkCollision(x, y) {
    // Check multiple points on the player's bounding box
    const topLeft = coordFromPosition(x, y);
    const topRight = coordFromPosition(x + 47, y); // assuming player width slightly less than TILE_SIZE
    const bottomLeft = coordFromPosition(x, y + 47); // assuming player height slightly less than TILE_SIZE
    const bottomRight = coordFromPosition(x + 47, y + 47);
  
    // Check if any of these points are in forbidden tiles
    return isForbiddenTile(topLeft) || isForbiddenTile(topRight) || 
           isForbiddenTile(bottomLeft) || isForbiddenTile(bottomRight);
  }
  
  function isForbiddenTile(coord) {
    const tile = getTilesAtCoord(coord);
    return tile === 1 || tile === 2 || tile === 3; // Forbidden tiles
  }
  

let lastTimestamp = 0;
// Periodically update the player's display position
function tick(timestamp) {
  requestAnimationFrame(tick);
  showDebugging();
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);

  displayPlayerAtPosition();
}

// Updates the player's position in the DOM
function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.transform = `translate(${player.x-player.regX}px, ${player.y-player.regY}px)`;
}

/* VIEW */

//#Region VIEW

function createTiles() {
  const background = document.querySelector("#background");

  // scan through rows and columns
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      background.appendChild(tile);
    }
  }
  background.style.setProperty("--grid-width", GRID_WIDTH);
  background.style.setProperty("--grid-height", GRID_HEIGHT);
  background.style.setProperty("--tile-size", TILE_SIZE + "px");
}

function display() {
  const visualTiles = document.querySelectorAll(".tile");

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const modelTile = getTilesAtCoord({ row, col });
      const visualTile = visualTiles[row * GRID_WIDTH + col];

      visualTile.classList.add(getClassForTile(modelTile));
    }
  }
}

function getClassForTile(tile) {
  switch (tile) {
    case 0:
      return "grass";
    case 1:
      return "water";
    case 2:
      return "redwall";
    case 3:
      return "tree";
    case 4:
      return "path";
  }
}

//#EndRegion VIEW

//#Region Debugging

function showDebugging() {
  showDebugTileUnderPlayer();
  showDebugPlayerRegPoint();
}

let lastPlayerPosition = { row: 0, col: 0 };

function showDebugTileUnderPlayer() {
  const coord = coordFromPosition(player.x, player.y);
  if (
    coord.row !== lastPlayerPosition.row ||
    coord.col !== lastPlayerPosition.col
  ) {
    unHighlightTile(lastPlayerPosition);
    highlightTile(coord);
  }
  lastPlayerPosition = coord;
}
// highlight tile around player
function highlightTile(coord) {
  const visualTiles = document.querySelectorAll(".tile");
  const visualTile = visualTiles[coord.row * GRID_WIDTH + coord.col];
  visualTile.classList.add("highlight");
}

function unHighlightTile(coord) {
    const visualTiles = document.querySelectorAll(".tile");
    const visualTile = visualTiles[coord.row * GRID_WIDTH + coord.col];
    visualTile.classList.remove("highlight");

}

function showDebugPlayerRegPoint() {
    const visualPlayer = document.querySelector("#player");
    if(!visualPlayer.classList.contains("show-reg-point")) {
        visualPlayer.classList.add("show-reg-point");
    }
    visualPlayer.style.setProperty("--reg-x", player.regX + "px");
    visualPlayer.style.setProperty("--reg-y", player.regY + "px");

}
//#EndRegion Debugging
