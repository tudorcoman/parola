var GAME_STATUS = {
  IDLE: 0,
  NEW_TURN: 1,
  END: 2
};

var Game = {
  display: null,
  engine: null,
  player: null,
  map : null,
  actors: [],
  gui: null,
  guiMessenger: null,
  guiHpBar: null,
  scheduler: null,
  showModal: true,
  pergamentOnMap: false,
  status: GAME_STATUS.IDLE,
  
  init: function() {
    ROT.DEFAULT_WIDTH = Constants.SCREEN_WIDTH;
    ROT.DEFAULT_HEIGHT = Constants.SCREEN_HEIGHT + Constants.GUI_PANEL_HEIGHT;
    this.display = new ROT.Display(Constants.DISPLAY_OPTIONS);
    document.body.appendChild(this.display.getContainer());
    this.map = new Map(Constants.SCREEN_WIDTH, Constants.SCREEN_HEIGHT);
    this.map.buildMap();
    this.gui = new Gui(0, Constants.SCREEN_HEIGHT);
    this.guiHpBar = new GuiBar(2, Constants.SCREEN_HEIGHT + 1, Game.player.destructible.hp, "red");
    this.gui.addWidget(this.guiHpBar);
    var hpLabel = new GuiLabel(this.guiHpBar.x + (Constants.PLAYER_DEFAULT_HP - ("HP".length)) / 2, Constants.SCREEN_HEIGHT + 1, "%b{red}HP%b{}");
    this.gui.addWidget(hpLabel);
    this.guiMessenger = new GuiMessageList(this.guiHpBar.x + Constants.PLAYER_DEFAULT_HP + 2, Constants.SCREEN_HEIGHT);
    this.gui.addWidget(this.guiMessenger);
    this.scheduler = new ROT.Scheduler.Simple();
    this.scheduler.add(this.player, true);
    this.engine = new ROT.Engine(this.scheduler);
    this.engine.start();

    this.guiMessenger.message("%c{lime}Bine ai venit, exploratorule!%c{}");
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
  },
  godMode: function () {
    Game.player.destructible.hp = 9999;
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
