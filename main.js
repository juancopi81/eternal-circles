// Set default melodies
var MELODY1 = presetMelodies['MELODY1'];
var MELODY2 = presetMelodies['MELODY2'];

// Set variables
let synth;
let size;
let startButton;
let hasStarted = false;
let verticalDiv;
let horizontalDiv;
let tileSize;
let discSize;
const numInterpolations = 8;

// Interpolated melodies
let interpolatedMelodies;
let generatedMelody1 = [];
let generatedMelody2 = [];

// Number of disc to play music
const numDiscs = 4;

// Start array of discs and tiles
let discs = [];
let tiles = [];

// Sampler
let xSamplers = [];
let pSamplers = [];
let samplerPattern;
let samplerParts = [];
let reverbs = [];


function setup() {

	// Position of settings button 
	let settingsIcon = createElement('i');
    settingsIcon.addClass('fa fa-cog fa-2x');
    settingsIcon.position(10, 40);
    settingsIcon.id('modalBtn');

	// Start the samplers

	for (let i = 0; i < numDiscs; i++) {

		pSamplers[i] = new Tone.Sampler({
			urls: {
				A0: "A0.mp3",
				C1: "C1.mp3",
				"D#1": "Ds1.mp3",
				"F#1": "Fs1.mp3",
				A1: "A1.mp3",
				C2: "C2.mp3",
				"D#2": "Ds2.mp3",
				"F#2": "Fs2.mp3",
				A2: "A2.mp3",
				C3: "C3.mp3",
				"D#3": "Ds3.mp3",
				"F#3": "Fs3.mp3",
				A3: "A3.mp3",
				C4: "C4.mp3",
				"D#4": "Ds4.mp3",
				"F#4": "Fs4.mp3",
				A4: "A4.mp3",
				C5: "C5.mp3",
				"D#5": "Ds5.mp3",
				"F#5": "Fs5.mp3",
				A5: "A5.mp3",
				C6: "C6.mp3",
				"D#6": "Ds6.mp3",
				"F#6": "Fs6.mp3",
				A6: "A6.mp3",
				C7: "C7.mp3",
				"D#7": "Ds7.mp3",
				"F#7": "Fs7.mp3",
				A7: "A7.mp3",
				C8: "C8.mp3"
			},
			release: 1,
			baseUrl: "https://tonejs.github.io/audio/salamander/"
		}).toDestination();

		// Create Xylphone Sampler of the melody
	    xSamplers[i] = new Tone.Sampler({
	    	urls: {
	    		'A6': 'A.wav'
	    	},
	    	volume: -20
	    });

	    // Add Sampler to destination
	    reverbs[i] = new Tone.Reverb({decay: 3, wet: 0.1}).toDestination();
		xSamplers[i].connect(reverbs[i]);

		xSamplers[i].toDestination();
	}



	createCanvas(windowWidth, windowHeight);
	
	// Div for vertical and horizontal div of the page
	verticalDiv = windowHeight / 10;
	horizontalDiv = windowWidth / 10;

	// setup slider
    slider = createSlider(60, 140, 98);
    slider.position(width/2 - 40, 40);
    slider.style('width', '80px');
    slider.input(updateBPM);

	// Calculate the tile and disc sizes 
	tileSize = windowHeight / 5;
	discSize = windowWidth / 6;

	background(0);

	// Button to control start/stop of sound and setting of the app
	startButton = createButton('Start');
    startButton.position(windowWidth / 2, windowHeight - 2 * verticalDiv); 
    startButton.mousePressed(startPedal);

	size = 1024;

	// Synth for the pedal with filter and connect to wave form
	pedal = new Tone.PolySynth({
		volume: -20
	});
	let pedalFilter = new Tone.Filter({type: 'lowpass', frequency: 800});
	waveForm = new Tone.Waveform(size);
	pedal.connect(waveForm);
	waveForm.connect(pedalFilter);
	pedalFilter.toDestination();

	strokeWeight(0.2);

	// Space between discs
	let spaceDiscs = 10;

	// Draw the discs
	for (let i = 0; i < numDiscs; i++) {
		let x = verticalDiv * 5 + i * (discSize + spaceDiscs);
		let y = horizontalDiv * 2;
		let r = discSize;
		
		// Add random angles to draw the notes in the discs
		let randomAngleX = Math.floor(Math.random() * (12 - 7)) + 6;
	    let randomAngleY = Math.floor(Math.random() * (12 - 7)) + 6;
		
		// Create disc and add it to array
		let d = new Disc(x, y, r, randomAngleX, randomAngleY);
		discs.push(d);
	}

	// Variable to control left or right tiles
	let side = 0;

	// Draw the tiles
	for (let i = 0; i < numInterpolations; i++) {
		
		// See if left or right side
		if (i >= numInterpolations / 2) {
			side = -1
		} else {
			side = 1
		}

		let x = ((width - tileSize) * Math.floor(i/4)) + ((horizontalDiv / 2) * side);
		let y = 30 + (tileSize * (i % 4));
		let w = tileSize;
		let h = tileSize;

		// Create tile and add it to array
		let t = new Tile(x, y, w, h);
		tiles.push(t);
	}

	// Create parts to each disc using the same sampler
	for (let i = 0; i < discs.length; i++) {

		if (discs[i].instrument == 'Piano') {

			samplerParts[i] = new Tone.Part((time, note) => {
				pSamplers[i].triggerAttackRelease(note, '2n', time);
			}, samplerPattern).start();

			samplerParts[i].loop = true;
			samplerParts[i].loopStart = 0;
			samplerParts[i].loopEnd = '2m';
				
		} else {

			samplerParts[i] = new Tone.Part((time, note) => {
				xSamplers[i].triggerAttackRelease(note, '2n', time);
			}, samplerPattern).start();

			samplerParts[i].loop = true;
			samplerParts[i].loopStart = 0;
			samplerParts[i].loopEnd = '2m';
		}
	}
}

