// Preset elodies
const presetMelodies = {
    'MELODY1': { 
        notes: [
        {pitch: Tone.Frequency('A3').toMidi(), quantizedStartStep: 0, quantizedEndStep: 4},
        {pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 4, quantizedEndStep: 6},
        {pitch: Tone.Frequency('E4').toMidi(), quantizedStartStep: 6, quantizedEndStep: 8},
        {pitch: Tone.Frequency('F4').toMidi(), quantizedStartStep: 8, quantizedEndStep: 10}, 
        {pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 10, quantizedEndStep: 12},
        {pitch: Tone.Frequency('E4').toMidi(), quantizedStartStep: 12, quantizedEndStep: 16},
        {pitch: Tone.Frequency('C4').toMidi(), quantizedStartStep: 16, quantizedEndStep: 20},
        {pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 20, quantizedEndStep: 26},
        {pitch: Tone.Frequency('A3').toMidi(), quantizedStartStep: 26, quantizedEndStep: 28},
        {pitch: Tone.Frequency('A3').toMidi(), quantizedStartStep: 28, quantizedEndStep: 32}
        ], 
        totalQuantizedSteps: 32,
        quantizationInfo: {stepsPerQuarter: 4}
    },
    'MELODY2': {
        notes: [
        {pitch: Tone.Frequency('A3').toMidi(), quantizedStartStep: 0, quantizedEndStep: 4},
        {pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 4, quantizedEndStep: 6},
        {pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 6, quantizedEndStep: 8},
        {pitch: Tone.Frequency('F4').toMidi(), quantizedStartStep: 8, quantizedEndStep: 10}, 
        {pitch: Tone.Frequency('E4').toMidi(), quantizedStartStep: 10, quantizedEndStep: 12},
        {pitch: Tone.Frequency('E4').toMidi(), quantizedStartStep: 12, quantizedEndStep: 16},
        {pitch: Tone.Frequency('C4').toMidi(), quantizedStartStep: 16, quantizedEndStep: 20},
        {pitch: Tone.Frequency('D4').toMidi(), quantizedStartStep: 20, quantizedEndStep: 26},
        {pitch: Tone.Frequency('A3').toMidi(), quantizedStartStep: 26, quantizedEndStep: 28},
        {pitch: Tone.Frequency('A3').toMidi(), quantizedStartStep: 28, quantizedEndStep: 32}
        ], 
        totalQuantizedSteps: 32,
        quantizationInfo: {stepsPerQuarter: 4}
    }
}
