'use client';

import React, { useState, useEffect } from 'react';

// Add animation keyframes
const addAnimationStyles = () => {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pressDown {
        0% { transform: translateY(0); }
        100% { transform: translateY(2px); }
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

      .key-press {
        animation: pressDown 0.15s ease-in-out;
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

const PianoApp = () => {
  const [mode, setMode] = useState('simple');
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [selectedSound, setSelectedSound] = useState('sine');
  const [lastPressed, setLastPressed] = useState(null);

  useEffect(() => {
    addAnimationStyles();
  }, []);

  const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2', 'D2', 'E2'];
  const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#', 'C2#', 'D2#'];
  
  const numberMapping = {
    '1': 'C', '2': 'D', '3': 'E', '4': 'F', '5': 'G',
    '6': 'A', '7': 'B', '8': 'C2', '9': 'D2', '0': 'E2'
  };

  const soundTypes = [
    { id: 'sine', name: 'Sine Wave' },
    { id: 'square', name: 'Square Wave' },
    { id: 'sawtooth', name: 'Sawtooth' },
    { id: 'triangle', name: 'Triangle' }
  ];

  useEffect(() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const playNote = (frequency) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = selectedSound;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
    };

    const getFrequency = (note) => {
      const baseFrequency = 261.63;
      const notes = [
        'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
        'C2', 'C2#', 'D2', 'D2#', 'E2'
      ];
      const noteIndex = notes.indexOf(note);
      return baseFrequency * Math.pow(2, noteIndex / 12);
    };

    const handleKeyPress = (note) => {
      playNote(getFrequency(note));
      setLastPressed(note);
      setActiveKeys(prev => new Set(prev.add(note)));
      setTimeout(() => setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      }), 300);
    };

    const handleKeyboardPress = (e) => {
      const key = e.key;
      if (numberMapping[key]) {
        handleKeyPress(numberMapping[key]);
      }
    };

    window.handleKeyPress = handleKeyPress;
    window.addEventListener('keydown', handleKeyboardPress);

    return () => {
      window.removeEventListener('keydown', handleKeyboardPress);
    };
  }, [selectedSound]);

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
        
        <select 
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value)}
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
        <div className="flex justify-center gap-1 min-w-max">
          {whiteKeys.map((note, index) => (
            <div
              key={note}
              onTouchStart={(e) => {
                e.preventDefault();
                window.handleKeyPress(note);
              }}
              onClick={() => window.handleKeyPress(note)}
              className={`w-12 h-36 border border-gray-300 rounded-b 
                cursor-pointer relative transform transition-all duration-300 
                hover:shadow-md
                ${activeKeys.has(note) 
                  ? 'bg-blue-100 shadow-inner scale-98 border-blue-300 key-press' 
                  : 'bg-white hover:bg-gray-50'}`}
            >
              <span className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 
                transition-all duration-300 text-sm
                ${activeKeys.has(note) ? 'text-blue-500 font-medium scale-110' : 'text-gray-400'}`}>
                {note}
              </span>
              <span className={`absolute top-2 left-1/2 transform -translate-x-1/2 text-xs
                transition-all duration-300
                ${activeKeys.has(note) ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
                {index + 1}
                {index === 9 && '0'}
              </span>
              {/* Multiple animation layers */}
              {activeKeys.has(note) && (
                <>
                  <div className="absolute inset-0 bg-blue-400 opacity-10 rounded-b pointer-events-none key-glow" />
                  <div className="absolute inset-0 bg-blue-300 opacity-10 rounded-b pointer-events-none key-ripple" />
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-transparent opacity-20 rounded-b pointer-events-none" />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Black Keys */}
        {mode === 'advanced' && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex gap-1 min-w-max">
            {blackKeys.map((note, index) => (
              <div
                key={note}
                onTouchStart={(e) => {
                  e.preventDefault();
                  window.handleKeyPress(note);
                }}
                onClick={() => window.handleKeyPress(note)}
                className={`w-8 h-24 rounded-b cursor-pointer relative
                  transform transition-all duration-300
                  ${activeKeys.has(note) 
                    ? 'bg-gray-700 scale-95 shadow-xl key-press' 
                    : 'bg-black hover:bg-gray-900'}`}
                style={{
                  marginLeft: [0, 2, 4].includes(index) ? '2rem' : index === 0 ? '1rem' : '0',
                  marginRight: [1, 3].includes(index) ? '2rem' : '0'
                }}
              >
                <span className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-white
                  transition-all duration-300
                  ${activeKeys.has(note) ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                  {note}
                </span>
                {/* Multiple animation layers for black keys */}
                {activeKeys.has(note) && (
                  <>
                    <div className="absolute inset-0 bg-white opacity-10 rounded-b pointer-events-none key-glow" />
                    <div className="absolute inset-0 bg-white opacity-5 rounded-b pointer-events-none key-ripple" />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-600 to-transparent opacity-20 rounded-b pointer-events-none" />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          {mode === 'simple' 
            ? 'Simple mode: Play the white keys!' 
            : 'Advanced mode: Play both white and black keys!'}
        </p>
        <p className="text-xs mt-2">
          Use number keys (1-0) or tap/click to play white keys
        </p>
        <p className="text-xs mt-1">
          Selected sound: {soundTypes.find(s => s.id === selectedSound)?.name}
        </p>
      </div>
    </div>
  );
};

export default PianoApp;