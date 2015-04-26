var Game = {
  display: null,
  engine: null,
  player: null,
  map : null,
  actors: [],
  gui: null,
  showModal: true,
  
  init: function() {
    ROT.DEFAULT_WIDTH = Constants.SCREEN_WIDTH;
    ROT.DEFAULT_HEIGHT = Constants.SCREEN_HEIGHT;
    this.display = new ROT.Display(Constants.DISPLAY_OPTIONS);
    document.body.appendChild(this.display.getContainer());
    this.map = new Map();
    this.map.buildMap();
    this.gui = new Gui(0, 0);
    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  },
  
  render: function () {
    this.display.clear();
    this.map.render();
    this.gui.render();
  }
};

$(function() {
  Game.init();
  if(Game.showModal) {
    vex.dialog.alert({
      message: $(".initModal").html()
    });
  } else {
    $(".initModal").css("display", "block");
  }
  Game.render();
});