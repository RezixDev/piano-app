// hooks/useAudioContext.ts
import { useState, useCallback } from 'react';

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContext) {
      const AudioContextClass = (window.AudioContext || window.webkitAudioContext);
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        setAudioContext(ctx);
        return ctx;
      }
      throw new Error('AudioContext not supported');
    }
    return audioContext;
  }, [audioContext]);

  return { initAudioContext };
};
