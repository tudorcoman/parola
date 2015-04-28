/* Destructible - componenta a actorului care "ii da aviata". Orice actor cu Destructible poate fii omorat. */
var Destructible = function (initialHp, defense, corpseName, corpseCh, corpseFg, corpseBg) {
  this.initialHp = initialHp;
  this.defense = defense;
  this.corpseName = corpseName;
  this.corpseCh = corpseCh;
  this.corpseFg = corpseFg;
  this.corpseBg = corpseBg;
  if(this.corpseBg == null)
    this.corpseBg = Constants.GROUND_COLOR;

  this.hp = this.initialHp;
  this.isDead = false;
};

Destructible.prototype.takeDamage = function (owner, actor, hpAmount) {
  if(actor.destructible) {
    var targetDmg = hpAmount - defense;
    if(targetDmg < 0)
      targetDmg = 0;
    this.hp -= targetDmg;
    if(this.hp <= 0) {
      this.isDead = true;
      owner.ch = corpseCh;
      owner.fg = corpseFg;
      owner.Bg = corpseBg;
      owner.ai = null;
    }
  }
};
