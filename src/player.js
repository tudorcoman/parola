/* Player - jucatorul cu care interactionam */
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
  this.interactableNear = null;
  this.lastKey = null;
};

Player.extend(Actor);

Player.prototype.act = function () {
  Game.engine.lock(); // Asteapta sa se intample ceva
  window.addEventListener("keydown", this);
  window.addEventListener("click", this);
  if(this.destructible.hp > 0) {
    this.ai.update(this);
    //if(this.hasMoved)
      Game.update();
    Game.render();
  } else {
    Game.gameOver();
  }
  return true;
};

Player.prototype.handleEvent = function (e) {
  if(e.type == "keydown") {
    this.lastKey = e.keyCode;
    window.removeEventListener("keydown", this);
  } else if(e.type == "click") {
    this.handleClick(e);
    window.removeEventListener("click", this);
  }
  Game.engine.unlock();
};

Player.prototype.handleClick = function (e) {
  var coords = Game.display.eventToPosition(e);
  var x = coords[0];
  var y = coords[1];
  
  var pickable;
  var i = 0;
  while(i < Game.map.actors.length && ((Game.map.actors[i].x != x && Game.map.actors[i].y != y) || Game.map.actors[i].pickable == null))
    i++;
  if(i < Game.map.actors.length) {
    pickable = Game.map.actors[i];
    pickable.pickable.pick(pickable, Game.player);
  }
}

Player.prototype.computeFOV = function() {
  var FOVCallback = function(x, y) {
    var index = x + "," + y;
    return (Game.map.isWallkable(x, y));
    return (Game.map.isWallkable(x, y));
  };

  var FOVRenderer = new ROT.FOV.RecursiveShadowcasting(FOVCallback);
  var exploredTiles = this.exploredTiles;
  this.tilesInFOV = [];
  var tilesInFOV = this.tilesInFOV;
  this.isInFOV = [];
  var isInFOV = this.tilesInFOV;
  FOVRenderer.compute(this.x, this.y, 5, function(x, y, r, visibility) {
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
  //console.log(i);
  var coords = freeCells[i].split(",");
  var x = parseInt(coords[0]);
  var y = parseInt(coords[1]);
  Game.player = new Player(x, y, '@', "player", true, "white", Constants.GROUND_COLOR);
  Game.player.destructible = new Destructible(30, 2, "jucator lesinat", "%", "black", "white");
  Game.player.attacker = new Attacker(5);
  Game.player.ai = new PlayerAi();
  Game.player.container = new Container(26);
  Game.map.actors.push(Game.player);
};
