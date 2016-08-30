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
    var targetDmg = hpAmount - this.defense;
    if(targetDmg < 0)
      targetDmg = 0;
    this.hp -= targetDmg;
    if(this.hp <= 0) {
      if (owner.name != numeleJucatorului)
        Game.guiMessenger.message("%c{" + owner.fg + "}" + owner.name + "%c{} a lesinat.†");
      else
        Game.guiMessenger.message("Ai fost prins");
      this.isDead = true;
      owner.ch = this.corpseCh;
      owner.fg = this.corpseFg;
      owner.Bg = this.corpseBg;
      owner.ai = null;
      owner.blocks = false;
    }
  } else {
    console.warn("Actor is not destructible.");
    console.warn(actor);
  }
};

Destructible.prototype.isDead = function () {
  return this.hp == 0;
};
