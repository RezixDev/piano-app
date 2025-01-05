'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Previous code remains the same until the piano keys section...

const PianoApp = () => {
  // ... previous state and hooks remain the same ...

  // Define the piano key structure
  const pianoKeys = useMemo(() => [
    { white: 'C', black: 'C#/Db' },
    { white: 'D', black: 'D#/Eb' },
    { white: 'E', black: null },
    { white: 'F', black: 'F#/Gb' },
    { white: 'G', black: 'G#/Ab' },
    { white: 'A', black: 'A#/Bb' },
    { white: 'B', black: null },
    { white: 'C2', black: null },
    { white: 'D2', black: null },
    { white: 'E2', black: null },
  ], []);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-4 select-none">
      {/* Mode and Sound Selection sections remain the same */}

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
                    ? 'bg-blue-100 shadow-inner scale-98 border-blue-300 key-press' 
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
                  className={`absolute top-0 right-0 w-8 h-24 rounded-b cursor-pointer
                    transform transition-all duration-300 translate-x-4 -translate-y-0.5
                    ${activeKeys.has(black) 
                      ? 'bg-gray-700 scale-95 shadow-xl key-press' 
                      : 'bg-black hover:bg-gray-900'}`}
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

      {/* Instructions section remains the same */}
    </div>
  );
};

export default PianoApp;