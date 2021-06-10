var game;
document.addEventListener("DOMContentLoaded", function(event) {
  // Get the game canvas
  const gameDiv = document.getElementById('gameWrapper');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext("2d");
  // Make the canvas fill the viewport
  ctx.canvas.width = gameDiv.clientWidth;
  ctx.canvas.height = gameDiv.clientHeight;
  // Instantiate the game object
  game = new Game();
});