'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Add animation keyframes
const addAnimationStyles = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
 @keyframes pressDownWhite {
        0% { transform: translateY(0); }
        100% { transform: translateY(2px); }
      }
      
      @keyframes pressDownBlack {
        0% { transform: translate(2rem, -0.125rem); }
        100% { transform: translate(2rem, calc(-0.125rem + 2px)); }
      }
      
      @keyframes glow {
        0% { opacity: 0; }
        50% { opacity: 0.3; }
        100% { opacity: 0; }
      }
      
      @keyframes ripple {
        0% { transform: scale(1); opacity: 0.4; }
        100% { transform: scale(2); opacity: 0; }
      }

     .white-key-press {
        animation: pressDownWhite 0.15s ease-in-out;
      }

      .black-key-press {
        animation: pressDownBlack 0.15s ease-in-out;
      }

      .key-glow {
        animation: glow 0.3s ease-in-out;
      }

      .key-ripple {
        animation: ripple 0.6s ease-out;
      }
    `;
    document.head.appendChild(style);
  }
};

interface AudioContextType extends AudioContext {
  webkitAudioContext?: AudioContext;
}

declare global {
  interface Window {
    handleKeyPress: (note: string) => void;
  }
}

const PianoApp = () => {
  const [keyboardLayout, setKeyboardLayout] = useState('qwerty');
  const [mode, setMode] = useState('simple');
  const [activeKeys, setActiveKeys] = useState(new Set<string>());
  const [selectedSound, setSelectedSound] = useState<'sine' | 'square' | 'sawtooth' | 'triangle'>('sine');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    addAnimationStyles();
  }, []);

  // Define the piano key structure
  const pianoKeys = useMemo(() => [
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
  ], []);
  
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

  const soundTypes = [
    { id: 'sine', name: 'Sine Wave' },
    { id: 'square', name: 'Square Wave' },
    { id: 'sawtooth', name: 'Sawtooth' },
    { id: 'triangle', name: 'Triangle' }
  ];

  // Initialize AudioContext on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContext) {
      const AudioContextClass = (window.AudioContext || window.webkitAudioContext) as AudioContextType;
      const ctx = new AudioContextClass();
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  }, [audioContext]);

  const playNote = useCallback((note: string) => {
    const ctx = initAudioContext();
    
    // Get base note name without octave or accidental
    const baseNote = note.split('/')[0].replace(/[0-9]/, '');
    
    // Define note frequencies (A4 = 440Hz)
    const noteFrequencies: { [key: string]: number } = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13,
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88
    };

    const octaveMultiplier = note.includes('2') ? 2 : 1;
    const frequency = noteFrequencies[baseNote] * octaveMultiplier;

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

  const handleKeyPress = useCallback((note: string) => {
    playNote(note);
    setActiveKeys(prev => new Set(prev.add(note)));
    setTimeout(() => setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    }), 300);
  }, [playNote]);

  useEffect(() => {
    const handleKeyboardPress = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      
      if (key in numberMapping) {
        handleKeyPress(numberMapping[key]);
      } else if (key in letterMapping) {
        handleKeyPress(letterMapping[key]);
      }
    };

    window.handleKeyPress = handleKeyPress;
    window.addEventListener('keydown', handleKeyboardPress);

    return () => {
      window.removeEventListener('keydown', handleKeyboardPress);
    };
  }, [handleKeyPress, numberMapping, letterMapping]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 select-none">
      {/* Mode and Sound Selection */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center items-center">
        <div className="flex gap-4">
          <button 
            onClick={() => setMode('simple')}
            className={`px-6 py-2 rounded-full text-sm font-semibold 
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              ${mode === 'simple' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Simple
          </button>
          <button 
            onClick={() => setMode('advanced')}
            className={`px-6 py-2 rounded-full text-sm font-semibold 
              transition-all duration-300 transform hover:scale-105 hover:shadow-lg
              ${mode === 'advanced' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Advanced
          </button>
        </div>
        
        {!isMobile && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Keyboard Layout:</span>
            <button
              onClick={() => setKeyboardLayout(prev => prev === 'qwerty' ? 'qwertz' : 'qwerty')}
              className="px-4 py-1 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {keyboardLayout.toUpperCase()}
            </button>
          </div>
        )}
        
        <select 
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value as 'sine' | 'square' | 'sawtooth' | 'triangle')}
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm
            transition-all duration-300 hover:border-blue-300 focus:border-blue-500
            focus:ring-2 focus:ring-blue-200 outline-none"
        >
          {soundTypes.map(sound => (
            <option key={sound.id} value={sound.id}>
              {sound.name}
            </option>
          ))}
        </select>
      </div>

      {/* Piano Keys */}
      <div className="relative w-full overflow-x-auto pb-4">
        <div className="flex justify-center gap-1 min-w-max mx-auto">
          {pianoKeys.map(({ white, black }, index) => (
            <div key={white} className="relative">
              {/* White Key */}
              <div
                onClick={() => handleKeyPress(white)}
                className={`w-12 h-36 border border-gray-300 rounded-b 
                  cursor-pointer relative transform transition-all duration-300 
                  hover:shadow-md
                  ${activeKeys.has(white) 
                    ? 'bg-blue-100 shadow-inner scale-98 border-blue-300 white-key-press' 
                    : 'bg-white hover:bg-gray-50'}`}
              >
                <span className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 
                  transition-all duration-300 text-sm
                  ${activeKeys.has(white) ? 'text-blue-500 font-medium scale-110' : 'text-gray-400'}`}>
                  {white}
                </span>
                <span className={`absolute top-2 left-1/2 transform -translate-x-1/2 text-xs
                  transition-all duration-300
                  ${activeKeys.has(white) ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
                  {Object.entries(numberMapping).find(([, val]) => val === white)?.[0] || 
                   Object.entries(letterMapping).find(([, val]) => val === white)?.[0]}
                </span>
                {activeKeys.has(white) && (
                  <>
                    <div className="absolute inset-0 bg-blue-400 opacity-10 rounded-b pointer-events-none key-glow" />
                    <div className="absolute inset-0 bg-blue-300 opacity-10 rounded-b pointer-events-none key-ripple" />
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-transparent opacity-20 rounded-b pointer-events-none" />
                  </>
                )}
              </div>

              {/* Black Key */}
              {black && mode === 'advanced' && (
                <div
                  onClick={() => handleKeyPress(black.split('/')[0])}
                  className={`absolute top-0 w-8 h-24 rounded-b cursor-pointer z-10
                    transform transition-all duration-300 translate-x-8 -translate-y-0.5
                    ${activeKeys.has(black) 
                      ? 'bg-gray-700 scale-95 shadow-xl black-key-press' 
                      : 'bg-black hover:bg-gray-900 black-key'}`}
                >
                  <span className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white
                    transition-all duration-300
                    ${activeKeys.has(black) ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                    {Object.entries(letterMapping).find(([, val]) => val === black)?.[0]}
                  </span>
                  {activeKeys.has(black) && (
                    <>
                      <div className="absolute inset-0 bg-white opacity-10 rounded-b pointer-events-none key-glow" />
                      <div className="absolute inset-0 bg-white opacity-5 rounded-b pointer-events-none key-ripple" />
                      <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-transparent opacity-20 rounded-b pointer-events-none" />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          {mode === 'simple' 
            ? 'Simple mode: Play the white keys!' 
            : 'Advanced mode: Play both white and black keys!'}
        </p>
        <p className="text-xs mt-2">
          White keys: Number keys (1-0) or letters (A-L)
        </p>
        <p className="text-xs mt-1">
          Black keys: {keyboardLayout === 'qwerty' ? 'W, E, T, Y, U' : 'W, E, T, Z, U'}
        </p>
        <p className="text-xs mt-2">
          Selected sound: {soundTypes.find(s => s.id === selectedSound)?.name}
        </p>
      </div>
    </div>
  );
};

export default PianoApp;