/* Interactable - componenta a actorului caruia ii permite sa interactioneze cu jucatorul */
var Interactable = function (onInteractText, onInteract, options) {
  this.onInteractText = onInteractText;
  this.onInteract = onInteract;
  this.options = options;
};

Interactable.prototype.interact = function () {
  this.onInteract();
};