function updateBPM() {
	Tone.Transport.bpm.value = slider.value();
}

function draw() {

	
	// Just paint the lines 
	background(0);

	// Text for the slider
	push();
	fill(255);
	textSize(12);
	textFont('Roboto Mono');
	text('BPM: ' + slider.value(), width/2 - 20, 30);
	pop();

	// Draw pedal wave
	const waveArray = waveForm.getValue();
	const bandSize = (width - 2 * horizontalDiv) / size;

	// Draw wave form of the pedal
	beginShape();

	// Color of the wave form
	fill(255, 10, 10);

	for (let i = 0; i < waveArray.length; i++) {

		curveVertex(bandSize * i + horizontalDiv, map(waveArray[i], -1, 1, height, 0) + 4 * verticalDiv);
  	}

	endShape();

	// Variable to control left or right tiles
	let side = 0;

	// Show created tiles
	push();
	for (let i = 0; i < tiles.length; i++) {
		
		// Draw the tiles
		tiles[i].show()

		// Draw the note when ready
		if (interpolatedMelodies) {
			tiles[i].drawNotes(interpolatedMelodies[i].notes);
		}

		// If mouse is over, change color and dragged when pressed
		if (tiles[i].contains(mouseX, mouseY)) {
			tiles[i].changeStyle(0, 3, tileSize + 1, tileSize + 4);
			tiles[i].update(mouseX, mouseY);
		} else {
			tiles[i].changeStyle(100, 2, tileSize, tileSize);
		}
	}
	pop();

	// Show created discs
	push();

	for (let i = 0; i < discs.length; i++) {
		
		discs[i].show();

		// Check if tile is in the inner circle
		for (let j = 0; j < tiles.length; j++) {
			if (discs[i].contains(tiles[j].x + tileSize / 2, tiles[j].y + tileSize / 2)) {
				discs[i].activate();
				break;
			} else {
				if (!discs[i].releasedInside) {
					discs[i].deactivate();
				}
			}
		}

		if (discs[i].isActive == true) {
			discs[i].drawNotes(discs[i].notes, Tone.Transport.getTicksAtTime());
		}
	}
	pop();
}

