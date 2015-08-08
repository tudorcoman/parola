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
  var index = this.inventory.indexOf(actor);
  if(index > -1) {
    this.inventory.splice(index, 1);
  }
};
