var Actor = function (x, y, ch, name, blocks, fg, bg) {
  this.x = x;
  this.y = y;
  this.ch = ch;
  this.name = name;
  this.blocks = blocks;
  this.fg = fg;
  this.bg = bg;
};

Actor.prototype.act = function () {
  
};

Actor.prototype.render = function () {
  Game.display.draw(this.x, this.y, this.ch, this.fg, this.bg);
  console.log(this.ch);
};