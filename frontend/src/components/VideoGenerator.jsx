import { useState } from 'react';
import axios from 'axios';

export default function VideoGenerator({ mode, voice, text }) {
  const [style, setStyle] = useState('');
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoStyles = [
    { id: 'STYLE_01', name: 'Style 1 (SFW)' },
    { id: 'STYLE_02', name: 'Style 2 (SFW)' },
    { id: 'STYLE_03', name: 'Style 3 (SFW)' },
    { id: 'STYLE_04', name: 'Style 4 (SFW)' },
    { id: 'STYLE_05', name: 'Style 5 (SFW)' },
    // ... add more SFW styles up to 50
    { id: 'STYLE_51', name: 'Style 51 (NSFW)' },
    { id: 'STYLE_52', name: 'Style 52 (NSFW)' },
    { id: 'STYLE_53', name: 'Style 53 (NSFW)' },
    { id: 'STYLE_54', name: 'Style 54 (NSFW)' },
    { id: 'STYLE_55', name: 'Style 55 (NSFW)' },
    // ... add more NSFW styles up to 50
  ];

  const filteredStyles = videoStyles.filter((style) =>
    mode === 'SFW' ? style.name.includes('(SFW)') : style.name.includes('(NSFW)')
  );

  const generateVideo = async () => {
    if (!style) {
      setError('Please select a video style.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/generate-video', null, {
        params: {
          style_id: style,
          voice_id: voice,
          text: text,
        },
      });
      setVideoURL(response.data.video_url);
    } catch (err) {
      setError('Failed to generate video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Video Generation</h2>
      <div>
        <label>Video Style:</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="ml-2 p-1 border rounded"
        >
          <option value="">Select style</option>
          {filteredStyles.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={generateVideo}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {videoURL && (
        <div className="mt-4">
          <video src={videoURL} controls className="w-full rounded" />
        </div>
      )}
    </div>
  );
}
