import React, { useState, useRef } from 'react';
import { X, UploadCloud, Music, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        // Automatically default title to file name without extension
        const cleanName = selected.name.replace(/\.[^/.]+$/, "");
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an audio file to upload');
      return;
    }
    if (!title.trim()) {
      setError('Track title is required');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('music', file);

    try {
      await api.post('/music/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setFile(null);
        onSuccess?.();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-spotify-card border border-white/10 w-full max-w-md rounded-2xl p-7 shadow-2xl relative flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-spotify-subtext hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-spotify-green" />
            <span>Upload New Track</span>
          </h3>
          <p className="text-xs text-spotify-subtext mt-1">
            Upload your audio file to ImageKit storage and publish to Spotify.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-spotify-green">
            <CheckCircle2 className="w-14 h-14 animate-bounce" />
            <span className="font-bold text-base text-white">Track Uploaded Successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Audio Drop Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                file
                  ? 'border-spotify-green bg-spotify-green/5'
                  : 'border-white/20 hover:border-white/40 bg-black/20'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
              />
              <Music className={`w-8 h-8 ${file ? 'text-spotify-green' : 'text-spotify-subtext'}`} />
              <div className="text-center">
                <span className="text-xs font-semibold text-white block truncate max-w-[260px]">
                  {file ? file.name : 'Click to select audio file'}
                </span>
                <span className="text-[11px] text-spotify-subtext mt-0.5 block">
                  Supports MP3, WAV, FLAC, M4A
                </span>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Track Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Reverie"
                className="w-full bg-spotify-black/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-spotify-green transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-spotify-green hover:bg-spotify-green-hover disabled:opacity-50 text-black font-bold py-3 rounded-full text-sm mt-2 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Uploading Audio...' : 'Publish Track'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
