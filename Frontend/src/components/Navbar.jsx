import React from 'react';
import { ChevronLeft, ChevronRight, LogOut, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth, activeTab, searchQuery, setSearchQuery }) {
  const { user, isAuthenticated, isArtist, logout } = useAuth();

  return (
    <header className="h-16 bg-spotify-dark/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 border-b border-spotify-divider/40">
      {/* Navigation Arrows & Search Input */}
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black flex items-center justify-center text-spotify-subtext hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.history.forward()}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black flex items-center justify-center text-spotify-subtext hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-md w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-spotify-subtext" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="w-full bg-spotify-card hover:bg-spotify-hover focus:bg-spotify-hover text-white text-sm rounded-full py-2.5 pl-10 pr-4 outline-none border border-transparent focus:border-white/20 transition-all placeholder:text-spotify-subtext"
          />
        </div>
      </div>

      {/* User Controls */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                isArtist
                  ? 'bg-spotify-green/20 text-spotify-green border border-spotify-green/30'
                  : 'bg-white/10 text-spotify-subtext'
              }`}
            >
              {user.role}
            </span>

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-2 bg-black/40 hover:bg-black/60 p-1.5 pr-3 rounded-full border border-white/5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-spotify-green to-emerald-400 flex items-center justify-center text-black font-bold text-xs uppercase">
                {user.username ? user.username[0] : 'U'}
              </div>
              <span className="text-sm font-semibold text-white">{user.username}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Log Out"
              className="p-2 rounded-full text-spotify-subtext hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="text-spotify-subtext hover:text-white font-bold text-sm tracking-wide transition-colors"
            >
              Sign up
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="bg-white hover:bg-white/90 text-black font-bold text-sm px-7 py-2.5 rounded-full hover:scale-105 transition-all shadow-md"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
