var Attacker = function (attackDamage) {
  this.attackDamage = attackDamage;
};

Attacker.prototype.attack = function (owner, actor) {
  actor.destructible.takeDamage(actor, owner, this.attackDamage);
};