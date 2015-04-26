/* Actor - Componenta fundamentala a jocului. Orice obiect sau personaj este un actor.
   Actorul poate avea mai multe "componente" care ii permit sa faca diverse actiuni */
var Actor = function (x, y, ch, name, blocks, fg, bg) {
  this.x = x;
  this.y = y;
  this.ch = ch;
  this.name = name;
  this.blocks = blocks;
  this.fg = fg;
  this.bg = bg;
  if(this.bg == null)
    this.bg = Constants.GROUND_COLOR;
  this.interactable = null;
};

Actor.prototype.act = function () { // Functie care schimba avanseaza simularea
  
};

Actor.prototype.render = function () { // Deseneaza actorul pe ecran
  Game.display.draw(this.x, this.y, this.ch, this.fg, this.bg);
};