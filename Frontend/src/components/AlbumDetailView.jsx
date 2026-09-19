import React from 'react';
import { ArrowLeft, Play, Pause, Disc, Clock, Music } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumDetailView({ album, onBack }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  if (!album) return null;

  const tracks = Array.isArray(album.musics) ? album.musics : [];
  const artistName = typeof album.artist === 'object'
    ? album.artist?.username || 'Unknown Artist'
    : 'Artist';

  const isAlbumPlaying = isPlaying && tracks.some((t) => t._id === currentTrack?._id);

  const handlePlayAlbum = () => {
    if (tracks.length === 0) return;
    if (isAlbumPlaying) {
      togglePlay();
    } else {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-spotify-subtext hover:text-white transition-colors self-start font-semibold text-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to browse</span>
      </button>

      {/* Album Header Banner */}
      <div className="flex flex-col md:flex-row items-end gap-6 bg-gradient-to-t from-black/40 via-purple-950/20 to-transparent p-6 rounded-2xl border border-purple-500/10">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-900 via-neutral-900 to-black rounded-xl shadow-2xl flex items-center justify-center flex-shrink-0 border border-white/10">
          <Disc className="w-24 h-24 text-purple-400" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase font-bold tracking-widest text-spotify-subtext">Album</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{album.title}</h1>
          <div className="flex items-center gap-2 text-sm text-spotify-subtext mt-2">
            <span className="font-bold text-white">{artistName}</span>
            <span>•</span>
            <span>{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-6 px-2">
        <button
          onClick={handlePlayAlbum}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-spotify-green hover:scale-105 transition-transform flex items-center justify-center text-black shadow-xl disabled:opacity-40"
        >
          {isAlbumPlaying ? (
            <Pause className="w-7 h-7 fill-current" />
          ) : (
            <Play className="w-7 h-7 fill-current translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Tracklist Table */}
      <div className="flex flex-col mt-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-4 py-2 border-b border-spotify-divider/60 text-xs font-semibold text-spotify-subtext uppercase tracking-wider">
          <span className="col-span-1 text-center">#</span>
          <span className="col-span-8">Title</span>
          <span className="col-span-3 text-right flex items-center justify-end">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        {/* Tracks Rows */}
        {tracks.length === 0 ? (
          <div className="py-12 text-center text-sm text-spotify-subtext">
            This album has no songs attached yet.
          </div>
        ) : (
          <div className="flex flex-col mt-2">
            {tracks.map((track, idx) => {
              const isThisTrack = currentTrack?._id === track._id;
              const isTrackPlaying = isThisTrack && isPlaying;

              return (
                <div
                  key={track._id || idx}
                  onClick={() => playTrack(track, tracks)}
                  className={`grid grid-cols-12 px-4 py-3 rounded-lg items-center text-sm cursor-pointer group transition-colors ${
                    isThisTrack ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Track Number / Play Indicator */}
                  <div className="col-span-1 text-center flex items-center justify-center text-spotify-subtext">
                    <span className={`group-hover:hidden ${isThisTrack ? 'text-spotify-green font-bold' : ''}`}>
                      {idx + 1}
                    </span>
                    <button className="hidden group-hover:block text-white">
                      {isTrackPlaying ? (
                        <Pause className="w-4 h-4 fill-current text-spotify-green" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Title & Artist */}
                  <div className="col-span-8 flex flex-col">
                    <span className={`font-semibold truncate ${isThisTrack ? 'text-spotify-green' : 'text-white'}`}>
                      {track.title}
                    </span>
                    <span className="text-xs text-spotify-subtext truncate">{artistName}</span>
                  </div>

                  {/* Audio Status */}
                  <div className="col-span-3 text-right text-xs text-spotify-subtext flex items-center justify-end gap-2">
                    {isThisTrack && isTrackPlaying && (
                      <span className="text-spotify-green text-[11px] font-semibold animate-pulse">
                        Playing
                      </span>
                    )}
                    <Music className="w-4 h-4 text-spotify-subtext" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
