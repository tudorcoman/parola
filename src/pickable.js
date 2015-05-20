var Pickable = function (name) {
  this.name = name;
};

Pickable.prototype.pick = function (owner, wearer) {
  if(wearer.container && wearer.container.add(owner)) {
    var index = Game.map.actors.indexOf(owner);
    if(index > -1) {
      Game.map.actors.splice(index, 1);
    }
    return true;
  }
  return false;
};

Pickable.prototype.use = function (owner, wearer) {
  if(wearer.container) {
    wearer.container.remove();
    delete owner;
    return true;
  }
  return false;
};

var Pergament = function () {
  Pickable.call(this, "Pergament");
};

Pergament.extend(Pickable);

Pergament.prototype.pick = function (owner, wearer) {
  Game.win();
};

Pergament.prototype.use = function (owner, wearer) {
  Game.win();
  Pickable.use(owner, wearer);
  return true;
};