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

function setup() {

	createCanvas(windowWidth, windowHeight);
	
	// Div for vertical and horizontal div of the page
	verticalDiv = windowHeight / 10;
	horizontalDiv = windowWidth / 10;

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
		
		// Create disc and add it to array
		let d = new Disc(x, y, r);
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

}

function draw() {

	
	// Just paint the lines 
	background(0);

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
			console.log(Tone.Transport.getTicksAtTime());
			discs[i].drawNotes(discs[i].notes, Tone.Transport.getTicksAtTime());
		}
	}
	pop();
}

function mousePressed() {
	for (let i = 0; i < tiles.length; i++) {
		tiles[i].pressed(mouseX, mouseY);
	}
}

function mouseReleased() {

	for (let j = 0; j < tiles.length; j++) {
		for (let i = 0; i < discs.length; i++) {

			if (discs[i].contains(tiles[j].x + tileSize / 2, tiles[j].y + tileSize / 2)) {
				discs[i].releasedInside = true;
				discs[i].notes = tiles[j].notes;
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