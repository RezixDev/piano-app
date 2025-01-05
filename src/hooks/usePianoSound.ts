// hooks/usePianoSound.ts
import { useCallback } from 'react';
import { useAudioContext } from './useAudioContext';

const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
  'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
  'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
};

export const usePianoSound = (selectedSound: OscillatorType) => {
  const { initAudioContext } = useAudioContext();

  const playNote = useCallback((note: string) => {
    const ctx = initAudioContext();
    const baseNote = note.split('/')[0].replace(/[0-9]/, '');
    const octaveMultiplier = note.includes('2') ? 2 : 1;
    const frequency = NOTE_FREQUENCIES[baseNote] * octaveMultiplier;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = selectedSound;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 1);
  }, [selectedSound, initAudioContext]);

  return { playNote };
};