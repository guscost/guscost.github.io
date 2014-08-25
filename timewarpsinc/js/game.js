var game = (function(){

	var g = game || {};

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

	var startGame = function() {
		document.getElementById('audio').play();
		game.run();
	};

	// Update game logic
	var update = function(dt) {

		// Step size
		var stepSize = dt*200;

		// Check for stage end
		var stage = data.storyboard[data.currentStage];
		if (data.setupStage) { stage.setup(); data.setupStage = false; }
		if (stage.isDone()) { stage.done(); data.setupStage = true; }

		// Player movement variables
		var playerX = data.player.x;
		var playerY = data.player.y + data.player.dy;

		// Move if no messages are showing
		if (!data.messageShowing) {
			if (data.left) { playerX -= stepSize; data.player.leftRight = 0; }
			if (data.right) { playerX += stepSize; data.player.leftRight = 1; }
			var playerGround = stage.ground[Math.floor(playerX/120)];
			if (playerY === playerGround && (data.left || data.right)) { data.walkCounter++; }		
		}

		// Player falls
		if (playerY < playerGround) {
			data.player.dy += 0.5;
		}
		if (playerY === playerGround) {
			if (data.space) { game.playSound('jump'); data.player.dy = -6; }
		}
		if (playerY > playerGround) {
			if (playerY - playerGround < 30) {
				playerY = playerGround;
				data.player.dy = 0;
			}
			else {
				playerX = data.player.x;
				playerY = data.player.y;
			}
		}

		// Move player
		data.player.x = playerX;
		data.player.y = playerY;

		// Limit movement
		if (data.player.y > 640) { data.player.y = 640; }
		if (data.player.x < 0) { data.player.x = 0; }
		if (data.player.x > 960) { data.player.x = 960; }

		// Projected next X and Y coordinates for projectile
		var projectedX = data.projectile.x;
		var projectedY = data.projectile.y;
		if (Math.abs(data.projectile.dx) > .000001) { projectedX += data.projectile.dx; }
		if (Math.abs(data.projectile.dy) > .000001) { projectedY += data.projectile.dy; }		

		// Throw projectile
		if (data.shift) {
			data.projectile.power = Math.max(Math.min(++data.projectile.power, 100), 50);
		}
		if (data.projectile.thrown && data.projectile.power) {
			projectedX = data.player.x;
			projectedY = data.player.y - 60;
			data.projectile.dx = -.09*data.projectile.power + data.player.leftRight*.18*data.projectile.power;
			data.projectile.dy = -.09*data.projectile.power;
			data.projectile.power = 0;
		}

		var didCollide = false;
		stage.objects.forEach(function(object, index) {
			// Collide projectile with objects
			if (object.solid && Math.abs(projectedX - object.x) < object.halfWidth && Math.abs(projectedY - object.y) < object.halfHeight) {
				if (projectedX > object.x-object.halfWidth+6 && projectedX < object.x+object.halfWidth+6) { 
					if (object.isWarp) { game.playSound('warp'); stage.warp(); }
					else {
						projectedY = data.projectile.y; 
						object.dy = data.projectile.dy < 0 ? data.projectile.dy * .4/object.mass : 0;
						data.projectile.dy = data.projectile.dy * -.8; 
						didCollide = true;
					}
				}
				if (projectedY > object.y-object.halfHeight && projectedY < object.y+object.halfHeight) {
					if (object.isWarp) { game.playSound('warp'); stage.warp(); }
					else {
						if (!object.stable) {
							var oldHalfHeight = object.halfHeight;
							object.y = object.y + object.halfHeight - object.halfWidth;
							object.x = data.projectile.dx > 0 ? object.x + object.halfHeight : object.x - object.halfHeight;
							object.halfHeight = object.halfWidth;
							object.halfWidth = oldHalfHeight;
							object.stable = true;
							object.topple();
						}
						projectedX = data.projectile.x; 
						object.dx = data.projectile.dx * 1/object.mass;
						data.projectile.dx = data.projectile.dx * -1 * object.mass/200; 
						didCollide = true;
					}
				}
				
			}

			// move objects
			if(Math.abs(object.dx) > 0.0001 || Math.abs(object.dy) > 0.0001) {
				object.x += object.dx;
				object.y += object.dy;
				object.dx *= 0.8;
				object.dy *= 0.8;
			}
		});

		if (didCollide && !data.tickTimer) {  
			game.playSound('tick');
			data.tickTimer = 3;
		}
		else {
			data.tickTimer = Math.max(--data.tickTimer, 0);
		}

		// Collided
		var projectedGround = stage.ground[Math.floor(projectedX/120)];
		if (projectedY > projectedGround) { 			
			if (projectedY - projectedGround < 12 || projectedX === data.projectile.x) {
				data.projectile.dy = data.projectile.dy < 3 ? data.projectile.dy * -0.4 : 0;		
				data.projectile.dx = data.projectile.dx * 0.6;
				projectedY = projectedGround;
			}
		}

		// Move projectile
		data.projectile.x = projectedX;
		data.projectile.y = projectedY;	

		// Acceleration due to gravity
		if (projectedY !== projectedGround && Math.abs(data.projectile.dy) < 0.5) { data.projectile.y -= 1; }
		data.projectile.dy += 0.3;

		// sound code
		if (data.playHippy) { game.playSound('dontFrack'); data.playHippy = false; }

		// Sprite counter
		data.drawCounter++;
	};

	// Step gameplay
	var step = function() {
		var dt, now;
		now = Date.now();
		dt = (now - this.last_step) / 1000;
		this.last_step = now;
		update(dt);
		game.draw();
		return;
	};

	// Run/resume gameplay
	g.run = function() {
		var s;
		if (this.running) {
			return;
		}
		this.running = true;
		s = (function(_this) {
			return function() {
				step();
				return _this.frameRequest = requestAnimationFrame(s);
			};
		})(this);
		this.last_step = Date.now();
		return this.frameRequest = requestAnimationFrame(s);
	};

	// Pause gameplay
	g.stop = function() {
		if (this.frameRequest) {
			cancelAnimationFrame(this.frameRequest);
		}
		this.frameRequest = null;
		return this.running = false;
	};

	// Public methods
	g.goToStage = function(name) {
		console.log(data.currentStage + ' done.');
		data.storyboard[name].setup();
		data.currentStage = name;
	};

	// Key handlers
	window.addEventListener('keydown', function(event) {
		if (event.keyCode === data.keys.LEFT) { event.preventDefault(); data.left = true; }
		else if (event.keyCode === data.keys.RIGHT) { event.preventDefault(); data.right = true; }
		else if (event.keyCode === data.keys.UP) { event.preventDefault(); data.up = true; }
		else if (event.keyCode === data.keys.DOWN) { event.preventDefault(); data.down = true; }
		else if (event.keyCode === data.keys.SPACE) { event.preventDefault(); data.space = true; }

		else if (event.keyCode === data.keys.SHIFT) { 
			event.preventDefault(); 
			data.shift = true; 
			data.projectile.thrown = false;
		}

		else if (event.keyCode === data.keys.ENTER) {
			// show next message
			if(data.storyboard[data.currentStage].messages.length > data.currentMessage) {
				game.playSound('tick');
				var messageObject = data.storyboard[data.currentStage].messages[++data.currentMessage];
				if (messageObject !== undefined && messageObject.s !== undefined) { messageObject.s(); }
			}
		}
	});
	window.addEventListener('keyup', function(event) {
		if (event.keyCode === data.keys.LEFT) { event.preventDefault(); data.left = false; }
		else if (event.keyCode === data.keys.RIGHT) { event.preventDefault(); data.right = false; }
		else if (event.keyCode === data.keys.UP) { event.preventDefault(); data.up = false; }
		else if (event.keyCode === data.keys.DOWN) { event.preventDefault(); data.down = false; }
		else if (event.keyCode === data.keys.SPACE) { event.preventDefault(); data.space = false; }
		else if (event.keyCode === data.keys.SHIFT) { 
			event.preventDefault(); 
			data.shift = false; 
			if (data.player.present) {
				data.projectile.thrown = true;
				game.playSound('throw');
			}
		}
	});

	// Blur events
	window.onblur = function() {
		//return data.stop();
	};
	window.onfocus = function() {
		//return data.run();
	};

	// Canvas element
	var canvas = document.getElementById('canvas');
	g.ctx = canvas.getContext('2d');

	canvas.addEventListener('click', function(evt) {
		var rect = canvas.getBoundingClientRect();
		var mousePos = { x: evt.clientX - rect.left, y: evt.clientY - rect.top }
		var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
		console.log(message);
	}, false);

	// Set screen size
	canvas.width = data.width;
	canvas.height = data.height;

	// Start game
	startGame();

	// Return public variables
	return g;

}());