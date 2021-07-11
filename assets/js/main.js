
import { Game } from './modules/game.js';

document.addEventListener("DOMContentLoaded", function(event) {
  // Get the game canvas
  const canvas = document.getElementById('gameCanvas');
  // Instantiate the game object
  let game = new Game(canvas);
});
