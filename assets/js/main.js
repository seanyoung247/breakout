var game;
document.addEventListener("DOMContentLoaded", function(event) {
  // Get the game canvas
  const gameDiv = document.getElementById('gameWrapper');
  const canvas = document.getElementById('gameCanvas');
  // Make the canvas fill the viewport
  canvas.width = gameDiv.clientWidth;
  canvas.height = gameDiv.clientHeight;
  // Instantiate the game object
  game = new Game(canvas, gameDiv);
});
