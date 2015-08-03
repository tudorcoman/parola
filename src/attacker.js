var Attacker = function (attackDamage) {
  this.attackDamage = attackDamage;
};

Attacker.prototype.attack = function (owner, actor) {
  Game.guiMessenger.message("%c{" + owner.fg + "}" + owner.name + "%c{} l-a mustrat pe%c{" + actor.fg + "} " + actor.name + "%c{} pentru " + this.attackDamage + " HP.");
  actor.destructible.takeDamage(actor, owner, this.attackDamage);
};
