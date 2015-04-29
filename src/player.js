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
};

Player.prototype = Object.create(Actor.prototype);

Player.prototype.updateAi = function () {
  Game.engine.lock(); // Asteapta sa se intample ceva
  window.addEventListener("keydown", this);
  Game.render();
};

Player.prototype.act = function () {
  this.ai.update();
};

Player.prototype.handleEvent = function (e) {
  var movementKeyMap = [];
  movementKeyMap[ROT.VK_UP] = 0;
  movementKeyMap[ROT.VK_PAGE_UP] = 1;
  movementKeyMap[ROT.VK_RIGHT] = 2;
  movementKeyMap[ROT.VK_PAGE_DOWN] = 3;
  movementKeyMap[ROT.VK_DOWN] = 4;
  movementKeyMap[ROT.VK_END] = 5;
  movementKeyMap[ROT.VK_LEFT] = 6;
  movementKeyMap[ROT.VK_HOME] = 7;
  var key = e.keyCode;

  if(key in movementKeyMap) {
    this.direction = movementKeyMap[key];
    var coords = ROT.DIRS[8][movementKeyMap[key]];
    var newX = this.x + coords[0];
    var newY = this.y + coords[1];
    var intX, intY;

    if(Game.map.isWallkable(newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.hasMoved = true;
      for(actor in Game.map.actors) {
        if(Game.map.isInFOV(actor.x, actor.y) && actor.ai)
          actor.ai.update();
      }
    } else {
      this.hasMoved = false;
    }
    intX = this.x + coords[0];
    intY = this.y + coords[1];
    var interactable = Game.map.actorAt(intX, intY);
    if(interactable && interactable.interactable) {
      Game.gui.message("Apasa \"E\" pentru a " + interactable.interactable.onInteractText + " "  + interactable.name + ".");
      this.interactableNear = interactable.interactable;
    } else {
      this.interactableNear = null;
    }
  } else {
    var letter = String.fromCharCode(key);
    switch(letter) {
      case 'E':
        if(this.interactableNear)
          this.interactableNear.interact();
        break;
    }
  }
  window.removeEventListener("keydown", this);
  Game.engine.unlock();
};

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
  //console.log(i);
  var coords = freeCells[i].split(",");
  var x = parseInt(coords[0]);
  var y = parseInt(coords[1]);
  Game.player = new Player(x, y, '@', "player", true, "white", Constants.GROUND_COLOR);
  Game.player.destructible = new Destructible(20, 3, "jucator lesinat", "%", "black", "white");
  Game.player.attacker = new Attacker(3);
  Game.player.ai = new Ai(Game.player.updateAi.bind(Game.player), Game.player);
  Game.map.actors.push(Game.player);
};
