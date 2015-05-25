var Game = {
  display: null,
  engine: null,
  player: null,
  map : null,
  actors: [],
  gui: null,
  scheduler: null,
  showModal: true,
  pergamentOnMap: false,
  
  init: function() {
    ROT.DEFAULT_WIDTH = Constants.SCREEN_WIDTH;
    ROT.DEFAULT_HEIGHT = Constants.SCREEN_HEIGHT;
    this.display = new ROT.Display(Constants.DISPLAY_OPTIONS);
    document.body.appendChild(this.display.getContainer());
    this.map = new Map();
    this.map.buildMap();
    this.gui = new Gui(0, 0);
    this.scheduler = new ROT.Scheduler.Simple();
    this.scheduler.add(this.player, true);
    this.engine = new ROT.Engine(this.scheduler);
    this.engine.start();
  },
  update: function () {
    for (i = 0; i < this.map.actors.length; i++) {
      var actor = this.map.actors[i];
      if(actor != Game.player)
        actor.act();
    }
  },
  render: function () {
    this.display.clear();
    this.map.render();
    this.gui.render();
  },
  gameOver: function () {
    document.getElementById("wastedaudio").play();
    $("#overlay").animate({opacity: 0.7}, 7000);
  },
  win: function () {
    $("#confetti").animate({opacity: 1}, 7000);
    startFlakes();
    $("title").text("YOU WIN!!!");
  }
};

$(function() {
  var egg = new Egg();
  egg.addCode("r,i,c,k,r,o,l,l", function () {
    var rickrollhtml = '<video controls id="rickrollVideo">\
                          <source src="rickroll.mp4">\
                        </video>';
    vex.defaultOptions.className = "vex-theme-flat-attack";
    vex.dialog.alert({
      message: rickrollhtml
    });
    document.getElementById("rickrollVideo").play();
  }).listen();
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