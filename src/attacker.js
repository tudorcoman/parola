var Attacker = function (damage) {
  this.damage = damage;
};

Attacker.prototype.attack = function (owner, actor) {
  if(actor.destructible) {
    owner.destructible.takeDamage(owner, actor, this.damage);
  }
};
