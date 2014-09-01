var game = (function() {
	var g = game || {};

	// Audio variables
	var myAudioContext;
	var mySources = {};
	var myBuffers = {};

	// Set up audio context
	if ('AudioContext' in window) {
		myAudioContext = new AudioContext();
	} else if ('webkitAudioContext' in window) {
		myAudioContext = new webkitAudioContext();
	} else {
		alert('Your browser does not support Web Audio API. Sound effects will not work.');
	}

	// Load Base64 encoded audio into buffer
	function loadSound(data, name) {
		if (myAudioContext !== undefined) {
			var soundArrayBuff = Base64Binary.decodeArrayBuffer(data);
			myAudioContext.decodeAudioData(soundArrayBuff, function(audioData) {
				myBuffers[name] = audioData;
			});
		}
	}

	// Play a sound from a decoded buffer
	g.playSound = function (sound, playbackRate) {
		if (myAudioContext !== undefined) {
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
	}

	// Play a sound from a decoded buffer
	g.stopSound = function (sound) {
		if ('AudioContext' in window) {
			mySources[sound].stop(0);
		} else if ('webkitAudioContext' in window) {
			mySources[sound].noteOff(0);
		} 
	}

	// Load sound effects
	if (myAudioContext !== undefined) {
		loadSound(humSound, 'hum');
		loadSound(warpSound, 'warp');
		loadSound(tickSound, 'tick');
		loadSound(throwSound, 'throw');
		loadSound(jumpSound, 'jump');
	}

	return g;
}());