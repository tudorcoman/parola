var Player = function (x, y, ch, name, blocks, fg, bg) {
  Actor.call(this, x, y, ch, name, blocks, fg, bg);
  this.direction = 0;
  this.exploredTiles = {};
  for(i = 0; i < Game.map.height; i++) {
    for(j = 0; j < Game.map.width; j++)
      this.exploredTiles[x + "," + y] = false;
  }
  this.tilesInFOV = [];
  this.isInFOV = [];
};

Player.prototype = Object.create(Actor.prototype);

Player.prototype.act = function () {
  Game.engine.lock(); // Asteapta sa se intample ceva
  window.addEventListener("keydown", this);
  Game.render();
};

Player.prototype.handleEvent = function (e) {
  var keyMap = [];
  keyMap[ROT.VK_UP] = 0;
  keyMap[ROT.VK_PAGE_UP] = 1;
  keyMap[ROT.VK_RIGHT] = 2;
  keyMap[ROT.VK_PAGE_DOWN] = 3;
  keyMap[ROT.VK_DOWN] = 4;
  keyMap[ROT.VK_END] = 5;
  keyMap[ROT.VK_LEFT] = 6;
  keyMap[ROT.VK_HOME] = 7;
  var key = e.keyCode;
  
  if(!(key in keyMap))
    return;
  
  this.direction = keyMap[key];
  var coords = ROT.DIRS[8][keyMap[key]];
  var newX = this.x + coords[0];
  var newY = this.y + coords[1];
  
  if(Game.map.isWallkable(newX, newY)) {
    Game.map.actors[this.x + "," + this.y] = undefined;
    Game.map.actors[newX + "," + newY] = this;
    this.x = newX;
    this.y = newY;
    this.hasMoved = true;
  } else {
    this.hasMoved = false;
  }
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
};

Player.prototype.computeFOV = function() {
  var FOVCallback = function(x, y) {
    var index = x + "," + y;
    if(index in Game.map.walls)
      return (Game.map.walls[index] == 0);
    return false;
  };
  
  var FOVRenderer = new ROT.FOV.RecursiveShadowcasting(FOVCallback);
  var exploredTiles = this.exploredTiles;
  this.tilesInFOV = [];
  var tilesInFOV = this.tilesInFOV;
  this.isInFOV = [];
  var isInFOV = this.tilesInFOV;
  FOVRenderer.compute90(this.x, this.y, 5, this.direction, function(x, y, r, visibility) {
    var color = ROT.Color.fromString(Game.map.isWallkable(x, y) ? Constants.WALL_COLOR : Constants.GROUND_COLOR);
    color = ROT.Color.multiply(color, ROT.Color.fromString("white"));
    Game.display.draw(x, y, null, null, ROT.Color.toHex(color));
    exploredTiles[x + "," + y] = true;
    tilesInFOV.push(x + "," + y);
    isInFOV[x + "," + y] = true;
  });
};

Player.prototype.isTileExplored = function(x, y) {
  return this.exploredTiles[x + "," + y];
};


function createPlayer(freeCells) {
  var i = Math.floor(ROT.RNG.getUniform() * freeCells.length);
  console.log(i);
  var coords = freeCells[i].split(",");
  var x = parseInt(coords[0]);
  var y = parseInt(coords[1]);
  Game.player = new Player(x, y, '@', "player", true, "white", Constants.GROUND_COLOR);
  Game.map.actors[x + "," + y] = Game.player;
};