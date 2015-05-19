/* Map - harta jocului. Hiecare harta tine minte actorii de pe ea */
var Map = function (width, height, type) {
  this.width = width || ROT.DEFAULT_WIDTH;
  this.height = height || ROT.DEFAULT_HEIGHT;
  this.type = type || "digger";
  this.walls = [];
  this.actors = [];
  this.creator = null;
  this.tilesInFOV = [];
};

Map.prototype.buildMap = function() {
  var freeCells = [];
  switch(this.type) {
    case "digger":
      this.creator = new ROT.Map.Digger(this.width, this.height);
  }
  var walls = this.walls;
  var explored = this.explored;
  this.creator.create(function(x, y, wall) {
    walls[x + "," + y] = wall;

    if(!wall)
      freeCells.push(x + "," + y);
  });
  for (i = 0; i < this.creator.getRooms().length; i++) {
    var room = this.creator.getRooms()[i];
    var actors = this.actors;
    var freeRoomCells = [];
    for (x = room.getLeft() + 1; x < room.getRight(); x++) {
      for(y = room.getTop() + 1; y < room.getBottom(); y++)
        freeRoomCells.push(x + "," + y);
    }
    freeRoomCells = this.generateMonsters(freeRoomCells);
    freeCells = freeCells.filter(function (item) {
      return freeRoomCells.indexOf(item) === -1;
    });
    room.getDoors(function (x, y) {
      var door = new Actor(x, y, "+", "%c{#a52a2a}usa%c{}", true, "white", "brown");
      var doorCallback = function () {
        door.ch = '/';
        door.bg = "rgba(0, 0, 0, 0)";
        door.fg = "brown";
        door.blocks = false;
      };
      door.interactable = new Interactable("deschide", doorCallback, null);
      actors.push(door);
    });
  }
  freeCells = this.generateMonsters(freeCells);
  createPlayer(freeCells);
}

Map.prototype.generateMonsters = function (freeCells) {
  var i = 0;
  var j = 0;
  while(j < Constants.MAX_ROOM_MONSTERS && i < freeCells.length) {
    var prob = ROT.RNG.getPercentage();
    var monster = null;
    var x = parseInt(freeCells[i].split(",")[0]);
    var y = parseInt(freeCells[i].split(",")[1]);
    if(prob < 80) {
      monster = new Actor(x, y, 'p', "paznic", true, "blue", null);
      monster.destructible = new Destructible(3, 1, "paznic lesinat", '%', "white", "blue");
      monster.attacker = new Attacker(3);
    } else {
      monster = new Actor(x, y, 'D', "directoare", true, "red", null);
      monster.destructible = new Destructible(5, 1, "directoare lesinate", '%', "red");
      monster.attacker = new Attacker(5);
    }
    monster.ai = new MonsterAi();
    this.actors.push(monster);
    freeCells.splice(i, 1);
    i += 2;
    j ++;
  }
  
  return freeCells;
};

Map.prototype.render = function () {
  Game.player.computeFOV();
  var toRender = [];
  for (x = 0; x < this.width; x++) {
    for (y = 0; y < this.height; y++) {
      if(Game.player.isTileExplored(x, y)) {
        var color = ROT.Color.fromString(this.isWall(x, y) ? Constants.WALL_COLOR : Constants.GROUND_COLOR);
        if(this.isInFOV(x, y))
          color = ROT.Color.multiply(color, ROT.Color.fromString("white"));
        else
          color = ROT.Color.multiply(color, ROT.Color.fromString("grey"));
      } else {
        color = ROT.Color.fromString("#00030c");
      }
      Game.display.draw(x, y, null, null, ROT.Color.toHex(color));
    }
  }
  for (i = 0; i < this.actors.length; i++) {
    var actor = this.actors[i];
    var x = actor.x;
    var y = actor.y;

    var coords = x + "," + y;
    if(this.isInFOV(x, y))
      actor.render();
  }
};

Map.prototype.actorAt = function (x, y) {
  for (i = 0; i < this.actors.length; i++) {
    if(this.actors[i].x == x && this.actors[i].y == y)
      return this.actors[i];
  }
};

Map.prototype.isWall = function (x, y) {
  return this.walls[x + "," + y] == 1 ? true : false;
};

Map.prototype.isWallkable = function (x, y) {
  var blocks = false;
  for(i = 0; i < this.actors.length; i++) {
    var actor = this.actors[i];
    if(actor.x == x && actor.y == y)
      if(actor.blocks == false)
        blocks = false;
      else
        blocks = true;
  }
  if(blocks == false && !this.isWall(x, y))
    return true;
  return false;
};

Map.prototype.isInFOV = function(x, y) {
  if(Game.player.tilesInFOV[x + "," + y])
    return true;
  return false;
};
