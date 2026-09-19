import React from 'react';
import { Disc, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export default function AlbumCard({ album, onSelectAlbum }) {
  const { playTrack } = usePlayer();

  const artistName = typeof album.artist === 'object'
    ? album.artist?.username || 'Unknown Artist'
    : 'Artist';

  const trackCount = Array.isArray(album.musics) ? album.musics.length : 0;

  const handlePlayAlbum = (e) => {
    e.stopPropagation();
    if (Array.isArray(album.musics) && album.musics.length > 0) {
      // If musics array contains populated music objects
      const firstTrack = album.musics[0];
      if (typeof firstTrack === 'object' && firstTrack.uri) {
        playTrack(firstTrack, album.musics);
      } else {
        onSelectAlbum(album);
      }
    } else {
      onSelectAlbum(album);
    }
  };

  return (
    <div
      onClick={() => onSelectAlbum(album)}
      className="bg-spotify-card hover:bg-spotify-hover p-4 rounded-lg transition-all duration-300 group cursor-pointer flex flex-col gap-3 relative shadow-md"
    >
      {/* Artwork Box */}
      <div className="w-full aspect-square bg-gradient-to-br from-purple-900/40 via-neutral-900 to-black rounded-md flex items-center justify-center relative overflow-hidden border border-purple-500/10">
        <Disc className="w-14 h-14 text-purple-400/60 group-hover:text-purple-400 transition-colors" />

        {/* Play Album Button */}
        <button
          onClick={handlePlayAlbum}
          className="absolute right-2 bottom-2 w-11 h-11 rounded-full bg-spotify-green flex items-center justify-center text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 transition-all duration-300"
        >
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        </button>
      </div>

      {/* Metadata */}
      <div className="flex flex-col">
        <span className="font-bold text-sm text-white truncate">
          {album.title}
        </span>
        <div className="flex items-center justify-between mt-1 text-xs text-spotify-subtext">
          <span className="truncate">{artistName}</span>
          <span className="text-[11px] bg-white/5 px-2 py-0.5 rounded-full">
            {trackCount} {trackCount === 1 ? 'song' : 'songs'}
          </span>
        </div>
      </div>
    </div>
  );
}
