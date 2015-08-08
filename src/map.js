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

Map.prototype.buildMap = function () {
  switch(this.type) {
    case "digger":
      this.creator = new ROT.Map.Digger(this.width, this.height);
      break;
    case "dungeon":
      this.creator = new ROT.Map.Dungeon(this.width, this.height);
      break;
  }
  var map = this;
  var freeCells = [];
  this.creator.create(function(x, y, wall) {
    map.setWall(x, y, wall);

    if(!wall)
      freeCells.push(x + "," + y);
  });
  for (roomI = 0; roomI < this.creator.getRooms().length; roomI++) {
    var room = this.creator.getRooms()[roomI];

    var freeRoomCells = [];
    for (x = room.getLeft() + 1; x < room.getRight(); x++) {
      for (y = room.getTop() + 1; y < room.getBottom(); y++) {
        var coords = x + "," + y;
        freeRoomCells.push(coords);
      }
    }

    var doors = this.generateDoors(room, freeCells);
    var monsters = this.generateMonsters(freeRoomCells);
    var items = this.generatePickables(freeRoomCells);

    var map = this;
    doors.forEach(function (door) { map.actors.push(door); });
    items.forEach(function (item) { map.actors.push(item); });
    monsters.forEach(function (monster) { map.actors.push(monster); });
  }
  var randomIndex = ROT.RNG.getUniformInt(0, freeCells.length);
  var coords = freeCells[randomIndex].split(",");
  var pergx = parseInt(coords[0]);
  var pergy = parseInt(coords[1]);
  console.log(pergx + "," + pergy);
  var pergamentActor = new Actor(pergx, pergy, "=", "pergament", false, "white", null);
  var pergamentItem = new PergamentPickable();
  pergamentActor.pickable = pergamentItem;
  this.actors.push(pergamentActor);
  createPlayer(freeCells);
}

Map.prototype.generateDoors = function (room, freeCells) {
  var doors = [];
  var actors = this.actors;
  var noDoor = 0;
  room.getDoors(function (x, y) {
    noDoor++;
    var doorActor = new Actor(x, y, "+", "%c{#a52a2a}usa%c{}", true, "white", "brown");

    doorActor.interactable = new Door(doorActor);
    var coords = x + "," + y;
    var index = 0;
    while (index < freeCells.length && freeCells[index] != coords)
      index++;
    if (index >= freeCells.length)
      index = -1;
    if (index > -1) { // Daca nu este nici o usa acolo
      doors.push(doorActor);
      freeCells.splice(index, 1);
    }
  });
  return doors;
};

Map.prototype.generatePickables = function (freeRoomCells) {
  var pickables = [];
  var i = 0;
  var j = 0;
  var nrPickables = ROT.RNG.getUniformInt(0, Constants.MAX_ROOM_PICKABLES);
  while (j < nrPickables && i < freeRoomCells.length) {
    var prob = ROT.RNG.getPercentage();
    var pickable = null;
    var x = parseInt(freeRoomCells[i].split(",")[0]);
    var y = parseInt(freeRoomCells[i].split(",")[1]);
    if (prob < 50) {
      pickable = new Actor(x, y, '!', "bautura energizanta", false, "purple", null);
      pickable.pickable = new HealerPickable(10);
      pickables.push(pickable);
      freeRoomCells.splice(i, 1);
    }
    i += 2;
    j ++;
  }

  return pickables;
};

Map.prototype.generateMonsters = function (freeRoomCells) {
  var monsters = [];
  var i = 0;
  var j = 0;
  var nrMonsters = (ROT.RNG.getPercentage() * Constants.MAX_ROOM_MONSTERS) / 100;
  while(j < nrMonsters && i < freeRoomCells.length) {
    var prob = ROT.RNG.getPercentage(); // Probability
    var monster = null;
    var x = parseInt(freeRoomCells[i].split(",")[0]);
    var y = parseInt(freeRoomCells[i].split(",")[1]);
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
    monsters.push(monster);
    freeRoomCells.splice(i, 1);
    i += 2;
    j ++;
  }

  return monsters;
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

Map.prototype.setWall = function (x, y, isWall) {
  this.walls[x + "," + y] = isWall;
}

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
