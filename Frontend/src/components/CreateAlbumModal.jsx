import React, { useState } from 'react';
import { X, Disc, Check, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

export default function CreateAlbumModal({ isOpen, onClose, tracks = [], onSuccess }) {
  const [title, setTitle] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTrack = (id) => {
    if (selectedTracks.includes(id)) {
      setSelectedTracks(selectedTracks.filter((t) => t !== id));
    } else {
      setSelectedTracks([...selectedTracks, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Album title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/music/album', {
        title: title.trim(),
        musics: selectedTracks,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setSelectedTracks([]);
        onSuccess?.();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Album creation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create album');
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
            <Disc className="w-6 h-6 text-purple-400" />
            <span>Create New Album</span>
          </h3>
          <p className="text-xs text-spotify-subtext mt-1">
            Group your tracks into an album for listeners to discover.
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
            <span className="font-bold text-base text-white">Album Created Successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Album Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chronicles of Rhythm"
                className="w-full bg-spotify-black/60 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-spotify-green transition-colors"
              />
            </div>

            {/* Song Selection List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Select Tracks ({selectedTracks.length})
                </label>
                <span className="text-[11px] text-spotify-subtext">Optional</span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-white/10 rounded-xl bg-black/30 p-2 flex flex-col gap-1">
                {tracks.length === 0 ? (
                  <div className="text-center py-6 text-xs text-spotify-subtext">
                    No tracks uploaded yet. You can create an empty album or upload tracks first!
                  </div>
                ) : (
                  tracks.map((track) => {
                    const isSelected = selectedTracks.includes(track._id);
                    return (
                      <div
                        key={track._id}
                        onClick={() => toggleTrack(track._id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-spotify-green/10 border border-spotify-green/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="text-xs font-medium text-white truncate max-w-[280px]">
                          {track.title}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-spotify-green border-spotify-green text-black'
                              : 'border-white/30 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full bg-spotify-green hover:bg-spotify-green-hover disabled:opacity-50 text-black font-bold py-3 rounded-full text-sm mt-2 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Creating Album...' : 'Create Album'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
