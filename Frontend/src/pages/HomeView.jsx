import React from 'react';
import { Music, Disc, Sparkles } from 'lucide-react';
import MusicCard from '../components/MusicCard';
import AlbumCard from '../components/AlbumCard';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeView({
  musics = [],
  albums = [],
  searchQuery = '',
  onSelectAlbum,
  onOpenUpload,
  isArtist,
}) {
  const greeting = getGreeting();

  // Filter if search query exists
  const filteredMusics = musics.filter((m) => {
    if (!searchQuery) return true;
    const titleMatch = m.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const artistMatch = typeof m.artist === 'object' && m.artist?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || artistMatch;
  });

  const filteredAlbums = albums.filter((a) => {
    if (!searchQuery) return true;
    const titleMatch = a.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const artistMatch = typeof a.artist === 'object' && a.artist?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || artistMatch;
  });

  return (
    <div className="flex flex-col gap-10 pb-16">
      {/* Top Banner / Greeting */}
      {!searchQuery && (
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{greeting}</span>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </h1>
        </div>
      )}

      {searchQuery && (
        <div className="text-lg font-bold text-white">
          Search results for "<span className="text-spotify-green">{searchQuery}</span>"
        </div>
      )}

      {/* Musics Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-spotify-green" />
            <span>{searchQuery ? 'Matching Songs' : 'Popular Songs'}</span>
          </h2>
          <span className="text-xs text-spotify-subtext">{filteredMusics.length} tracks</span>
        </div>

        {filteredMusics.length === 0 ? (
          <div className="bg-spotify-card/60 border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center">
            <Music className="w-12 h-12 text-spotify-subtext/40" />
            <p className="text-sm font-semibold text-white">
              {searchQuery ? 'No tracks matched your search' : 'No tracks uploaded yet'}
            </p>
            <p className="text-xs text-spotify-subtext max-w-sm">
              {isArtist
                ? 'You are an artist! Use the Upload Track button on the left to upload your songs.'
                : 'Check back soon or register an artist account to share your creations.'}
            </p>
            {isArtist && (
              <button
                onClick={onOpenUpload}
                className="bg-spotify-green hover:bg-spotify-green-hover text-black font-bold text-xs px-5 py-2.5 rounded-full mt-2 transition-transform hover:scale-105 shadow-md"
              >
                Upload First Track
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMusics.map((track) => (
              <MusicCard key={track._id} track={track} playlist={filteredMusics} />
            ))}
          </div>
        )}
      </section>

      {/* Albums Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-purple-400" />
            <span>{searchQuery ? 'Matching Albums' : 'Featured Albums'}</span>
          </h2>
          <span className="text-xs text-spotify-subtext">{filteredAlbums.length} albums</span>
        </div>

        {filteredAlbums.length === 0 ? (
          <div className="bg-spotify-card/60 border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-center">
            <Disc className="w-12 h-12 text-spotify-subtext/40" />
            <p className="text-sm font-semibold text-white">
              {searchQuery ? 'No albums matched your search' : 'No albums created yet'}
            </p>
            <p className="text-xs text-spotify-subtext max-w-sm">
              Artists can organize their released music into official albums.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album._id}
                album={album}
                onSelectAlbum={onSelectAlbum}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
