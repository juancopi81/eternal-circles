// Preset elodies
const presetMelodies = {
    'MELODY1': { 
        notes: [
        {pitch: Tone.Frequency('Eb5').toMidi(), quantizedStartStep: 0, quantizedEndStep: 4},
        {pitch: Tone.Frequency('G4').toMidi(), quantizedStartStep: 4, quantizedEndStep: 8},
        {pitch: Tone.Frequency('Bb4').toMidi(), quantizedStartStep: 8, quantizedEndStep: 12},
        {pitch: Tone.Frequency('G4').toMidi(), quantizedStartStep: 12, quantizedEndStep: 16}, 
        {pitch: Tone.Frequency('C4').toMidi(), quantizedStartStep: 16, quantizedEndStep: 20},
        {pitch: Tone.Frequency('G4').toMidi(), quantizedStartStep: 20, quantizedEndStep: 24},
        {pitch: Tone.Frequency('Bb4').toMidi(), quantizedStartStep: 24, quantizedEndStep: 28},
        {pitch: Tone.Frequency('G4').toMidi(), quantizedStartStep: 28, quantizedEndStep: 32},
        ], 
        totalQuantizedSteps: 32,
        quantizationInfo: {stepsPerQuarter: 4}
    },
    'MELODY2': {
        notes: [
        {pitch: Tone.Frequency('Bb5').toMidi(), quantizedStartStep: 0, quantizedEndStep: 8},
        {pitch: Tone.Frequency('Ab5').toMidi(), quantizedStartStep: 8, quantizedEndStep: 16},
        {pitch: Tone.Frequency('G5').toMidi(), quantizedStartStep: 16, quantizedEndStep: 20},
        {pitch: Tone.Frequency('Ab5').toMidi(), quantizedStartStep: 20, quantizedEndStep: 24}, 
        {pitch: Tone.Frequency('Bb5').toMidi(), quantizedStartStep: 24, quantizedEndStep: 28},
        {pitch: Tone.Frequency('C6').toMidi(), quantizedStartStep: 28, quantizedEndStep: 32}
        ], 
        totalQuantizedSteps: 32,
        quantizationInfo: {stepsPerQuarter: 4}
    }
}
