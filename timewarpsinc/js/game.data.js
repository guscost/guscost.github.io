var data = (function() {

	var noop = function() { };

	var d = {
		width: 960,
		height: 640,
		player: { x: 100, y: 600, dy: 0, present: true },
		projectile: { x: 9999, y: 9999, dx: 0, dy: 0, thrown: false, power: 0, type: 'golf' },
		objects: [],    
		messages: [],
		messageShowing: false,
		started: false,
		setupStage: true,
		tickTimer: 0,
		drawCounter: 0,
		walkCounter: 0,
		messageCounter: 0,
		humming: false,
		keys: {
			SHIFT: 16,
			ENTER: 13,
			ESC: 27,
			SPACE: 32,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40
		}
	};

	// Sprites
	d.raindropImg = new Image();
	d.acceleratorImg = new Image();
	d.pedestalImg = new Image();
	d.playerImgs = [new Image(), new Image()];
	d.projectileImgs = [new Image()];
	d.npcImgs = [new Image()];
	d.backgroundImgs = { 
		'exterior_1': new Image(),
		'interior_1': new Image(),
		'interior_2': new Image()
	};

	// Image files
	d.raindropImg.src = 'img/raindrop.png';
	d.acceleratorImg.src = 'img/accelerator.png';
	d.pedestalImg.src = 'img/pedestal.png';
	d.playerImgs[0].src = 'img/player_1.png';
	d.playerImgs[1].src = 'img/player_2.png';
	d.projectileImgs[0].src = 'img/projectile_1.png'
	d.npcImgs[0].src = 'img/npc_1.png';
	for(var key in d.backgroundImgs) {
		d.backgroundImgs[key].src = 'img/' + key + '.png';
	}

	// Storyboard data
	d.currentStage = 'intro_1';
	d.currentMessage = 0;
	d.storyboard = {
		'intro_1': new (function() {
			this.setup = noop;
			this.done = function() { game.goToStage('intro_2'); };
			this.isDone = function() { return d.player.x > 400 && d.player.x < 420 && d.player.y === 600; };
			this.settings = { control: true, indoors: false, past: false, background: 'exterior_1' };
			this.npcs = [{ x: 560, y: 600 }];
			this.ground = [600,600,600,600,600,600,600,600];
			this.objects = [];
			this.accelerator = { x: 0, y: 999 };
			this.messages = [{
				t: "Please come in.",
				x: 360, y: 320
			}];
		})(),
		'intro_2': new (function() {
			var that = this;
			this.setup = function() { d.currentMessage = 0; d.player.x = 280; d.player.y = 600; };
			this.done = function() { d.currentMessage = 0; d.player.x = 100; d.player.y = 600; game.goToStage('level_1') };
			this.isDone = function() { return d.player.x === 960; };
			this.settings = { control: false, indoors: true, past: false, background: 'interior_1' };
			this.npcs = [{ x: 560, y: 600 }];
			this.ground = [600,600,600,600,600,600,600,600];
			this.objects = [];
			this.accelerator = { x: 0, y: 999 };
			this.messages = [{
				t: "Have you used our service before?",
				x: 100, y: 320
			},{
				t: "No.",
				x: 360, y: 320
			},{
				t: "OK, in that case I'll briefly describe what we're going to do.",
				x: 100, y: 320
			},{
				s: function() { 
					that.accelerator.x = 410;
					that.accelerator.y = 514;
					game.playSound('throw');
					game.drawParticles(that.accelerator.x, that.accelerator.y, '#FFFFFF');
				},
				t: "This is a superluminal baryon accelerator.",
				x: 100, y: 320
			},{
				t: "It makes what we call \"gates\".",
				x: 100, y: 320
			},{
				t: "Basically, what these gates do is accelerate projectiles to faster than light speed, thereby sending them back in time.",
				x: 100, y: 320
			},{
				t: "There are a lot of scientific details involved, but what happens is that each projectile arrives in the past with the same momentum as when it first hit the gate.",
				x: 100, y: 320
			},{
				t: "Unfortunately due to the superluminal speeds, radio signals can't get through, which means no drones.",
				x: 100, y: 320
			},{
				t: "For the same reason any living creatures cannot survive the transport.",
				x: 100, y: 320
			},{
				t: "What we can do is send tiny amounts of matter through. By measuring quantum flibbetyjibbets we can map out the past environment in the immediate vicinity.",
				x: 100, y: 320
			},{
				t: "This way, we can model what happened in the past after sending a projectile through, and come up with a strategy to achieve the intended result.",
				x: 100, y: 320
			},{
				t: "TimeWarps Inc. assumes no liability for any damage to the fabric of spacetime that might occur as a result.",
				x: 100, y: 320
			},{
				t: "So what do you need fixed?",
				x: 100, y: 320
			},{
				t: "We had a break-in about 5 years back. Most of the stolen items were replaceable, but there was this one thing.",
				x: 360, y: 320
			},{
				t: "I really feel terrible about losing it. What I'd like is to convince my former self to take better care of it.",
				x: 360, y: 320
			},{
				t: "It used to be kept in the room to the right.",
				x: 360, y: 320
			}]
		})(),
		'level_1': new (function() {
			var that = this;
			this.setup = function() { d.player.present = true; };
			this.warp = function() { game.goToStage('level_1_past'); }
			this.done = function() { game.goToStage('level_2'); };
			this.isDone = function() { return false; };
			this.settings = { control: false, indoors: true, past: false, background: 'interior_2' };
			this.npcs = [{ x: 50, y: 600 }];
			this.objects = [{
				image: null,
				x: 300,
				y: 480, 
				dx: 0,
				dy: 0,
				halfWidth: 4,
				halfHeight: 15.5,
				isWarp: false,
				stable: true,
				solid: true,
				mass: 100
			},{
				image: null,
				x: 594,
				y: 471, 
				dx: 0,
				dy: 0,
				halfWidth: 16,
				halfHeight: 8,
				stable: true,
				solid: true,
				isWarp: false,
				mass: 10
			}];
			this.ground = [600,600,600,600,600,600,600,600];
			this.accelerator = { x: 200, y: 570 };
			this.messages = [{
				t: "We need to find something that was in a consistent location at the time of the flood.",
				x: 100, y: 320
			},{
				t: "Beep beep boop.",
				x: 100, y: 320
			},{
				s: function() { that.objects[0].isWarp = true; },
				t: "OK, this will do.",
				x: 100, y: 320
			},{
				t: "I'll throw projectiles through this gate by pressing the \"Shift\" key.",
				x: 100, y: 320
			},{
				t: "I can throw the projectiles farther by holding down the \"Shift\" key longer.",
				x: 100, y: 320
			}]
		})(),
		'level_1_past': new (function() {
			var that = this;
			this.timer = 0;
			this.setup = function() { that.timer = 140; d.player.present = false; };
			this.warp = noop;
			this.done = function() { d.projectile.x = 999; game.goToStage('level_1'); };
			this.isDone = function() { that.timer--; return !that.timer; };
			this.settings = { control: false, indoors: true, past: true, background: 'interior_2' };
			this.npcs = [];
			this.objects = [{
				image: null,
				x: 300,
				y: 480, 
				dx: 0,
				dy: 0,
				halfWidth: 4,
				halfHeight: 15.5,
				stable: true,
				solid: false,
				isWarp: false,
				mass: 100
			},{
				image: null,
				x: 580,
				y: 463, 
				dx: 0,
				dy: 0,
				halfWidth: 8,
				halfHeight: 16,
				stable: false,
				topple: function() { 
					that.objects[1].solid = false;
					data.storyboard['level_1'].objects[1].isWarp = true; 
					data.storyboard['level_1'].messages.push({
						t: "Aha, we've lined up the past and present and opened another gate. Let's try this one out.",
						x: 100, y: 320
					});
				},
				solid: true,
				isWarp: false,
				mass: 10
			},{
				image: d.pedestalImg,
				x: 836,
				y: 540, 
				dx: 0,
				dy: 0,
				halfWidth: 28,
				halfHeight: 60,
				stable: true,
				solid: false,
				isWarp: false,
				mass: 1000
			},{
				image: null,
				x: 580,
				y: 463, 
				dx: 0,
				dy: 0,
				halfWidth: 8,
				halfHeight: 16,
				stable: false,
				topple: function() { 
					that.objects[1].solid = false;
					data.storyboard['level_1'].objects[1].isWarp = true; 
					data.storyboard['level_1'].messages.push({
						t: "And here it is! I guess I was reminded to put it somewhere safer. This worked great!.",
						x: 50, y: 320
					});
					data.storyboard['level_1'].messages.push({
						t: "That's the easiest paycheck I've ever earned.",
						x: 150, y: 320
					});
					data.storyboard['level_1'].messages.push({
						s: function() { 1=0; },
						t: "THE END",
						x: 300, y: 320
					});
				},
				solid: true,
				isWarp: false,
				mass: 10
			}];
			this.ground = [600,600,600,600,600,600,600,600];
			this.accelerator = { x: 0, y: 999 };
			this.messages = []
		})(),
	};

	return d;
}());