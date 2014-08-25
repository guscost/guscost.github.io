var game = (function() {

	var g = game || {};

	// Dialog messages
	var drawMessage = function(m) {
		var text = m.t;
		var words = text.split(' ');
		var lines = [''];
		var lineNum = 0;
		while(words.length)
		{
			var word = words.shift();
			var line = lines[lineNum] || '';
			if (line.length + word.length < 41) {
				line += word + ' ';
			}
			else {
				lineNum++;
				line = word + ' ';
			}
			lines[lineNum] = line;
		}
		game.ctx.save();
		game.ctx.translate(m.x, m.y);
		game.ctx.fillStyle = '#555555';
		game.ctx.strokeStyle='#AAAAAA';
		game.ctx.fillRect(0, 0, 354, 13+lines.length*16);
		game.ctx.strokeRect(0, 0, 354, 13+lines.length*16);
		game.ctx.fillStyle = '#EEEEEE';
		game.ctx.font = '14px Courier';
		lines.forEach(function(line, index) {
			game.ctx.fillText(line, 8, 18+index*16);
		});
		game.ctx.restore();
	};

	// Rain
	var raindrops = [];
	var getRaindrop = function(b) {
		return {
			x: Math.floor(Math.random()*data.width),
			y: Math.floor(Math.random()*data.height),
			timer: Math.floor(Math.random()*3) + 2
		};
	};
	for (var i = 0; i < 120; i++) { raindrops[i] = getRaindrop(); }
	var drawRain = function() {
		game.ctx.fillStyle = '#777777';
		for(var i = 0; i < 120; i++) {
			if (raindrops[i].timer === 0) {
				raindrops[i] = getRaindrop();
			}
			else {
				raindrops[i].timer--;
				raindrops[i].y += 8;
			}
			game.ctx.fillRect(raindrops[i].x, raindrops[i].y, 3, 7);
		}
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
			game.ctx.save();
			game.ctx.translate(this.x, this.y);
			game.ctx.scale(this.scale, this.scale);
			game.ctx.beginPath();
			game.ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
			game.ctx.closePath();
			game.ctx.fillStyle = this.fillColor;
			game.ctx.fill();
			//game.ctx.lineWidth = this.strokeWidth;
			//game.ctx.strokeStyle = this.strokeColor;
			//game.ctx.stroke();
			game.ctx.restore();
		};
	}

	// public methods
	g.drawParticles = function(x,y,fill) {
		var minSize = 3;
		var maxSize = 12;
		var count = 3;
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
	};

	// Generic objects
	var drawObject = function(object, sprite) {
		game.ctx.drawImage(
			sprite, 
			object.x - object.r, 
			object.y - object.r, 
			object.r*2, 
			object.r*2
		);
	};

	// Draw game objects
	var warpColors = [
		'5159FF',
		'232AFC',
		'1113FF'
	];
	g.draw = function() {

		// Constants for update loop
		var ctx = game.ctx;
		var gameWidthHalf = data.width/2, gameHeightHalf = data.height/2;
		//var backgroundPattern = ctx.createPattern(data.skyImg, 'repeat');

		// Game stage
		var stage = data.storyboard[data.currentStage];

		// Clear screen
		ctx.clearRect(0, 0, data.width, data.height);
		//ctx.fillStyle = backgroundPattern;
		//ctx.fillRect(0, 0, data.width, data.height);

		if (stage.settings.past) { ctx.globalAlpha = 0.7; }
		else { ctx.globalAlpha = 1.0; }

		// If rain is outside
		if (!stage.settings.past && stage.settings.indoors) { drawRain(); }

		// Draw background
		if (stage.settings.background) {
			ctx.drawImage(data.backgroundImgs[stage.settings.background], 0, 0, 960, 640);
		}

		// Draw ground
		ctx.fillStyle = '#333333';
		stage.ground.forEach(function(value, index) {
			ctx.fillRect(index*120, value, 120, 40);
		});

		// Draw accelerator
		ctx.save();
		ctx.translate(stage.accelerator.x, stage.accelerator.y);
		ctx.drawImage(data.acceleratorImg, -20, -32, 40, 64);
		ctx.restore();

		// Draw objects
		var hasWarp = false;
		stage.objects.forEach(function(object){
			if (object.isWarp) { hasWarp = true; }
			ctx.save();
			ctx.translate(object.x, object.y);
			if (object.image) {
				ctx.drawImage(object.image, -object.halfWidth, -object.halfHeight, object.halfWidth*2, object.halfHeight*2);
			}
			else {
				ctx.fillStyle = object.isWarp ? warpColors[Math.floor(Math.random()*3)] : '#FF0000';
				ctx.fillRect(-object.halfWidth, -object.halfHeight, object.halfWidth*2, object.halfHeight*2);
			}
			ctx.restore();
		});
		if (hasWarp) {
			if(!data.humming) { data.humming = true; game.playSound('hum'); }
			game.drawParticles(stage.accelerator.x, stage.accelerator.y, '#C2CFF2');
		}
		else {
			if (data.humming) { data.humming = false; game.stopSound('hum'); }
		}

		// Draw particles
		if (!stage.settings.past) {
			particles = particles.filter(function(particle){ return particle.scale });
			particles.forEach(function(particle){ particle.update(20); particle.draw(); });
		}

		// Draw player
		if (data.player.present) {
			ctx.save();
			ctx.translate(data.player.x, data.player.y);
			if (!data.player.leftRight) { ctx.scale(-1, 1); }
			ctx.drawImage(data.playerImgs[Math.floor(data.walkCounter/10)%2], -28, -96, 56, 112); 
			ctx.restore();
		}

		// Draw npcs
		stage.npcs.forEach(function(npc){
			ctx.save();
			ctx.translate(npc.x, npc.y);
			if (!npc.dead) {
				if (npc.x > data.player.x) { ctx.scale(-1, 1); }
				ctx.drawImage(data.npcImgs[0], -28, -96, 56, 112); 
			}
			ctx.restore();
		});

		// Draw projectile
		ctx.save();
		ctx.translate(data.projectile.x, data.projectile.y);
		ctx.fillStyle = '#660009';
		ctx.fillRect(-8,-8,16,16);
		//ctx.drawImage(data.projectileImgs[0], -8, -8, 16, 16);
		ctx.restore();

		// Draw foregrounds

		// Rain is in front of player if outdoors
		if (!stage.settings.past && !stage.settings.indoors) { drawRain(); }

		// ...

		// Draw shockwaves
		//data.shocks.filter(function(shock){ return shock.on; }).forEach(function (shock) {});

		// Show messages
		if (data.currentMessage < stage.messages.length) {
			drawMessage(stage.messages[data.currentMessage]);  	
			data.messageShowing = true;
		}  
		else {
			data.messageShowing = false;
		}

		// Draw film grain
		if (stage.settings.past) {
			ctx.fillStyle = '#444444';
			for (var i = 0; i < 3; i++) {
				ctx.fillRect(
					49,
					Math.floor(Math.random()*640),
					3 + Math.floor(Math.random()),
					Math.floor(Math.random()*60)
				);
				ctx.fillRect(
					86,
					Math.floor(Math.random()*640),
					2 + Math.floor(Math.random()),
					Math.floor(Math.random()*50)
				);
				ctx.fillRect(
					910,
					Math.floor(Math.random()*640),
					3 + Math.floor(Math.random()*2),
					Math.floor(Math.random()*80)
				);
			} 
		}

		// Show announcements
		if (data.announcement != '' && data.announcementTimer > 0) {
			ctx.fillStyle = '#FFFF11';
			ctx.strokeStyle='#BBBBBB';
			ctx.font = '66px Georgia';
			ctx.strokeText(data.announcement, 0, 0);
			ctx.fillText(data.announcement, 0, 0);
			data.announcementTimer--;
		}

		// Translate back
		//ctx.translate(-data.planet.x, -data.planet.y);
	};

	return g;
}());