function mousePressed() {

	// Check if mouse was pressed over the tile so it can start dragging
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].pressed(mouseX, mouseY);
	}

	// Check if mouse was pressed over the center of the tile, reverse melody
	for (let j = 0; j < discs.length; j++) {
		if (discs[j].containsInner(mouseX, mouseY)) {
			
			// Create a copy of the array
			var reverseNotes = JSON.parse(JSON.stringify(discs[j].notes)).reverse();

			let startStep = 0;

			// Reverse the order of the melody
			for (note of reverseNotes) {
				duration = note.quantizedEndStep - note.quantizedStartStep;
				note.quantizedStartStep = startStep;
				note.quantizedEndStep = startStep + duration;
				startStep = note.quantizedEndStep;
			}

			discs[j].notes = reverseNotes;
			samplerParts[j].clear();

			// Add new melody to Tone
			for (let note of discs[j].notes) {
				let noteName = Tone.Frequency(note.pitch, 'midi').toNote();
				samplerParts[j].at(
					{'16n': note.quantizedStartStep},
					noteName
				);
			}

		}
	}
}

function mouseReleased() {

	for (let j = 0; j < tiles.length; j++) {
		for (let i = 0; i < discs.length; i++) {

			if (discs[i].contains(tiles[j].x + tileSize / 2, tiles[j].y + tileSize / 2)) {
				discs[i].releasedInside = true;
				discs[i].notes = tiles[j].notes;

				for (let note of tiles[j].notes) {
					let noteName = Tone.Frequency(note.pitch, 'midi').toNote();
					samplerParts[i].at(
						{'16n': note.quantizedStartStep},
						noteName
					);
				}
			}
		}

		// See if left or right side
		if (j >= numInterpolations / 2) {
			side = -1
		} else {
			side = 1
		}

		// Send it back to its original position
		tiles[j].x = ((width - tileSize) * Math.floor(j/4)) + ((horizontalDiv / 2) * side);
		tiles[j].y = 30 + (tileSize * (j % 4));
		
		tiles[j].notPressed();
	}
}

function doubleClicked() {
	for (let i = 0; i < discs.length; i++) {
		if (discs[i].contains(mouseX, mouseY)) {
			discs[i].deactivate();
			samplerParts[i].clear();
		}
	}
}

function mouseWheel(event) {
	let delta = event.delta;
	let mVolume = 0;
	for (let i = 0; i < discs.length; i++) {

		if (discs[i].contains(mouseX, mouseY)) {
			mVolume += (delta / 60);
			
			if (mVolume < -60) {
				mVolume = -60;
			} else if (mVolume > 0) {
				mVolume = 0;
			} 

			discs[i].volume = mVolume;

			if (discs[i].instrument == 'Piano') {
				pSamplers[i].volume.value = discs[i].volume;
			} else {
				xSamplers[i].volume.value = discs[i].volume;
			}
		}
	}
}


async function startPedal() {

	hasStarted = !hasStarted;

	if (hasStarted) {

		// Change label of the button
		startButton.html('Stop');

		// Start Tone
		await Tone.start();	

		pedal.triggerAttack(['C1', 'C2', 'G2']);

		Tone.Transport.start();

	} else {
		
		// Change label of the button
		startButton.html('Start');

		pedal.releaseAll();

		Tone.Transport.stop();
	}	
}

// The checkpoint url that contains the training data
let checkPoint = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small';
let melodiesVae = new music_vae.MusicVAE(checkPoint);
let melodiesVaeLoaded = melodiesVae.initialize();

// Interpolate the given melodies 
async function interpolateMelodies(callback) {
	await melodiesVaeLoaded;

	let melody1;
	let melody2;

	// check if using default melodies
	if (generatedMelody1.length === 0 && generatedMelody2.length === 0) {
		melody1 = presetMelodies['MELODY1'];
		melody2 = presetMelodies['MELODY2'];
	} else if (generatedMelody2.length === 0) {
		melody1 = generatedMelody1;
		melody2 = presetMelodies['MELODY2'];
	} else if (generatedMelody1.length === 0) {
		melody1 = presetMelodies['MELODY1'];
		melody2 = generatedMelody2;
	} else {
		melody1 = generatedMelody1;
		melody2 = generatedMelody2;
	}

	// Interpolate melodies using MusicVAE
	interpolatedMelodies = await melodiesVae.interpolate([melody1, melody2], numInterpolations);

	// Callback 
	callback();
}

