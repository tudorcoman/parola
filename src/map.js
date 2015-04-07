var walls = [];
var creator = null;

var Map = function (width, height, type) {
  this.width = width || ROT.DEFAULT_WIDTH;
  this.height = height || ROT.DEFAULT_HEIGHT;
  this.type = type || "digger";
};

Map.prototype.buildMap = function() {
  var freeCells = [];
  switch(this.type) {
    case "digger":
      creator = new ROT.Map.Digger(this.width, this.height);
  }
  creator.create(function(x, y, wall) {
    walls[x + "," + y] = wall;
    if(!wall)
      freeCells.push(x + "," + y);
  });
  createPlayer(freeCells);
}

Map.prototype.render = function () {
  for (i = 0; i < this.height; i++) {
    for (j = 0; j < this.width; j++) {
      Game.display.draw(j, i, null, null, this.isWall(j, i) ? Constants.WALL_COLOR : Constants.GROUND_COLOR);
    }
  }
  for (i = 0; i < creator.getRooms().length; i++) {
    var room = creator.getRooms()[i];
    room.getDoors(function (x, y){
      var door = new Actor(x, y, "+", "usa", true, "white", "brown");
      Game.actors.push(door);
    });
  }
};

Map.prototype.isWall = function (x, y) {
  return walls[x + "," + y];
};

Map.prototype.isWallkable = function (x, y) {
  return !this.isWall(x, y);
};