import { useState } from 'react';
import axios from 'axios';
import { useState } from 'react';
import axios from 'axios';
import VideoGenerator from './components/VideoGenerator';

const voiceOptions = [
  { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Rachel (SFW)' },
  { id: 'SFW_VOICE_02', label: 'Emma (SFW)' },
  { id: 'SFW_VOICE_03', label: 'Liam (SFW)' },
  { id: 'SFW_VOICE_04', label: 'Olivia (SFW)' },
  { id: 'SFW_VOICE_05', label: 'Noah (SFW)' },
  // ... add more SFW voices up to 50
  { id: 'NSFW_VOICE_01', label: 'NSFW Voice 1' },
  { id: 'NSFW_VOICE_02', label: 'NSFW Voice 2' },
  { id: 'NSFW_VOICE_03', label: 'NSFW Voice 3' },
  { id: 'NSFW_VOICE_04', label: 'NSFW Voice 4' },
  { id: 'NSFW_VOICE_05', label: 'NSFW Voice 5' },
  // ... add more NSFW voices up to 50
];

const videoStyles = [
  { id: 'STYLE_01', name: 'Style 1 (SFW)', description: 'Description for style 1' },
  { id: 'STYLE_02', name: 'Style 2 (SFW)', description: 'Description for style 2' },
  { id: 'STYLE_03', name: 'Style 3 (SFW)', description: 'Description for style 3' },
  { id: 'STYLE_04', name: 'Style 4 (SFW)', description: 'Description for style 4' },
  { id: 'STYLE_05', name: 'Style 5 (SFW)', description: 'Description for style 5' },
  // ... add more SFW styles up to 50
  { id: 'STYLE_51', name: 'Style 51 (NSFW)', description: 'Description for style 51' },
  { id: 'STYLE_52', name: 'Style 52 (NSFW)', description: 'Description for style 52' },
  { id: 'STYLE_53', name: 'Style 53 (NSFW)', description: 'Description for style 53' },
  { id: 'STYLE_54', name: 'Style 54 (NSFW)', description: 'Description for style 54' },
  { id: 'STYLE_55', name: 'Style 55 (NSFW)', description: 'Description for style 55' },
  // ... add more NSFW styles up to 50
];

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('EXAVITQu4vr4xnSDxMaL'); // Example voice
  const [audioURL, setAudioURL] = useState(null);
  const [mode, setMode] = useState('SFW');
  const [selectedStyle, setSelectedStyle] = useState(videoStyles[0].id);

  const generateAudio = async () => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('voice_id', voice);

    try {
      const response = await axios.post('http://localhost:8000/generate-tts', formData, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio. See console for details.');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TTS + AI Video Generator</h1>

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Enter your text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="mt-4">
        <label>Voice:</label>
        <select value={voice} onChange={(e) => setVoice(e.target.value)} className="ml-2">
          {voiceOptions
            .filter((v) => (mode === 'SFW' ? v.label.includes('(SFW)') : v.label.includes('(NSFW)')))
            .map((voiceOption) => (
              <option key={voiceOption.id} value={voiceOption.id}>
                {voiceOption.label}
              </option>
            ))}
        </select>
      </div>

      <div className="mt-4">
        <label>Mode:</label>
        <button
          className={`ml-2 px-4 py-1 rounded ${mode === 'SFW' ? 'bg-green-500' : 'bg-red-500'}`}
          onClick={() => setMode(mode === 'SFW' ? 'NSFW' : 'SFW')}
        >
          {mode}
        </button>
      </div>

      <button onClick={generateAudio} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded">
        Generate TTS
      </button>

      <div className="mt-4">
        <label>Video Style:</label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="ml-2"
        >
          {videoStyles
            .filter((style) => (mode === 'SFW' ? style.name.includes('(SFW)') : style.name.includes('(NSFW)')))
            .map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
        </select>
      </div>

      {audioURL && (
        <div className="mt-6">
          <audio controls src={audioURL}></audio>
        </div>
      )}

      <VideoGenerator mode={mode} voice={voice} text={text} />
    </div>
  );
}

export default App;
