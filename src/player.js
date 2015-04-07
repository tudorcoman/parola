var Player = function(x, y, ch, name, blocks, fg, bg) {
  Actor.call(this, x, y, ch, name, blocks, fg, bg);
};

Player.prototype = Object.create(Actor.prototype);

Player.prototype.act = function() {
  console.log("aici");
  Game.engine.lock(); // Asteapta sa se intample ceva
  window.addEventListener("keydown", this);
  Game.render();
};

Player.prototype.handleEvent = function(e) {
  var key = e.keyCode;
  var dx = 0;
  var dy = 0;
  switch(key) {
    case ROT.VK_UP: dy = -1; break;
    case ROT.VK_DOWN: dy = +1; break;
    case ROT.VK_LEFT: dx = -1; break;
    case ROT.VK_RIGHT: dx = +1; break;
  }
  var newX = this.x + dx;
  var newY = this.y + dy;
  
  if(Game.map.isWallkable(newX, newY)) {
    this.x = newX;
    this.y = newY;
  }
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
};

function createPlayer(freeCells) {
  var i = Math.floor(ROT.RNG.getUniform() * freeCells.length);
  console.log(i);
  var coords = freeCells[i].split(",");
  var x = parseInt(coords[0]);
  var y = parseInt(coords[1]);
  Game.player = new Player(x, y, '@', "player", true, "white", Constants.GROUND_COLOR);
  Game.actors.push(Game.player);
};