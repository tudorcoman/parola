/* Gui - interfata grafica */
var Gui = function (x, y) {
  this.x = x;
  this.y =  y;
  this.messages = [];
};

Gui.prototype.message = function (text) { // Pune un nou mesaj
  this.messages.push("" + text + "");
};

Gui.prototype.render = function () { // Deseneaza interfata
  this.renderMessages();
};

Gui.prototype.renderMessages = function () { // Deseneaza mesajele
  for(i = 3; i > 0; i--) {
    if(this.messages[this.messages.length - i])
      Game.display.drawText(this.x, this.y + (3 - i), this.messages[this.messages.length - i]);
  }
};