function melodiesReady() {
	let bStart = document.getElementById('progress');
	bStart.innerHTML = 'START';
	bStart.style.cursor = 'pointer';
	bStart.addEventListener('click', () => {
		document.getElementById('loading').style.display = 'none';
	})
}

interpolateMelodies(melodiesReady);

// If user does not want to use default melodies, magenta generates them
let checkPointRnn = 'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv'
let melodyRnn = new music_rnn.MusicRNN(checkPointRnn);
let melodyRnnLoaded = melodyRnn.initialize();

async function generateMelody(note, duration, temperature, callback) {
	await melodyRnnLoaded;

	let seed = {
		notes: [
			{pitch: Tone.Frequency(note).toMidi(), quantizedStartStep: 0, quantizedEndStep: duration}
		],
		totalQuantizedSteps: duration,
		quantizationInfo: {stepsPerQuarter: 4}
	};

	let steps = 32 - duration;
	let chordProgression = ['Cm7'];

	let result = await melodyRnn.continueSequence(seed, steps, temperature, chordProgression);

	let combined = core.sequences.concatenate([seed, result]);

	callback();

	console.log(combined);

	return combined;
}

function generatingMelodies() {
	document.getElementById('modalSendBtn').disabled = false;
}

// Callback function to use for waiting the response of settings
function melodiesPreparing() {
	if (melodyPrep.classList.contains('melodyPrepClassActive')) {
		melodyPrep.classList.remove('melodyPrepClassActive');
		melodyPrep.classList.add('melodyPrepClass');
	};

	let seedOptions = document.getElementById('seedOptions1');
	let seedOptions2 = document.getElementById('seedOptions2');

	if (seedOptions.classList.contains('optionsShow')) {
		seedOptions.classList.remove('optionsShow');
		seedOptions.classList.add('optionsHide');
	};

	if (seedOptions2.classList.contains('optionsShow')) {
		seedOptions2.classList.remove('optionsShow');
		seedOptions2.classList.add('optionsHide');
	};

}

