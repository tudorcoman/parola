var Pickable = function () {

};

Pickable.prototype.pick = function (owner, wearer) {
  if(Game.map.isInFOV(owner.x, owner.y) && wearer.container && wearer.container.add(owner)) {
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
    Game.status = GAME_STATUS.NEW_TURN;
    wearer.container.remove(owner);
    delete owner;
    return true;
  }
  return false;
};

var PergamentPickable = function () {
  Pickable.call(this);
};

PergamentPickable.extend(Pickable);

PergamentPickable.prototype.pick = function (owner, wearer) {
  Pickable.prototype.pick.call(this, owner, wearer);
};

PergamentPickable.prototype.use = function (owner, wearer) {
  alert("Felicitari! Ai gasit pergamentul! Citeste ce scrie pe el:\n\n \
  \"Pentru fericitul explorator,\n\nNu a fost usor sa obtii acest document. Si de aceea nu va fi usor nici sa afli parola. \
  Drept urmare, iti voi zice parola intr-o forma codata: \n\nivnahyrtraqf\n\nTu trebuie sa descoperi algoritmul prin care parola a fost codificata pentru a decodifica parola. Este un algoritm bine cunoscut in istorie. Succes!\"");
  Game.win();
  Pickable.prototype.use.call(this, owner, wearer);
};

var HealerPickable = function (amount) {
  this.amount = amount;
};

HealerPickable.extend(Pickable);

HealerPickable.prototype.pick = function (owner, wearer) {
  Pickable.prototype.pick.call(this, owner, wearer);
};

HealerPickable.prototype.use = function (owner, wearer) {
  if (wearer.destructible) {
    var hp = wearer.destructible.hp + this.amount;
    if (hp > wearer.destructible.initialHp)
      hp = wearer.destructible.initialHp;
    wearer.destructible.hp = hp;
  }
  Pickable.prototype.use.call(this, owner, wearer);
};
