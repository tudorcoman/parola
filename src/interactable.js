/* Interactable - componenta a actorului caruia ii permite sa interactioneze cu jucatorul */
var Interactable = function (onInteractText, owner, options) {
  this.owner = owner;
  this.onInteractText = onInteractText;
  this.options = options;
  this.owner = owner;
};

Interactable.prototype.interact = function (owner) {
  this.onInteract(owner);

};

var Door = function (door) {
  Interactable.call(this, "deschide", door);
}

Door.extend(Interactable);

Door.prototype.interact = function () {
  var owner = this.owner;

  owner.ch = '/';
  owner.bg = "rgb(0, 0, 0)";
  owner.fg = "brown";
  owner.blocks = false;
};
