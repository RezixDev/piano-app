// hooks/useKeyboardMapping.ts
import { useMemo } from 'react';

export const useKeyboardMapping = (keyboardLayout: KeyboardLayout) => {
  const numberMapping = useMemo(() => ({
    '1': 'C', '2': 'D', '3': 'E', '4': 'F', '5': 'G',
    '6': 'A', '7': 'B', '8': 'C2', '9': 'D2', '0': 'E2'
  }), []);

  const letterMapping = useMemo(() => ({
    'a': 'C', 's': 'D', 'd': 'E', 'f': 'F', 'g': 'G',
    'h': 'A', 'j': 'B', 'k': 'C2', 'l': 'D2', ';': 'E2',
    ...(keyboardLayout === 'qwerty'
      ? { 'y': 'G#/Ab', 'w': 'C#/Db', 'e': 'D#/Eb', 't': 'F#/Gb', 'u': 'A#/Bb',
          'o': 'C#2/Db2', 'p': 'D#2/Eb2' }
      : { 'z': 'G#/Ab', 'w': 'C#/Db', 'e': 'D#/Eb', 't': 'F#/Gb', 'u': 'A#/Bb',
          'o': 'C#2/Db2', 'p': 'D#2/Eb2' })
  }), [keyboardLayout]);

  return { numberMapping, letterMapping };
};