// Javascript to handel the modal -> setting changed by the user
document.addEventListener('DOMContentLoaded', () => {

	// Get modal div
	var modal = document.getElementById("settingModal");

	// Add event listener when button is clicked
	let modalSendBtn = document.getElementById('modalSendBtn');

	// Get selector of melodyes
	var melody1Selector = document.getElementById('melody1');
	var melody2Selector = document.getElementById('melody2');

	melody1Selector.addEventListener('change', (event) => {
		if (event.target.value == 'rnn') {
			
			let seedOptions = document.getElementById('seedOptions1');

			if (seedOptions.classList.contains('optionsHide')) {
				seedOptions.classList.remove('optionsHide');
				seedOptions.classList.add('optionsShow');
			}

			let mNote = document.getElementById('pitch1').value;
			let mTemperature = parseFloat(document.getElementById('temperature1').value);
			let mDuration = parseInt(document.getElementById('duration1').value);

			modalSendBtn.disabled = true;
			generateMelody(mNote, mDuration, mTemperature, generatingMelodies).then((result) => {
				generatedMelody1 = result;
			});
		}
	});

	melody2Selector.addEventListener('change', (event) => {
		if (event.target.value == 'rnn') {

			let seedOptions = document.getElementById('seedOptions2');

			if (seedOptions.classList.contains('optionsHide')) {
				seedOptions.classList.remove('optionsHide');
				seedOptions.classList.add('optionsShow');
			}

			let mNote = document.getElementById('pitch2').value;
			let mTemperature = parseFloat(document.getElementById('temperature2').value);
			let mDuration = parseInt(document.getElementById('duration2').value);

			modalSendBtn.disabled = true;
			generateMelody(mNote, mDuration, mTemperature, generatingMelodies).then((result) => {
				generatedMelody2 = result;
			});
		}
	});

	// Add event listeners to change also in the seed options
	let mNotes = [];
	let mTemperatures = [];
	let mDurations = [];
	for (let i = 1; i < 3; i++) {
		
		// Get the elements
		mTemperatures[i] = document.getElementById('temperature' + i);
		mNotes[i] = document.getElementById('pitch' + i);
		mDurations[i] = document.getElementById('duration' + i);


		// Add listeners to each event and generate melodies
		mTemperatures[i].addEventListener('change', (event) => {
			modalSendBtn.disabled = true;
			console.log(mNotes[i].value, parseInt(mDurations[i].value), parseFloat(mTemperatures[i].value));
			generateMelody(mNotes[i].value, parseInt(mDurations[i].value), parseFloat(mTemperatures[i].value), generatingMelodies).then((result) => {
				if (i === 1) {
					generatedMelody1 = result;
				} else {
					generatedMelody2 = result;
				}
			});
		});

		mNotes[i].addEventListener('change', (event) => {
			modalSendBtn.disabled = true;
			generateMelody(mNotes[i].value, parseInt(mDurations[i].value), parseFloat(mTemperatures[i].value), generatingMelodies).then((result) => {
				if (i === 1) {
					generatedMelody1 = result;
				} else {
					generatedMelody2 = result;
				}
			});
		}); 

		mDurations[i].addEventListener('change', (event) => {
			modalSendBtn.disabled = true;
			generateMelody(mNotes[i].value, parseInt(mDurations[i].value), parseFloat(mTemperatures[i].value), generatingMelodies).then((result) => {
				if (i === 1) {
					generatedMelody1 = result;
				} else {
					generatedMelody2 = result;
				}
			});
		});  
	}

	// When button is clicked show loading message and process the request
	modalSendBtn.addEventListener('mousedown', () => {

		let melodyPrep = document.getElementById('melodyPrep');

		document.body.className = 'waiting';

		if (melodyPrep.classList.contains('melodyPrepClass')) {
			melodyPrep.classList.remove('melodyPrepClass');
			melodyPrep.classList.add('melodyPrepClassActive');
		}
	});

	modalSendBtn.addEventListener('click', () => {

		// Clear old melodies if using the defaults
		if (document.getElementById('melody1').value == 'default') {
			generatedMelody1 = [];
		}

		if (document.getElementById('melody2').value == 'default') {
			generatedMelody2 = [];
		}

		// Loop over the values assigned to the discs
		for (let i = 1; i < discs.length + 1; i++) {
			discs[i - 1].volume = document.getElementById('volumeDisc' + i).value;
			discs[i - 1].instrument = document.getElementById('instrument' + i).value;
			discs[i - 1].deactivate();
			samplerParts[i - 1].clear();

			// Update instruments and volume of the discs
			if (discs[i - 1].instrument == 'Piano') {
				pSamplers[i - 1].volume.value = discs[i - 1].volume;

				samplerParts[i - 1] = new Tone.Part((time, note) => {
					pSamplers[i - 1].triggerAttackRelease(note, '2n', time);
				}, samplerPattern).start();

				samplerParts[i - 1].loop = true;
				samplerParts[i - 1].loopStart = 0;
				samplerParts[i - 1].loopEnd = '2m';

			} else {
				xSamplers[i - 1].volume.value = discs[i - 1].volume;

					samplerParts[i - 1] = new Tone.Part((time, note) => {
					xSamplers[i - 1].triggerAttackRelease(note, '2n', time);
				}, samplerPattern).start();

				samplerParts[i - 1].loop = true;
				samplerParts[i - 1].loopStart = 0;
				samplerParts[i - 1].loopEnd = '2m';
			}	
		}

		callInterpolate();

		melody1Selector.value = 'default';
		melody2Selector.value = 'default';

		for (let i = 1; i < 3; i++) {
			document.getElementById('temperature' + i).value = '0.9';
		};

		document.getElementById('duration1').value = '4';
		document.getElementById('duration2').value = '2';

		document.getElementById('pitch1').value = 'C4';
		document.getElementById('pitch2').value = 'G5';

	});

	function callInterpolate() {

		let result = interpolateMelodies(melodiesPreparing).then(() => {
			document.body.className = '';
			modal.style.display = 'none';
		});
	};

});