var Ai = function () {
  
};

Ai.prototype.update = function (owner) {
  
};

Ai.prototype.moveOrAttack = function (owner, x, y) {

};

var PlayerAi = function () {
  Ai.call(this);
};

PlayerAi.extend(Ai);

PlayerAi.prototype.moveOrAttack = function (owner, x, y) {
  if(Game.map.isWallkable(x, y)) {
    owner.x = x;
    owner.y = y;
    owner.hasMoved = true;
  } else {
    owner.hasMoved = false;
    var i = 0;
    var actors = Game.map.actors;
    while(i < actors.length && (actors[i].destructible == null || actors[i].destructible.isDead || 
          actors[i].x != x || actors[i]. y != y)) {
      i++;
    }
    if(i < actors.length) {
      var actor = actors[i];
      owner.attacker.attack(owner, actor);
    }
  }
  return owner.hasMoved;
};

PlayerAi.prototype.update = function (owner) {
  var movementKeyMap = [];
  movementKeyMap[ROT.VK_UP] = 0;
  movementKeyMap[ROT.VK_PAGE_UP] = 1;
  movementKeyMap[ROT.VK_RIGHT] = 2;
  movementKeyMap[ROT.VK_PAGE_DOWN] = 3;
  movementKeyMap[ROT.VK_DOWN] = 4;
  movementKeyMap[ROT.VK_END] = 5;
  movementKeyMap[ROT.VK_LEFT] = 6;
  movementKeyMap[ROT.VK_HOME] = 7;
  var key = owner.lastKey;

  if(key in movementKeyMap) {
    Game.status = GAME_STATUS.NEW_TURN;
    owner.direction = movementKeyMap[key];
    var coords = ROT.DIRS[8][movementKeyMap[key]];
    var newX = owner.x + coords[0];
    var newY = owner.y + coords[1];
    var intX, intY;

    this.moveOrAttack(owner, newX, newY);
    intX = owner.x + coords[0];
    intY = owner.y + coords[1];
    var actor = Game.map.actorAt(intX, intY);
    if(actor && actor.interactable) {
      Game.guiMessenger.message("Apasa \"E\" pentru a " + actor.interactable.onInteractText + " " + actor.name + ".");
      owner.interactableNear = actor;
    } else {
      owner.interactableNear = null;
    }
    if(actor && actor.pickable) {
      Game.guiMessenger.message("Da click pe %c{" + actor.fg + "}" + actor.pickable.name + "%c{} pentru a-l colecta.");
    }
  } else {
    Game.status = GAME_STATUS.IDLE;
    var letter = String.fromCharCode(key);
    switch(letter) {
      case 'E':
        if(owner.interactableNear && owner.interactableNear.interactable)
          owner.interactableNear.interactable.interact(owner.interactableNear);
        owner.interactableNear = null;
        break;
    }
  }
  owner.lastKey = null;
};

var MonsterAi = function () {
  Ai.call(this);
  this.moveCount = 0;
};

MonsterAi.extend(Ai);

MonsterAi.prototype.moveOrAttack = function (owner, x, y) {
  var dx = x - owner.x;
  var dy = y - owner.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  if(distance >= 2) {
    dx = parseInt(Math.round(dx / distance));
    dy = parseInt(Math.round(dy / distance));
    if(Game.map.isWallkable(owner.x + dx, owner.y + dy)) {
      owner.x += dx;
      owner.y += dy;
    }
  } else if(owner.attacker) {
    owner.attacker.attack(owner, Game.player);
  }
};

MonsterAi.prototype.update = function (owner) {
  var moveCount = this.moveCount;
  
  if(owner.destructible && owner.destructible.isDead) {
    moveCount = 0;
    return;
  }
  if(Game.map.isInFOV(owner.x, owner.y)) {
    moveCount = Constants.MONSTER_TRACKING_TURNS;
  } else {
    moveCount--;
  }
  if(moveCount > 0)
    this.moveOrAttack(owner, Game.player.x, Game.player.y);
};
