const MIDI_START_NOTE = 21;
const NUM_STEPS = 32;
const NUM_NOTES = 88;

let ht = 0;

// Class for the disc 
class Disc {

	constructor(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	}

	show() {

		fill(255, 236, 204, 30);
		ellipse(this.x, this.y, this.r);
		fill(0);
		ellipse(this.x, this.y, this.r / 4);
	}
}

// Melody tiles and its melodies
class Tile {

	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.dragging = false; // Is the object being dragged?

		this.notes = [];
		this.brightness = 100;

		this.strokeWeight = 2;

		// Offsets to drag the object
		this.offsetX = 0;
		this.offsetY = 0;
	}

	// When hover mouse
	changeStyle(brightness, strokeWeight, newW, newH) {
		this.brightness = brightness;
		this.strokeWeight = strokeWeight;
		this.w = newW;
		this.h = newH;
	}

	update(px, py) {
		if (this.dragging) {
			this.x = px + this.offsetX;
			this.y = py + this.offsetY;
		} 
	}

	show() {
		
		// Stroke for the melody tiles
		stroke(135, 0, 88);
		strokeWeight(this.strokeWeight);

		fill(50, this.brightness);

		rect(this.x, this.y, this.w, this.h);
	}

	// Function to draw the melodies, taken from: 
	// https://medium.com/@torinblankensmith/melody-mixer-using-deeplearn-js-to-mix-melodies-in-the-browser-8ad5b42b4d0b
	drawNotes(notes) {
		
		push();
		translate(this.x, this.y);
		var cellWidth = this.w / NUM_STEPS;
		var cellHeigth = this.h / NUM_NOTES;

		this.notes = notes;

		ht = this.h;

		this.notes.forEach(function(note) {
			var emptyNoteSpacer = 2;
			rect(emptyNoteSpacer + cellWidth * note.quantizedStartStep, ht - cellHeigth * (note.pitch - MIDI_START_NOTE),
				cellWidth * (note.quantizedEndStep - note.quantizedStartStep) - emptyNoteSpacer, cellHeigth);
		}); 
		pop();
	}

	// Check if mouse is over tile
	contains(px, py) {
		if ((px > this.x) && (px < this.x + this.w) && (py > this.y) && (py < this.y + this.h)) {
			return true;
		} else {
			return false;
		}
	}

	// Check if mouse is pressed and over the tile
	pressed(px, py) {
		if ((px > this.x) && (px < this.x + this.w) && (py > this.y) && (py < this.y + this.h)) {
			this.dragging = true;
			this.offsetX = this.x - px;
			this.offsetY = this.y - py;
		}
	}

	notPressed() {
		this.dragging = false;
		this.offsetX = 0;
		this.offsetY = 0;
	}

}