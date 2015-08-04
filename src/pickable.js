var Pickable = function (name) {
  this.name = name;
};

Pickable.prototype.pick = function (owner, wearer) {
  if(wearer.container && wearer.container.add(owner)) {
    Game.guiMessenger.message("Ai luat %c{" + owner.fg + "}" + owner.name + "%c{}.");
    var index = Game.map.actors.indexOf(owner);
    if(index > -1) {
      Game.map.actors.splice(index, 1);
    }
    return true;
  } else {
    return false;
  }
};

Pickable.prototype.use = function (owner, wearer) {
  if(wearer.container) {
    wearer.container.remove();
    delete owner;
    return true;
  }
  return false;
};

var PergamentPickable = function () {
  Pickable.call(this, "Pergament");
};

PergamentPickable.extend(Pickable);

PergamentPickable.prototype.pick = function (owner, wearer) {
  Pickable.prototype.pick.call(this, owner, wearer);
};

PergamentPickable.prototype.use = function (owner, wearer) {
  alert("Felicitari! Ai gasit pergamentul! Citeste ce scrie pe el:\n\n \
  \"Pentru fericitul explorator,\n\nNu a fost usor sa obtii acest document. Si de aceea nu v-a fii usor nici sa aflii parola. \
  Drept urmare, iti voi zice parola intr-o forma codata: \n\nivnahyrtraqf\n\nTu trebuie sa descoperi algoritmul pentru a decodifica parola. Succes!\"");
  Game.win();
  Pickable.prototype.use.call(this, owner, wearer);
};
