<!DOCTYPE html>
<html>
  <head>
    <title>Gaseste pergamentul</title>
    <meta charset="utf-8">
    <script>numeleJucatorului = "<?php $numeleJucatorului = $_POST['numeleJucatorului']; echo $numeleJucatorului; ?>"; </script>
    <script src="other.js"></script>
    <script src="lib/jQuery.min.js"></script>
    <script src="lib/vex/vex.combined.min.js"></script>
    <script>vex.defaultOptions.className = 'vex-theme-bottom-right-corner';</script>
    <script src="lib/egg.js"></script>
    <script src="lib/rot.js"></script>
    <script src="src/constants.js"></script>
    <script src="src/interactable.js"></script>
    <script src="src/destructible.js"></script>
    <script src="src/attacker.js"></script>
    <script src="src/ai.js"></script>
    <script src="src/container.js"></script>
    <script src="src/pickable.js"></script>
    <script src="src/map.js"></script>
    <script src="src/actor.js"></script>
    <script src="src/player.js"></script>
    <script src="src/gui.js"></script>
    <script src="src/dialog.js"></script>
    <script src="src/main.js"></script>
    <script src="src/flakes.js"></script>
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="lib/vex/vex.css" />
    <link rel="stylesheet" href="lib/vex/vex-theme-bottom-right-corner.css" />
    <link rel="stylesheet" href="lib/vex/vex-theme-flat-attack.css" />
  </head>

  <body>
    <audio id="wastedaudio" src="media/wasted.mp3"></audio>
    <div class="overlay">
      <img src="media/wasted.png" id="endtext" />
    </div>
    <canvas id="confetti"></canvas>
    <header>
      <h3>Gaseste pergamentul</h3>
    </header>
    <div class="gameContainer"></div>
    <div class="initModal">
      <h3>Bun venit, <?php echo $numeleJucatorului; ?>!</h3>
      <p>
        Tu esti un <span class="bold lime">elev curajos</span> care a intrat in <span class="bold gray">catacombele de sub scoala</span> pentru a gasi <span class="bold cyan">pergamentul magic</span> cu parola de la WI-FI.
      </p>
      <p>Mult succes!</p>
      <h2>Cum se joaca:</h2>
      <ol>
        <li>Taste:</li>
        <ul>
          <li><code>Sageti</code> pentru miscare</li>
          <li><code>E</code> pentru a interactiona cu un obiect</li>
          <li><code>Click</code> pentru a colecta un obiect</li>
          <li><code>0, 1...</code> pentru a folosi obiectul cu acel numar din ghiozdan</li>
        </ul>
        <li>
          Scopul tau este sa gasesti pergamentul si sa il citesti.
        </li>
      </ol>
    </div>

  </body>
</html>
