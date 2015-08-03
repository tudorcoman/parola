/* Gui - interfata grafica */
var Gui = function (x, y) {
  this.x = x;
  this.y =  y;
  this.widgets = [];
};

Gui.prototype.addWidget = function (widget) {
  this.widgets.push(widget);
};

Gui.prototype.render = function () {
  this.widgets.forEach(function (widget) {
    widget.render();
  });
};

var GuiWidget = function (x, y) {
  this.x = x;
  this.y = y;
};

var GuiLabel = function (x, y, text) {
  GuiWidget.call(this, x, y);

  this.text = text;
};

GuiLabel.extend(GuiWidget);

GuiLabel.prototype.render = function () {
  Game.display.drawText(this.x, this.y, this.text);
};

var GuiMessageList = function (x, y) {
  GuiWidget.call(this, x, y);

  this.messages = [];
};

GuiMessageList.extend(GuiWidget);

GuiMessageList.prototype.message = function (text) {
  this.messages.push(text);
};

GuiMessageList.prototype.render = function () {
  this._renderMessages();
};

GuiMessageList.prototype._renderMessages = function () {
  for(i = 3; i > 0; i--) {
    if(this.messages[this.messages.length - i])
      Game.display.drawText(this.x, this.y + (3 - i), this.messages[this.messages.length - i]);
  }
};

var GuiBar = function (x, y, value, color) {
  GuiWidget.call(this, x, y);

  this.value = value;
  this.color = color;
};

GuiBar.extend(GuiWidget);

GuiBar.prototype.setValue = function (newValue) {
  this.value = newValue;
};

GuiBar.prototype.render = function () {
  var i;

  for (i = 0; i < this.value; i++) {
    Game.display.draw(this.x + i, this.y, null, null, this.color);
  }
};
