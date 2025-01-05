// PianoApp.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { PIANO_KEYS, SOUND_TYPES } from './constants';
import { useKeyboardMapping } from './hooks/useKeyboardMapping';
import { usePianoSound } from './hooks/usePianoSound';
import { PianoKey } from './components/PianoKey';
import { ControlPanel } from './components/ControlPanel';

const PianoApp = () => {
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>('qwerty');
  const [mode, setMode] = useState<PianoMode>('simple');
  const [activeKeys, setActiveKeys] = useState(new Set<string>());
  const [selectedSound, setSelectedSound] = useState<OscillatorType>('sine');
  const [isMobile, setIsMobile] = useState(false);

  const { numberMapping, letterMapping } = useKeyboardMapping(keyboardLayout);
  const { playNote } = usePianoSound(selectedSound);

  useEffect(() => {
    addAnimationStyles();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleKeyPress = (note: string) => {
    playNote(note);
    setActiveKeys(prev => new Set(prev.add(note)));
    setTimeout(() => setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    }), 300);
  };

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

    window.addEventListener('keydown', handleKeyboardPress);
    return () => window.removeEventListener('keydown', handleKeyboardPress);
  }, [handleKeyPress, numberMapping, letterMapping]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 select-none">
      <ControlPanel
        mode={mode}
        setMode={setMode}
        keyboardLayout={keyboardLayout}
        setKeyboardLayout={setKeyboardLayout}
        selectedSound={selectedSound}
        setSelectedSound={setSelectedSound}
        isMobile={isMobile}
        soundTypes={SOUND_TYPES}
      />

      <div className="w-full overflow-hidden">
        <div className="flex justify-center gap-1 min-w-max mx-auto">
          {PIANO_KEYS.map(({ white, black }) => (
            <div key={white} className="relative">
              <PianoKey
                note={white}
                label={white}
                isActive={activeKeys.has(white)}
                onClick={() => handleKeyPress(white)}
              />
              
              {black && mode === 'advanced' && (
                <PianoKey
                  note={black}
                  label={Object.entries(letterMapping).find(([, val]) => val === black)?.[0] || ''}
                  isActive={activeKeys.has(black)}
                  isBlack
                  onClick={() => handleKeyPress(black.split('/')[0])}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          {mode === 'simple' 
            ? 'Simple mode: Play the white keys!' 
            : 'Advanced mode: Play both white and black keys!'}
        </p>
        <p className="text-xs mt-2">
          White keys: Number keys (1-0) or letters (A-L)</p>
        <p className="text-xs mt-1">
          Black keys: {keyboardLayout === 'qwerty' ? 'W, E, T, Y, U' : 'W, E, T, Z, U'}
        </p>
        <p className="text-xs mt-2">
          Selected sound: {SOUND_TYPES.find(s => s.id === selectedSound)?.name}
        </p>
      </div>
    </div>
  );
};

// Add styles.ts for animations
export const addAnimationStyles = () => {
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

export default PianoApp;