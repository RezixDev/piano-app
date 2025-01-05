// components/ControlPanel.tsx
export const ControlPanel = ({
    mode,
    setMode,
    keyboardLayout,
    setKeyboardLayout,
    selectedSound,
    setSelectedSound,
    isMobile,
    soundTypes
  }: {
    mode: PianoMode;
    setMode: (mode: PianoMode) => void;
    keyboardLayout: KeyboardLayout;
    setKeyboardLayout: (layout: KeyboardLayout) => void;
    selectedSound: OscillatorType;
    setSelectedSound: (sound: OscillatorType) => void;
    isMobile: boolean;
    soundTypes: SoundType[];
  }) => (
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
            onClick={() => setKeyboardLayout(keyboardLayout === 'qwerty' ? 'qwertz' : 'qwerty')}
            className="px-4 py-1 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {keyboardLayout.toUpperCase()}
          </button>
        </div>
      )}
      
      <select 
        value={selectedSound}
        onChange={(e) => setSelectedSound(e.target.value as OscillatorType)}
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
  );