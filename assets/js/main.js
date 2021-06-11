var game = null;
document.addEventListener("DOMContentLoaded", function(event) {
  // Get the game canvas
  const canvas = document.getElementById('gameCanvas');
  // Instantiate the game object
  game = new Game(canvas);
});
