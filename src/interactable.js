/* Interactable - componenta a actorului caruia ii permite sa interactioneze cu jucatorul */
var Interactable = function (onInteractText, onInteract, owner, options) {
  this.onInteractText = onInteractText;
  this.onInteract = onInteract;
  this.options = options;
  this.owner = owner;
};

Interactable.prototype.interact = function (owner) {
  this.onInteract(owner);
};