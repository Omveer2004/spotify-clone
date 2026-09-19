import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  Volume1,
  VolumeX,
  Music2,
  AlertCircle
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffle,
    audioError,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
    toggleLoop,
    toggleShuffle,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <footer className="h-20 bg-spotify-black border-t border-spotify-divider px-4 flex items-center justify-between text-spotify-subtext text-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-spotify-card flex items-center justify-center text-spotify-subtext">
            <Music2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white font-medium text-xs">No song selected</div>
            <div className="text-xs text-spotify-subtext">Choose a track to start playing</div>
          </div>
        </div>
      </footer>
    );
  }

  const artistName = typeof currentTrack.artist === 'object'
    ? currentTrack.artist?.username || 'Unknown Artist'
    : 'Artist';

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="h-24 bg-spotify-black border-t border-spotify-divider/60 px-6 flex items-center justify-between relative z-40">
      {/* Left: Track Details */}
      <div className="flex items-center gap-4 w-1/4 min-w-[180px]">
        <div className="w-14 h-14 rounded-md bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 flex items-center justify-center flex-shrink-0 shadow-lg relative overflow-hidden group">
          <Music2 className="w-7 h-7 text-spotify-green" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-white font-semibold text-sm truncate hover:underline cursor-pointer">
            {currentTrack.title}
          </span>
          <span className="text-spotify-subtext text-xs truncate hover:underline cursor-pointer hover:text-white">
            {artistName}
          </span>
          {audioError && (
            <span className="text-red-400 text-[10px] flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3 h-3" /> {audioError}
            </span>
          )}
        </div>
      </div>

      {/* Center: Controls & Scrubber */}
      <div className="flex flex-col items-center gap-2 max-w-xl w-2/4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleShuffle}
            title={isShuffle ? 'Disable Shuffle' : 'Enable Shuffle'}
            className={`transition-colors ${
              isShuffle ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={playPrev}
            title="Previous Track"
            className="text-spotify-subtext hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full bg-white hover:scale-105 transition-transform flex items-center justify-center text-black shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            title="Next Track"
            className="text-spotify-subtext hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleLoop}
            title={isLooping ? 'Disable Repeat' : 'Enable Repeat'}
            className={`transition-colors ${
              isLooping ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="flex items-center gap-2.5 w-full text-xs text-spotify-subtext group">
          <span className="w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1 appearance-none rounded-full cursor-pointer accent-spotify-green transition-all"
            />
          </div>
          <span className="w-10 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume Controls */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[150px]">
        <button
          onClick={toggleMute}
          className="text-spotify-subtext hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5 text-red-400" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
        <div className="w-24 flex items-center group">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-spotify-green"
          />
        </div>
      </div>
    </footer>
  );
}
