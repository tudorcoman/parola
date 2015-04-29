var Ai = function (onUpdate, owner) {
  this.onUpdate = onUpdate;
  this.owner = owner;
};

Ai.prototype.update = function () {
  this.onUpdate(this.owner);
};

var AiTypes = {
  MonsterAi: function(actor) {
    var coords = ROT.DIRS[8][Game.player.direction];
    var newX = actor.x + coords[0];
    var newY = actor.y + coords[1]

    if(Game.map.isWallkable(newX, newY)) {
      actor.x = newX;
      actor.y = newY;
    } else if (Game.player.x == newX && Game.player.y == newY) {
      actor.attacker.attack(actor, Game.player);
    }
  }
};
