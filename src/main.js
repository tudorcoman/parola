var Game = {
  display: null,
  engine: null,
  player: null,
  map : null,
  actors: [],
  
  init: function() {
    ROT.DEFAULT_WIDTH = Constants.SCREEN_WIDTH;
    ROT.DEFAULT_HEIGHT = Constants.SCREEN_HEIGHT;
    this.display = new ROT.Display();
    document.body.appendChild(this.display.getContainer());
    this.map = new Map();
    this.map.buildMap();
    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  },
  
  render: function () {
    this.display.clear();
    this.map.render();
    for(i = 0; i < Game.actors.length; i++) {
      Game.actors[i].render();
    }
  }
};

$(function() {
  Game.init();
  Game.render();
});