var Container = function (size) {
  this.size = size;
  this.inventory = [];
};

Container.prototype.add = function (actor) {
  if(this.inventory.length < this.size) {
    this.inventory.push(actor);
    return true;
  }
  return false;
};

Container.prototype.remove = function (actor) {
  var index = Game.map.actors.indexOf(actor);
  if(index > -1) {
    Game.map.actors.splice(index, 1);
  }
};