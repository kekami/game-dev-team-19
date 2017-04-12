(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

// Initialize canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Load Mario sprite
var marioSprite = new Image();
marioSprite.src = 'assets/img/mario.png';

// Create player object
var player = {
  width : 48,
  height : 64,
  posX : 20,
  posY : 350,
  velX: 0,
  velY: 0,
  speed: 4,
  jumping: false
};

// Array for storing keys being pressed down
var keys = [];

// World variables
var friction = 0.8;
var gravity = 0.35;
var groundHeight = 50;

// Game loop
function main(){
  // Register keypresses
  handleInput();

  // Update player object
  handlePlayerMovement();

  // Redraw the updated canvas
  reDrawCanvas();
 
  // Restarts the Game loop
  requestAnimationFrame(main);
}

function handleInput() {
  if (keys[38]) {
  // Up arrow key
    // Prevent jumping when in the air
    if (!player.jumping){
     player.jumping = true;
     player.velY = -player.speed * 2;
    }
  }
  
  if (keys[39]) {
    // Right arrow key
    player.velX = player.speed;
  } 

  if (keys[37]) { 
  // Left arrow key
    player.velX = -player.speed;
  }
}

function handlePlayerMovement() {
  // Smoother player movement
  player.velX *= friction;

  // Add gravity to player
  player.velY += gravity;
 
  // Update position of player from player velocity
  player.posX += player.velX;
  player.posY += player.velY;
 
  // Detect wall collision
  if (player.posX >= c.width-player.width) {
    player.posX = c.width-player.width;
  } else if (player.posX <= 0) { 
    player.posX = 0; 
  }    
  
  // Detect ground collision
  if (player.posY >= c.height-player.height-groundHeight) {
    player.posY = c.height - player.height-groundHeight;
    player.jumping = false;
  }
}

function reDrawCanvas() {
  // Clear canvas
  ctx.clearRect(0,0,c.width,c.height);

  // Draw sky
  ctx.fillStyle = "#00f";
  ctx.fillRect(0, 0, c.width, c.height);

  // Draw ground
  ctx.fillStyle = 'green';
  ctx.fillRect(0, c.height-groundHeight, c.width, c.height);

  // Draw player
  ctx.drawImage(marioSprite, player.posX, player.posY, player.width, player.height);
}
 
// Event listeners
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});
 
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});
 
window.addEventListener("load",function(){
  main();
});