import React from 'react';
import { Home, Search, Library, PlusCircle, Disc, Music, UploadCloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenUpload, onOpenCreateAlbum, onOpenAuth }) {
  const { isAuthenticated, isArtist, user } = useAuth();

  return (
    <aside className="w-64 bg-spotify-black flex flex-col h-full gap-2 p-2 select-none flex-shrink-0">
      {/* Top Nav Box */}
      <div className="bg-spotify-dark rounded-lg p-5 flex flex-col gap-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-full bg-spotify-green flex items-center justify-center text-black">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.218.358-.683.473-1.042.253-2.857-1.745-6.455-2.14-10.693-1.171-.41.093-.815-.164-.908-.573-.094-.41.164-.815.573-.908 4.636-1.06 8.608-.611 11.817 1.348.359.22.474.685.253 1.051zm1.474-3.277c-.275.448-.86.591-1.308.316-3.27-2.01-8.253-2.593-12.122-1.418-.504.153-1.042-.134-1.196-.639-.153-.504.134-1.043.639-1.196 4.417-1.34 9.907-.687 13.671 1.629.448.275.591.86.316 1.308zm.126-3.41c-3.921-2.328-10.38-2.543-14.12-1.407-.601.183-1.24-.165-1.423-.766-.182-.602.166-1.24.767-1.423 4.301-1.306 11.433-1.048 15.93 1.621.54.321.717 1.023.396 1.564-.32.539-1.024.718-1.55.411z" />
            </svg>
          </div>
          <span>Spotify</span>
        </div>

        {/* Main Nav Links */}
        <nav className="flex flex-col gap-4 font-semibold text-sm">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-4 transition-colors duration-200 ${
              activeTab === 'home' ? 'text-white' : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-4 transition-colors duration-200 ${
              activeTab === 'search' ? 'text-white' : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Search className="w-6 h-6" />
            <span>Search</span>
          </button>
        </nav>
      </div>

      {/* Library & Artist Actions Box */}
      <div className="bg-spotify-dark rounded-lg flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        <div className="flex items-center justify-between text-spotify-subtext">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-3 font-semibold text-sm transition-colors duration-200 ${
              activeTab === 'library' ? 'text-white' : 'hover:text-white'
            }`}
          >
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </button>
        </div>

        {/* Artist-Exclusive Controls */}
        {isAuthenticated && isArtist && (
          <div className="flex flex-col gap-2 pt-2 border-t border-spotify-divider">
            <div className="text-xs uppercase font-bold tracking-wider text-spotify-green px-1">
              Artist Studio
            </div>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-3 w-full p-2.5 rounded-md bg-spotify-hover/60 hover:bg-spotify-hover text-white text-sm font-medium transition-all group"
            >
              <div className="w-8 h-8 rounded bg-spotify-green/20 group-hover:bg-spotify-green text-spotify-green group-hover:text-black flex items-center justify-center transition-colors">
                <UploadCloud className="w-4 h-4" />
              </div>
              <span>Upload Track</span>
            </button>

            <button
              onClick={onOpenCreateAlbum}
              className="flex items-center gap-3 w-full p-2.5 rounded-md bg-spotify-hover/60 hover:bg-spotify-hover text-white text-sm font-medium transition-all group"
            >
              <div className="w-8 h-8 rounded bg-purple-500/20 group-hover:bg-purple-500 text-purple-400 group-hover:text-white flex items-center justify-center transition-colors">
                <Disc className="w-4 h-4" />
              </div>
              <span>Create Album</span>
            </button>
          </div>
        )}

        {/* Non-Artist Callout */}
        {!isAuthenticated && (
          <div className="bg-spotify-card p-4 rounded-lg flex flex-col gap-3 mt-auto">
            <h4 className="font-bold text-sm text-white">Create your first playlist</h4>
            <p className="text-xs text-spotify-subtext">It's easy, we'll help you</p>
            <button
              onClick={() => onOpenAuth('register')}
              className="bg-white text-black font-bold text-xs py-2 px-4 rounded-full self-start hover:scale-105 transition-transform"
            >
              Sign up free
            </button>
          </div>
        )}

        {isAuthenticated && !isArtist && (
          <div className="bg-spotify-card p-4 rounded-lg flex flex-col gap-2 mt-auto">
            <div className="flex items-center gap-2 text-spotify-green">
              <Music className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Listener Account</span>
            </div>
            <p className="text-xs text-spotify-subtext">
              Want to upload music? Register an artist account!
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
