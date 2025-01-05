// types.ts
type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';
type KeyboardLayout = 'qwerty' | 'qwertz';
type PianoMode = 'simple' | 'advanced';

interface PianoKey {
  white: string;
  black: string | null;
}

interface SoundType {
  id: OscillatorType;
  name: string;
}
