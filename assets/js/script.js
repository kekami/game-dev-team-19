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

// Load Goomba sprite
var enemySprite = new Image();
enemySprite.src = 'https://media1.giphy.com/media/HczKUqh2qtA2Y/giphy.gif';

// Create player object
var player = {
  width : 48,
  height : 64,
  x : 20,
  y : 350,
  velX: 0,
  velY: 0,
  speed: 4,
  jumping: false,
  alive: true,
  grounded: false
};

// Create enemy object
var enemy = {
  width : 64,
  height : 64,
  x : 600,
  y : 350,
  velX: 3,
  velY: 0,
  speed: 3,
  jumping: false,
  alive: true
};

// Array for storing keys being pressed down
var keys = [];

// Array for storing the ledges
var ledges = [
  {
    x: 100,
    y: 350,
    width: 80,
    height: 20

  }, {
    x: 200,
    y: 300,
    width: 80,
    height: 20
  }, {
    x: 300,
    y: 250,
    width: 80,
    height: 20
  }, {
    x: 400,
    y: 250,
    width: 80,
    height: 20
  }, {
    x: 500,
    y: 300,
    width: 80,
    height: 20
  }, {
    x: 600,
    y: 350,
    width: 80,
    height: 20
  }
];
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

  // Update Goomba object
  handleEnemyMovement()

  // Detect collisions with ledges and enemies
  colDetect();

  // Redraw the updated canvas
  reDrawCanvas();
 
  // Check if player is alive
  checkGameStatus()
}

function handleInput() {
  if (keys[38]) {
  // Up arrow key
    // Prevent jumping when in the air
    if (!player.jumping){
        player.jumping = true;
        player.velY = -player.speed * 2.2;
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
  player.x += player.velX;
  player.y += player.velY;
 
  // Detect wall collision
  if (player.x >= c.width-player.width) {
    player.x = c.width-player.width;
  } else if (player.x <= 0) {
    player.x = 0;
  } 

  // Detect ground collision
  if (player.y >= c.height-player.height-groundHeight) {
    player.y = c.height - player.height-groundHeight;
    player.jumping = false;
  }
}

function handleEnemyMovement() {
  // Add gravity to player
  enemy.velY += gravity;

  // Make the enemy randomly jump
  if (!enemy.jumping){
    if (Math.random() > 0.99) {
      enemy.jumping = true;
      enemy.velY = -enemy.speed * 3;
    }
  }

  // Update position of enemy from enemy velocity
  enemy.x += enemy.velX;
  enemy.y += enemy.velY;
 
  // Detect wall collision
  if (enemy.x >= c.width-enemy.width) {
    enemy.velX = -enemy.speed;
  } else if (enemy.x <= 0) {
    enemy.velX = enemy.speed;
  } 

  // Detect ground collision
  if (enemy.y >= c.height-enemy.height-groundHeight) {
    if (enemy.alive) {
      enemy.y = c.height - enemy.height-groundHeight;
      enemy.jumping = false;
    }
  }
}

function colDetect() {
  player.grounded = false;
  for (var i = 0; i < ledges.length; i++) {
    ctx.rect(ledges[i].x, ledges[i].y, ledges[i].width, ledges[i].height);
   
    var colLedges = colCheck(player, ledges[i]);
 
    if (colLedges === "l" || colLedges === "r") {
      player.velX = 0;
      player.jumping = true;
    } else if (colLedges === "b") {
      player.grounded = true;
      player.jumping = false;
    } else if (colLedges === "t") {
      player.velY *= -1;
    }
  }

  var colEnemy = colCheck(player, enemy)

  if (colEnemy == 'b' && enemy.alive) {
    enemy.velY = -3
    enemy.alive = false
  } else if ((colEnemy === "t" || colEnemy === "l" || colEnemy === "r") && enemy.alive) {
    player.alive = false
  }
 
  if(player.grounded){
    player.velY = 0;
  }

  enemy.grounded = false;
  for (var i = 0; i < ledges.length; i++) {
    ctx.rect(ledges[i].x, ledges[i].y, ledges[i].width, ledges[i].height);
   
    var colEnemyLedges = colCheck(enemy, ledges[i]);
 
    if (colEnemyLedges === "l" ||colEnemyLedges === "r") {
      enemy.jumping = true;
    } else if (colEnemyLedges === "b") {
      enemy.grounded = true;
      enemy.jumping = false;
    } else if (colEnemyLedges === "t") {
      enemy.velY *= -1;
    }
  }

  if(enemy.grounded){
    enemy.velY = 0;
  }
}

function reDrawCanvas() {
  // Clear canvas
  ctx.clearRect(0,0,c.width,c.height);

  // Draw sky
  var grd=ctx.createRadialGradient(400,500,40,400,500,300);
  grd.addColorStop(0,"#934f44");
  grd.addColorStop(1,"#091b41");
  ctx.fillStyle = grd
  ctx.fillRect(0, 0, c.width, c.height);

  // Draw ground
  ctx.fillStyle = '#1b5e20';
  ctx.fillRect(0, c.height-groundHeight, c.width, c.height);

  ctx.fillStyle = "#4e342e";
  ctx.beginPath();
 
  for (var i = 0; i < ledges.length; i++) {
    ctx.rect(ledges[i].x, ledges[i].y, ledges[i].width, ledges[i].height);
  }

  ctx.fill();

  // Draw player
  ctx.drawImage(marioSprite, player.x, player.y, player.width, player.height);
  ctx.drawImage(enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);
}

function checkGameStatus() {
  // Check if player is alive
  if (player.alive) {
    // Restarts the Game loop
    requestAnimationFrame(main);
  } else {
    // Print Game Over
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER",c.width/2,c.height/2);
  }
}

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
    vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
    // add the half widths and half heights of the objects
    hWidths = (shapeA.width / 2) + (shapeB.width / 2),
    hHeights = (shapeA.height / 2) + (shapeB.height / 2),
    colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var oX = hWidths - Math.abs(vX),
        oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
        if (vY > 0) {
          colDir = "t";
          shapeA.y += oY;
        } else {
          colDir = "b";
          shapeA.y -= oY;
        }
      } else {
        if (vX > 0) {
          colDir = "l";
          shapeA.x += oX;
        } else {
          colDir = "r";
          shapeA.x -= oX;
        }
      }
    }
    return colDir;
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
