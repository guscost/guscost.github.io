var sf = (function(){

  // Audio variables
  var myAudioContext;
  var mySources = {};
  var myBuffers = {};
  
  // Sprites
  var emptyBoulderImg = [new Image(), new Image(), new Image(), new Image()];
  var resourceBoulderImg = [new Image(), new Image(), new Image()];
  var staticBoulderImg = new Image();
  var moonImg = new Image();
  var roverImg = new Image();
  var enemyImg = new Image();
  var hippyImg = new Image();
  var deadRoverImg = new Image();
  var deadEnemyRoverImg = new Image();
  var deadHippyImg = new Image();
  var backgroundImg = new Image();

  // Game object
  var game = {};
  game.currentLevel = 0;
  game.started = false;

  // Animation variables
  var requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return window.setTimeout((function() {
        return callback(1000 / 60);
      }), 1000 / 60);
    };

  var cancelAnimationFrame = window.cancelAnimationFrame || 
    window.webkitCancelAnimationFrame || 
    window.mozCancelAnimationFrame || 
    window.oCancelAnimationFrame || 
    window.msCancelAnimationFrame || 
    window.clearTimeout;

  // Utility functions
  var detectCollision = function(o, x, y) {
    if (Math.abs(o.x-x) > o.r || Math.abs(o.y-y) > o.r) {
      return false;
    }
    else if (Math.pow(x-o.x,2)+Math.pow(y-o.y,2) > o.r*o.r) {
      return false;
    }
    else {
      return true;
    }
  };
  var drawObstacle = function(obstacle, sprite) {
    c.drawImage(
      sprite, 
      obstacle.x - obstacle.r, 
      obstacle.y - obstacle.r, 
      obstacle.r*2, 
      obstacle.r*2
    );
  };
  var killPlayer = function() {
    playSound('shotgun');
    makeExplosion(game.rover.x, game.rover.y, '#BB3333');
    game.rover.exploded = true;
    game.lost = true;
    game.loadTimer = 360;
  };
  var startGame = function() {
    $('#menu').hide();
    $('#canvas').show();
    $('audio')[0].play();
    setSize();
    game.setup();
    game.run();
  };

  // Particle array
  var particles = [];
  // Particle constructor
  function Particle ()
  {
    this.scale = 1.0;
    this.x = 0;
    this.y = 0;
    this.radius = 20;
    this.fillColor = "#000";
    this.velocityX = 0;
    this.velocityY = 0;
    this.scaleSpeed = 0.01;
    this.update = function(ms)
    {
      this.scale -= this.scaleSpeed * ms / 1000.0;
      if (this.scale <= 0) { this.scale = 0; }
      this.x += this.velocityX * ms/1000.0;
      this.y += this.velocityY * ms/1000.0;
    };

    this.draw = function(context)
    {
      c.save();
      c.translate(this.x, this.y);
      c.scale(this.scale, this.scale);
      c.beginPath();
      c.arc(0, 0, this.radius, 0, Math.PI*2, true);
      c.closePath();
      c.fillStyle = this.fillColor;
      c.fill();
      //c.lineWidth = this.strokeWidth;
      //c.strokeStyle = this.strokeColor;
      //c.stroke();
      c.restore();
    };
  }

  // Draw explosion with particles
  function drawExplosion (x,y,fill) {
    var minSize = 6;
    var maxSize = 16;
    var count = 10;
    var minSpeed = 24;
    var maxSpeed = 48;
    var minScaleSpeed = 1.0;
    var maxScaleSpeed = 4.0;

    for (var angle=0; angle<360; angle += Math.round(360/count))
    {
      var particle = new Particle();
      particle.x = x;
      particle.y = y;
      particle.radius = minSize + Math.random()*(maxSize-minSize)
      particle.fillColor = fill;
      particle.scaleSpeed = minScaleSpeed + Math.random()*(maxScaleSpeed-minScaleSpeed);

      var speed = minSpeed + Math.random()*(maxSpeed-minSpeed);
      particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
      particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
      particles.push(particle);
    }
  }
  function makeExplosion (x,y,color) {
    playSound('explosion');
    drawExplosion(x,y,color);
  };
  function explodeObstacle(i) {
    makeExplosion(game.obstacles[i].x, game.obstacles[i].y,'#AAAAAA');
    game.obstacles.splice(i, 1);
  };
  function explodeEnemy(i) {
    makeExplosion(game.enemies[i].x, game.enemies[i].y,'#BB3333');
    // Stop sound if drilling interrupted
    if (game.enemies[i].driving) { stopSound('drive' + i); game.enemies[i].extracting = false; }
    if (game.enemies[i].drilling) { stopSound('drill' + i); game.enemies[i].drilling = false; }
    if (game.enemies[i].extracting) { stopSound('extract' + i); game.enemies[i].extracting = false; }
    game.enemies[i].probeDepth = 0;
    game.enemies[i].exploded = true;
  };

  // Set up audio context
  if ('AudioContext' in window) {
    myAudioContext = new AudioContext();
  } else if ('webkitAudioContext' in window) {
    myAudioContext = new webkitAudioContext();
  } else {
    alert('Your browser does not support yet Web Audio API');
  }

  // Play a sound from a decoded buffer
  function playSound(sound, playbackRate) {
    mySources[sound] = myAudioContext.createBufferSource();
    mySources[sound].buffer = myBuffers[sound];
    mySources[sound].connect(myAudioContext.destination);
    if (playbackRate) { mySources[sound].playbackRate.value = playbackRate; }
    if ('AudioContext' in window) {
      mySources[sound].start(0);
    } else if ('webkitAudioContext' in window) {
      mySources[sound].noteOn(0);
    } 
  }

  // Play a sound from a decoded buffer
  function stopSound(sound) {
    if ('AudioContext' in window) {
      mySources[sound].stop(0);
    } else if ('webkitAudioContext' in window) {
      mySources[sound].noteOff(0);
    } 
  }

  // Load Base64 encoded audio into buffer
  function loadSound(data, name) {
    var soundArrayBuff = Base64Binary.decodeArrayBuffer(data);
    myAudioContext.decodeAudioData(soundArrayBuff, function(audioData) {
      myBuffers[name] = audioData;
    });
  }

  // Load sound effects
  loadSound(frack1Sound, 'frack1');
  loadSound(shockSound, 'shock');
  loadSound(explosionSound, 'explosion');
  loadSound(shotgunSound, 'shotgun');
  loadSound(splatSound, 'splat');
  loadSound(clinkSound, 'clink');
  loadSound(thudSound, 'thud');
  loadSound(booSound, 'boo');
  loadSound(fanfareSound, 'fanfare');
  loadSound(dontFrackSound, 'dontFrack');
  loadSound(drillSound, 'drillA');
  loadSound(drillSound, 'drill0');
  loadSound(drillSound, 'drill1');
  loadSound(drillSound, 'drill2');
  loadSound(extractSound, 'extractA');
  loadSound(extractSound, 'extract0');
  loadSound(extractSound, 'extract1');
  loadSound(extractSound, 'extract2');
  loadSound(drillSound, 'driveA');
  loadSound(drillSound, 'drive0');
  loadSound(drillSound, 'drive1');
  loadSound(drillSound, 'drive2');
  //var frackSound = new Audio("snd/frack.wav"); // buffers automatically when created

  // Load image files
  moonImg.src = 'img/moon.png';
  roverImg.src = 'img/rover.png';
  enemyImg.src = 'img/enemyRover.png';
  hippyImg.src = '/img/hippyWithHelmet.png';
  deadRoverImg.src = '/img/deadRover.png';
  deadEnemyRoverImg.src = '/img/deadEnemyRover.png';
  deadHippyImg.src = '/img/deadHippy.png';
  backgroundImg.src = '/img/background.jpg';

  staticBoulderImg.src = 'img/boulder0.png';
  emptyBoulderImg[0].src = 'img/boulder1.png';
  emptyBoulderImg[1].src = 'img/boulder2.png';
  emptyBoulderImg[2].src = 'img/boulder3.png';
  emptyBoulderImg[3].src = 'img/boulder4.png';
  resourceBoulderImg[0].src = 'img/boulder1.png';
  resourceBoulderImg[1].src = 'img/boulderResource2.png';
  resourceBoulderImg[2].src = 'img/boulderResource3.png';

  // Game key bindings
  game.keys = {
    SHIFT: 16,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  };

  // Run/resume gameplay
  game.run = function() {
    var s;
    if (this.running) {
      return;
    }
    this.running = true;
    s = (function(_this) {
      return function() {
        _this.step();
        return _this.frameRequest = requestAnimationFrame(s);
      };
    })(this);
    this.last_step = Date.now();
    return this.frameRequest = requestAnimationFrame(s);
  };

  // Pause gameplay
  game.stop = function() {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
    this.frameRequest = null;
    return this.running = false;
  };

  // Step gameplay
  game.step = function() {
    var dt, now;
    now = Date.now();
    dt = (now - this.last_step) / 1000;
    this.last_step = now;
    this.update(dt);
    this.draw();
    return;
  };

  // Set up game
  game.setup = function() {

    // Stop all sounds
    if (game.enemies) {
      game.enemies.forEach(function(enemy, index) {
        if (enemy.driving) { stopSound('drive' + index); enemy.driving = false; }
        if (enemy.drilling) { stopSound('drill' + index); enemy.drilling = false; }
        if (enemy.extracting) { stopSound('extract' + index); enemy.extracting = false; }
      });
    }
    if (game.rover) {
      if (game.rover.driving) { stopSound('driveA'); game.rover.driving = false; }
      if (game.rover.drilling) { stopSound('drillA'); game.rover.drilling = false; }
      if (game.rover.extracting) { stopSound('extractA'); game.rover.extracting = false; }
    }

    // Game variables
    game.planet = {x:480, y:window.innerHeight/2, r:200, d:400};
    game.rover = {x:200, y:0, a:0, c:0, probeDepth:0, resources:0,driving:false,drilling:false,extracting:false,exploded:false};
    game.enemies = [];
    game.obstacles = [];
    game.explosions = [];
    game.shocks = [];
    game.hippies = [];
    game.hippyResources = 0;
    game.shockOrigin = {x:0, y:0};
    game.shockCooldown = 0;
    game.shockAngle = 0;
    game.left = false;
    game.right = false;
    game.running = false;
    game.endPlayed = false;
    game.planet.y = game.height/2;
    game.announcement = '';
    game.announcementTimer = 0;

    if (game.currentLevel === 0) {
      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0,
        a:Math.PI, 
        c:Math.PI*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });

      // Setup game.obstacles
      game.obstacles.push({
        x: 45,
        y: 53,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -30,
        y: -20,
        r: 25,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
    }
    else if (game.currentLevel === 1) {
      // Setup NPCs
      game.hippies.push({
        a:1.5*Math.PI,
        randomTimer:0,
        dead: false
      });

      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0,
        a:Math.PI, 
        c:Math.PI*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });

      // Setup game.obstacles
      game.obstacles.push({
        x: -111,
        y: -53,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 100,
        y: 0,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -50,
        y: 100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -100,
        y: -20,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -70,
        y: -70,
        r: 25,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -120,
        y: 50,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 47,
        y: -65,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
    }

    else if (game.currentLevel === 2) {
      // Setup NPCs
      game.hippies.push({
        a:1.5*Math.PI,
        randomTimer:0,
        dead: false
      });
      game.hippies.push({
        a:.5*Math.PI,
        randomTimer:0,
        dead: false
      });

      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0,
        a:4.6, 
        c:4.6*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });

      game.obstacles.push({
        x: 0,
        y: 0,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      // Setup game.obstacles
      game.obstacles.push({
        x: 77,
        y: 32,
        r: 20,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: 100,
        y: 0,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -100,
        y: 40,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -100,
        y: 0,
        r: 20,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -50,
        y: 120,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -50,
        y: -100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 40,
        y: 100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 76,
        y: -30,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
    }

    else if (game.currentLevel === 3) {
      // Setup NPCs
      game.hippies.push({
        a:1.5*Math.PI,
        randomTimer:0,
        dead: false
      });

      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0, 
        a:Math.PI, 
        c:Math.PI*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });

      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0, 
        a:0.7*Math.PI, 
        c:0.7*Math.PI*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });

      // Setup game.obstacles
      game.obstacles.push({
        x: 100,
        y: -40,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -60,
        y: -100,
        r: 24,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -100,
        y: -60,
        r: 20,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 60,
        y: 83,
        r: 20,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 90,
        y: 90,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: 120,
        y: -77,
        r: 20,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -70,
        y: 100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: 40,
        y: 50,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: 47,
        y: -65,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 0
      });
    }

    else if (game.currentLevel === 4) {
      // Setup NPCs
      game.hippies.push({
        a:1.2*Math.PI,
        randomTimer:0,
        dead: false
      });
      game.hippies.push({
        a:0.9*Math.PI,
        randomTimer:0,
        dead: false
      });

      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0, 
        a:1.3*Math.PI, 
        c:1.3*Math.PI*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });
      // Setup game.enemies
      game.enemies.push({
        x:0, 
        y:0, 
        a:0.6*Math.PI, 
        c:0.6*Math.PI*60, 
        probeDepth:0, 
        probeX:0,
        probeY:0,
        resources:0,
        randomTimer:0,
        driving: false,
        drilling: false,
        extracting: false,
        collided: false,
        exploded: false
      });

      // Setup game.obstacles
      game.obstacles.push({
        x: -20,
        y: 0,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: 10,
        y: 130,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
      game.obstacles.push({
        x: -50,
        y: 100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -100,
        y: -100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -130,
        y: -40,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -80,
        y: -10,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 40,
        y: -100,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 72,
        y: -65,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 35,
        y: 65,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -150,
        y: 33,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 77,
        y: 60,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -99,
        y: -65,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: -39,
        y: 22,
        r: 25,
        hit: false,
        breakable: true,
        broken: 0,
        resources: 100
      });
      game.obstacles.push({
        x: 100,
        y: -10,
        r: 20,
        hit: false,
        breakable: false,
        broken: 0,
        resources: 0
      });
    }

    // Total resources
    game.totalResources = 0;
    game.totalEnemyResources = 0;
    game.obstacles.forEach(function(obstacle){ game.totalResources += obstacle.resources; });

    // Play hippy sound if any hippies
    game.playHippy = game.hippies.length;

    // Game state
    game.won = false;
    game.lost = false;
    game.loadTimer = 0;
  }

  // Update game logic
  game.update = function(dt) {
    // Save variables
    var maxDistance = game.planet.r*game.planet.r;
    var lastC = game.rover.c;

    // Move NPCs
    game.hippies.forEach(function(hippy, index) {

      // Save hippy euclidean coordinates
      hippy.x = Math.cos(hippy.a) * game.planet.r;
      hippy.y = Math.sin(hippy.a) * game.planet.r;

      if (!game.lost && !hippy.dead && !game.rover.exploded && 
        Math.pow(hippy.x-game.rover.x, 2) + Math.pow(hippy.y-game.rover.y, 2) < 500) 
      {
        playSound('splat');
        hippy.dead = true;
        if (!game.won) {
          game.hippyResources += 50;
          game.rover.resources -= 50;
          playSound('boo');
          game.announcement = 'PR Disaster!';
          game.announcementTimer = 100;
        }
      }

      if (Math.abs(hippy.randomTimer) < 3) { 
        hippy.randomTimer = Math.random()*200 - 100;
      }
      else if (!hippy.dead) {
        var shouldMove = Math.abs(hippy.randomTimer) > 20;
        if (hippy.randomTimer < 0) { 
          if (shouldMove) { hippy.a += 1/120; } 
          hippy.randomTimer++; 
        }
        else if (hippy.randomTimer > 0) { 
          if (shouldMove) { hippy.a -= 1/120; } 
          hippy.randomTimer--; 
        }
      }
    });

    // Move game.enemies
    game.enemies.forEach(function(enemy, index) {
      var wasDriving = enemy.driving;

      //Detect collision with player
      if (!game.won && !enemy.exploded && !game.rover.exploded && 
        Math.pow(enemy.x-game.rover.x, 2) + Math.pow(enemy.y-game.rover.y, 2) < 900) 
      {
        killPlayer();
      }

      if (!enemy.exploded) {
        // Enemy logic
        var currentResource = 0;
        var foundResource = false;
        var nearestDistance = maxDistance;
        var nearestAngle = 0;
        var nearestDirection = 0;

        // Save enemy euclidean coordinates
        enemy.x = Math.cos(enemy.a) * game.planet.r;
        enemy.y = Math.sin(enemy.a) * game.planet.r;

        // Find best resource to steal
        game.obstacles.forEach(function(obstacle, index) {
          if (obstacle.resources > 0 && obstacle.broken === 2) {    
            var distanceUnderground = maxDistance - (obstacle.x*obstacle.x + obstacle.y*obstacle.y);
            if (distanceUnderground < nearestDistance) {
              nearestDistance = distanceUnderground;
              nearestAngle = Math.atan2(obstacle.y, obstacle.x);
              currentResource = index;
              foundResource = true;
            };
          }
        });

        // Steal the resources!
        if (foundResource) {
          // Drill if close enough
          if (Math.abs(nearestAngle-enemy.a)%(2*Math.PI) < 0.1) {
            // Enemy probe control
            enemy.collided = false;
            enemy.probeX = (game.planet.r - enemy.probeDepth) * Math.cos(enemy.a);
            enemy.probeY = (game.planet.r - enemy.probeDepth) * Math.sin(enemy.a);

            // Detect collision with target resource
            if (detectCollision(game.obstacles[currentResource], enemy.probeX, enemy.probeY))
            {
              // Make sure we have a valid resources
              if (game.obstacles[currentResource].resources > 0 && game.obstacles[currentResource].broken > 1)
              {
                if(!enemy.extracting) { playSound('extract' + index); enemy.extracting = true; }
                enemy.resources++;
                game.totalEnemyResources++;
                game.obstacles[currentResource].resources--;
              }
              enemy.collided = true;
            }
            // Drill until collision
            if (!enemy.collided) { 
              enemy.probeDepth = Math.min(enemy.probeDepth+1, game.planet.r); 
              if (!enemy.drilling) { playSound('drill' + index); enemy.drilling = true; }
            }
            else { stopSound('drill' + index); enemy.drilling = false; }

            // Stop driving
            enemy.driving = false;
          }
          else { 
            // Move enemy to next resource
            var angleDifference = nearestAngle%(2*Math.PI) - enemy.a%(2*Math.PI);
            if (angleDifference > Math.PI || angleDifference < 0) { enemy.c--; }
            else { enemy.c++; }

            // Stop sound if drilling interrupted
            if (enemy.drilling) { stopSound('drill' + index); enemy.drilling = false; }
            if (enemy.extracting) { stopSound('extract' + index); enemy.extracting = false; }
            enemy.driving = true;
            enemy.a = enemy.c/60; // Half speed
            enemy.probeDepth = 0;
          }
        }
        else if (enemy.drilling || enemy.extracting) {
          if (enemy.drilling) { stopSound('drill' + index); enemy.drilling = false; enemy.probeDepth = 0; }
          if (enemy.extracting) { stopSound('extract' + index); enemy.extracting = false; enemy.probeDepth = 0; }
        }
        else {
          if (Math.abs(enemy.randomTimer) < 3) { 
            enemy.randomTimer = Math.random()*200 - 100;
          }
          else {
            var shouldMove = Math.abs(enemy.randomTimer) > 20;
            if (enemy.randomTimer < 0) { 
              if (shouldMove) { enemy.c++; enemy.a = enemy.c/60; enemy.driving = true; } 
              enemy.randomTimer++; 
            }
            else if (enemy.randomTimer > 0) { 
              if (shouldMove) { enemy.c--; enemy.a = enemy.c/60; enemy.driving = true; } 
              enemy.randomTimer--; 
            }
            if (!shouldMove && enemy.driving) { stopSound('drive' + index); enemy.driving = false; }
          }
        }
      }
      if (!wasDriving && enemy.driving) { playSound('drive' + index, 0.8); } // reuse drilling sound at lower rate
      else if (wasDriving && !enemy.driving) { stopSound('drive' + index); }
    });

    // Rover direction control
    if (!game.rover.exploded && !game.lost) {
      if (game.left) {
        // Update rover angle
        game.rover.c--;
        game.rover.a = game.rover.c/30;
        // Save rover euclidean coordinates
        game.rover.x = Math.cos(game.rover.a) * game.planet.r;
        game.rover.y = Math.sin(game.rover.a) * game.planet.r;
        // Reset probe
        game.rover.probeDepth = 0;
      }
      if (game.right) {
        game.rover.c++;
        game.rover.a = game.rover.c/30;
        game.rover.x = Math.cos(game.rover.a) * game.planet.r;
        game.rover.y = Math.sin(game.rover.a) * game.planet.r;
        game.rover.probeDepth = 0;
      }
      if (game.rover.c !== lastC) {
        if (!game.rover.driving) { playSound('driveA', 0.8); game.rover.driving = true; } // reuse drilling sound at lower rate
      }
      else {
        if (game.rover.driving) { stopSound('driveA'); game.rover.driving = false; }
      }

      // Rover probe control
      if (game.shift && !game.won) {
        var collided = false,
            probeX = (game.planet.r - game.rover.probeDepth) * Math.cos(game.rover.a),
            probeY = (game.planet.r - game.rover.probeDepth) * Math.sin(game.rover.a);

        game.obstacles.forEach(function(obstacle){
          if (detectCollision(obstacle, probeX, probeY))
          {
            if (obstacle.resources > 0 && obstacle.broken > 1)
            {
              if(!game.rover.extracting) { playSound('extractA'); game.rover.extracting = true; }
              game.rover.resources++;
              obstacle.resources--;
            }
            else if (game.rover.extracting) { stopSound('extractA'); game.rover.extracting = false; }
            collided = true;
          }
        });

        if (!collided) { 
          if (!game.rover.drilling) { playSound('drillA'); game.rover.drilling = true; }
          game.rover.probeDepth = Math.min(game.rover.probeDepth+1, game.planet.r); 
        }
        else { stopSound('drillA'); game.rover.drilling = false; }
      }
      else if (game.rover.drilling || game.rover.extracting) { 
        if (game.rover.drilling) { stopSound('drillA'); game.rover.drilling = false; }
        if (game.rover.extracting) { stopSound('extractA'); game.rover.extracting = false; }
      }

      // Shockwave control
      if (game.space) {
        if (game.shockCooldown < 1) {
          // Save rover angle
          game.shockAngle = game.rover.a;
          // Reset shockwave
          game.shockCooldown = 100;
          game.shockOrigin.x = game.rover.x;
          game.shockOrigin.y = game.rover.y;
          // Reset obstacle hit detection
          game.obstacles.forEach(function(obstacle) { obstacle.hit = false; });
          // Shockwave!
          playSound('shock');
          for(var i = 0; i < 7; i++)
          {
            var o = game.shockAngle + (i-3)*0.06;   
            game.shocks.push({
              x: game.shockOrigin.x,
              y: game.shockOrigin.y,
              dx: -6*Math.cos(o),
              dy: -6*Math.sin(o),
              a: o,
              t: 0,
              on: true
            });
          }
        }
      }
    }

    // Move shockwave
    if (game.shockCooldown > 20) {
      game.shocks.filter(function(shock) { return shock.on; }).forEach(function(shock) {
        // Update variables
        var distanceUnderground;
        shock.x += shock.dx;
        shock.y += shock.dy;
        if (shock.t > 0) { shock.t--; }
        // Save distance underground
        distanceUnderground = game.planet.r*game.planet.r - (shock.x*shock.x + shock.y*shock.y);
        // Detect obstacle collisions
        game.obstacles.forEach(function(obstacle) {
          if (detectCollision(obstacle, shock.x, shock.y)) {
            var lastBroken = obstacle.broken;
            if (obstacle.breakable) {
              if (!obstacle.hit) {
                obstacle.hit = true;
                obstacle.broken = obstacle.resources > 0 ? Math.min(++obstacle.broken, 2) : ++obstacle.broken;
                if (obstacle.broken > lastBroken) { playSound('frack1'); }
                else { playSound('thud'); }
              }
              shock.on = false;
            }     
            else if (shock.t === 0) {
              // Calculate distance from center of obstacle to path
              var farX = shock.x+10*shock.dx;
              var farY = shock.y+10*shock.dy;
              var numerator = (game.shockOrigin.y-obstacle.y)*(farX-game.shockOrigin.x)-(game.shockOrigin.x-obstacle.x)*(farY-game.shockOrigin.y);
              var denominator = Math.sqrt(Math.pow(farX-game.shockOrigin.x,2) + Math.pow(farY-game.shockOrigin.y,2));

              // Calculate angle to rotate shock
              var theta = Math.PI-Math.PI*(numerator/denominator)/obstacle.r;

              // Rotate shock
              var x0 = shock.dx;
              shock.dx = x0*Math.cos(theta) - shock.dy*Math.sin(theta);
              shock.dy = x0*Math.sin(theta) + shock.dy*Math.cos(theta);

              // Set angle and timeout
              shock.a += theta;
              shock.t = 5;

              // Play sound if first hit on obstacle
              if (!obstacle.hit) {
                obstacle.hit = true;
                playSound('clink');
              }
            }
          }
        });
        // Detect enemy collisions 
        if (distanceUnderground < 10) {
          game.enemies.filter(function(enemy) { return !enemy.exploded; }).forEach(function(enemy, index) {
            var distanceToEnemy = Math.min(Math.abs(enemy.x-shock.x), Math.abs(enemy.y-shock.y));
            if (distanceToEnemy < 50) {
              distanceToEnemy = Math.sqrt(Math.pow(enemy.x-shock.x,2) + Math.pow(enemy.y-shock.y,2));
              if (distanceToEnemy < 20) { explodeEnemy(index); }
            }
          });
        }
        if (distanceUnderground < 0) { shock.on = false; }
      });
      game.shockCooldown--;
    }
    else if (game.shockCooldown > 0) { 
      game.shocks = [];
      game.shockCooldown--; 
    }
    
    // Check game state
    if (game.won || game.lost) {
      if (game.lost && game.rover.driving) { stopSound('driveA'); game.rover.driving = false; }
      if (game.rover.drilling) { stopSound('drillA'); game.rover.drilling = false; }
      if (game.rover.extracting) { stopSound('extractA'); game.rover.extracting = false; }
    }
    if (game.won) {
      if (game.loadTimer > 0) { game.loadTimer-- ; }
      else { game.currentLevel++; game.setup(); };
    }
    else if (game.lost) {
      if (game.loadTimer > 0) { game.loadTimer--; }
      else { game.currentLevel = 0; game.setup(); }
    }
    else {
      // End level if resources are all taken
      if (game.rover.resources + game.totalEnemyResources + game.hippyResources === game.totalResources) {
        if (game.rover.resources > game.totalEnemyResources) {
          game.won = true;
          game.loadTimer = 300;
        }
        else {
          game.lost = true;
          game.loadTimer = 300;
        }
      }
    }

    if (game.playHippy) { playSound('dontFrack'); game.playHippy = false; }

  };

  // Draw game objects
  game.draw = function() {

    // Clear screen
    var gameWidthHalf = game.width/2, gameHeightHalf = game.height/2;
    var backgroundPattern = c.createPattern(backgroundImg, 'repeat');
    c.fillStyle = backgroundPattern;
    c.fillRect(0, 0, game.width, game.height);

    // Translate to planet center
    c.translate(game.planet.x, game.planet.y);

    // Draw HUD
    c.textAlign = 'center';
    c.fillStyle='white';
    c.font='20px Georgia';
    c.fillText('Resources: ' + game.rover.resources, -132, -game.planet.y+25);
    c.fillText('Enemy: ' + game.totalEnemyResources, 120, -game.planet.y+25);
    c.beginPath();
    c.arc(0, -game.planet.y, 25, 0, 2*Math.PI, false);
    c.fillStyle = game.shockCooldown === 0 ? 'green' : 'red';
    c.fill();
    c.lineWidth = 3;
    c.strokeStyle = '#222';
    c.stroke();

    // Draw game.planet
    c.drawImage(moonImg, -game.planet.r-25, -game.planet.r-25, game.planet.d+50, game.planet.d+50);    

    // Draw obstacles
    for (var i = game.obstacles.length - 1; i >= 0; i -= 1) {
      if (game.obstacles[i].resources > 0) { 
        if (game.obstacles[i].broken < resourceBoulderImg.length) {
          drawObstacle(game.obstacles[i], resourceBoulderImg[game.obstacles[i].broken]); 
        }
        else { explodeObstacle(i); }
      }
      else if (game.obstacles[i].breakable) { 
        if (game.obstacles[i].broken < emptyBoulderImg.length) {
          drawObstacle(game.obstacles[i], emptyBoulderImg[game.obstacles[i].broken]); 
        }
        else { explodeObstacle(i); }
      }
      else { drawObstacle(game.obstacles[i], staticBoulderImg); }
      // c.beginPath();
      // c.arc(obstacle.x,obstacle.y, obstacle.r, 0, 2 * Math.PI, false);
      // c.fillStyle = "rgb(" + (256-obstacle.broken*30) + ", " + obstacle.resources*3 + ", 0)";
      // c.fill();
    }

    // Draw NPCs
    game.hippies.forEach(function(hippy){
      c.save()
      c.rotate(hippy.a);
      if (!hippy.dead) { c.drawImage(hippyImg, game.planet.r-1, -13, 60, 26); }
      else { c.drawImage(deadHippyImg, game.planet.r-1, -13, 22, 26); }
      c.restore();
    });

    // Draw enemies
    game.enemies.forEach(function (enemy) {
      c.save()
      c.rotate(enemy.a);
      if (!enemy.exploded) { c.drawImage(enemyImg, game.planet.r-1, -25, 30, 54); }
      else { c.drawImage(deadEnemyRoverImg, game.planet.r-1, -25, 30, 54); }
      c.fillStyle = 'black';
      c.fillRect(game.planet.r - enemy.probeDepth, -2, enemy.probeDepth, 4);
      c.restore();
    });

    // Draw game.explosions
    particles = particles.filter(function(particle){ return particle.scale });
    particles.forEach(function(particle){ particle.update(20); particle.draw(); })

    // Draw rover in ROVER CONTEXT
    c.save()
    c.rotate(game.rover.a);
    if (!game.rover.exploded) { c.drawImage(roverImg, game.planet.r-1, -25, 30, 54); }
    else { c.drawImage(deadRoverImg, game.planet.r-1, -25, 30, 54); }
    // Draw probe
    c.fillStyle = 'black';
    c.fillRect(game.planet.r - game.rover.probeDepth, -2, game.rover.probeDepth, 4);
    // END ROVER CONTEXT
    c.restore();

    // Draw shockwaves
    game.shocks.filter(function(shock){ return shock.on; }).forEach(function (shock) {
      c.save();
      c.translate(shock.x, shock.y);
      c.rotate(shock.a);
      c.fillStyle = 'black';
      c.fillRect(-3, -12, 6, 24);
      c.restore();
    });

    // Draw announcements
    if (game.won) {
      var winMessage = game.currentLevel === 4 ? 'A winner is you.' : 'You win!';
      var winFont = game.currentLevel === 4 ? '60px Georgia' : '72px Georgia';
      c.fillStyle = '#66FF66';
      c.font = winFont;
      c.fillText(winMessage, 0, 0);
      if (!game.endPlayed) { playSound('fanfare'); game.endPlayed = true; }
    }
    else if (game.lost) {
      c.fillStyle = '#FF5555';
      c.font = '72px Georgia';
      c.fillText('You Lose!', 0, 0);
      if (!game.endPlayed) { playSound('boo'); game.endPlayed = true; }
    }
    else if (game.announcement != '' && game.announcementTimer > 0) {
      c.fillStyle = '#FFFF11';
      c.font = '66px Georgia';
      c.fillText(game.announcement, 0, 0);
      game.announcementTimer--;
    }

    // Translate back
    c.translate(-game.planet.x, -game.planet.y);
  };

  // Key handlers
  window.addEventListener('keydown', function(event)
  {
    if (event.keyCode === game.keys.LEFT) { event.preventDefault(); game.left = true; }
    else if (event.keyCode === game.keys.RIGHT) { event.preventDefault(); game.right = true; }
    else if (event.keyCode === game.keys.SHIFT) { event.preventDefault(); game.shift = true; }
    else if (event.keyCode === game.keys.SPACE) { event.preventDefault(); game.space = true; }

    else if (event.keyCode === game.keys.ENTER) {
      // DEBUG level skip
      //game.currentLevel = (game.currentLevel+1)%5;
      if (!game.started) { game.started = true; startGame(); }
    }
  });
  window.addEventListener('keyup', function(event)
  {
    if (event.keyCode === game.keys.LEFT) { event.preventDefault(); game.left = false; }
    else if (event.keyCode === game.keys.RIGHT) { event.preventDefault(); game.right = false; }
    else if (event.keyCode === game.keys.SHIFT) { event.preventDefault(); game.shift = false; }
    else if (event.keyCode === game.keys.SPACE) { event.preventDefault(); game.space = false; }
  });

  // Blur events
  window.onblur = function() {
    //return game.stop();
  };
  window.onfocus = function() {
    //return game.run();
  };

  // Canvas element
  var canvas = document.getElementById("canvas");
  var c = canvas.getContext('2d');

  // Resize event
  var setSize = function() {
    canvas.width = 960;
    canvas.height = window.innerHeight;
    game.width = canvas.width;
    return game.height = canvas.height;
  };
  window.onresize = function(e) { setSize(); };

  // Setup game
  game.setup();

  return {
    game: game
  };
}).call(this);