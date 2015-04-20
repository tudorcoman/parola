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
    room.getDoors(function (x, y){
      var door = new Actor(x, y, "+", "usa", true, "white", "brown");
      actors[x + "," + y] = door;
    });
  }
  createPlayer(freeCells);
}

Map.prototype.render = function () {
  Game.player.computeFOV();
  var toRender = [];
  for (i = 0; i < this.height; i++) {
    for (j = 0; j < this.width; j++) {
      if(Game.player.isTileExplored(j, i)) {
        var color = ROT.Color.fromString(this.isWall(j, i) ? Constants.WALL_COLOR : Constants.GROUND_COLOR);
        if(this.isInFOV(j, i))
          color = ROT.Color.multiply(color, ROT.Color.fromString("white"));
        else
          color = ROT.Color.multiply(color, ROT.Color.fromString("grey"));
      } else {
        color = ROT.Color.fromString("#00030c");
      }
      Game.display.draw(j, i, null, null, ROT.Color.toHex(color));
      var actors = this.actors;
      for(k = 0; k < Game.player.tilesInFOV.length; k++) {
        var coords = Game.player.tilesInFOV[k].split(",");
        var x = parseInt(coords[0]);
        var y = parseInt(coords[1]);
        if(actors[x + "," + y])
          actors[x + "," + y].render();
      }
    }
  }
};

Map.prototype.isWall = function (x, y) {
  return this.walls[x + "," + y];
};

Map.prototype.isWallkable = function (x, y) {
  return !(this.isWall(x, y) || (this.actors[x + "," + y] && this.actors[x + "," + y].blocks));
};
  
Map.prototype.isInFOV = function(x, y) {
  if(Game.player.tilesInFOV[x + "," + y])
    return true;
  return false;
};