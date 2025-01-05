// constants.ts
export const PIANO_KEYS: PianoKey[] = [
    { white: 'C', black: 'C#/Db' },
    { white: 'D', black: 'D#/Eb' },
    { white: 'E', black: null },
    { white: 'F', black: 'F#/Gb' },
    { white: 'G', black: 'G#/Ab' },
    { white: 'A', black: 'A#/Bb' },
    { white: 'B', black: null },
    { white: 'C2', black: 'C#2/Db2' },
    { white: 'D2', black: 'D#2/Eb2' },
    { white: 'E2', black: null },
  ];
  
  export const SOUND_TYPES: SoundType[] = [
    { id: 'sine', name: 'Sine Wave' },
    { id: 'square', name: 'Square Wave' },
    { id: 'sawtooth', name: 'Sawtooth' },
    { id: 'triangle', name: 'Triangle' }
  ];