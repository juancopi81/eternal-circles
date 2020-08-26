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

let interpolatedMelodies;

// Number of disc to play music
const numDiscs = 4;

// Start array of discs and tiles
let discs = [];
let tiles = [];

// Sampler
let mSampler;
let samplerPattern;
let samplerParts = [];


function setup() {

	const sampler = new Tone.Sampler({
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

	// Button to control start/stop of sound 
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

	// Create Sampler of the melody
    mSampler = new Tone.Sampler({
    	urls: {
    		'A6': 'A.wav'
    	},
    	volume: -20
    });

    // Add Sampler to destination
    let reverb = new Tone.Reverb({decay: 3, wet: 0.1}).toDestination();
	mSampler.connect(reverb);

	mSampler.toDestination();

	// Create parts to each disc using the same sampler
	for (let i = 0; i < discs.length; i++) {

		samplerParts[i] = new Tone.Part((time, note) => {
			sampler.triggerAttackRelease(note, '2n', time);
		}, samplerPattern).start();

		samplerParts[i].loop = true;
		samplerParts[i].loopStart = 0;
		samplerParts[i].loopEnd = '2m';
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
async function interpolateMelodies() {
	await melodiesVaeLoaded;
	interpolatedMelodies = await melodiesVae.interpolate([presetMelodies['MELODY1'], presetMelodies['MELODY2']], numInterpolations);
}

interpolateMelodies();