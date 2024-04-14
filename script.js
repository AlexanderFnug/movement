window.addEventListener('load', start());

function start() {
  console.log('javascript loaded')

  requestAnimationFrame(tick);
}

/* MODEL */
const model = {
    x: 0,
    y: 0,
}

function displayPlayerAtPosition() {
   const visualPlayer = document.querySelector('#player');
   visualPlayer.style.translate = `${player.x}px, ${player.y}px`;
}

function tick() {
  requestAnimationFrame(tick);

  displayPlayerAtPosition();
}