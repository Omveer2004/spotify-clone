import React from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function MusicCard({ track, playlist = [] }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const isThisTrack = currentTrack?._id === track._id;
  const isThisPlaying = isThisTrack && isPlaying;

  const artistName = typeof track.artist === 'object'
    ? track.artist?.username || 'Unknown Artist'
    : 'Artist';

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isThisTrack) {
      togglePlay();
    } else {
      playTrack(track, playlist);
    }
  };

  return (
    <div
      onClick={handlePlayClick}
      className="bg-spotify-card hover:bg-spotify-hover p-4 rounded-lg transition-all duration-300 group cursor-pointer flex flex-col gap-3 relative shadow-md"
    >
      {/* Artwork Box */}
      <div className="w-full aspect-square bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-md flex items-center justify-center relative overflow-hidden shadow-inner">
        <Music className="w-12 h-12 text-neutral-600 group-hover:text-spotify-green transition-colors" />

        {/* Floating Play/Pause Button */}
        <button
          onClick={handlePlayClick}
          className={`absolute right-2 bottom-2 w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-xl transition-all duration-300 transform ${
            isThisPlaying
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
          }`}
        >
          {isThisPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-col">
        <span className={`font-bold text-sm truncate ${isThisTrack ? 'text-spotify-green' : 'text-white'}`}>
          {track.title}
        </span>
        <span className="text-spotify-subtext text-xs truncate mt-1">
          {artistName}
        </span>
      </div>
    </div>
  );
}
