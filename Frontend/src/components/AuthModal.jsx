import React, { useState } from 'react';
import { X, Lock, Mail, User, Mic2, Headphones, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user', // 'user' or 'artist'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({
          email: formData.email,
          username: formData.username || undefined,
          password: formData.password,
        });
      } else {
        await register(formData);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'Authentication failed');
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
        className="bg-spotify-card border border-white/10 w-full max-w-md rounded-2xl p-8 shadow-2xl relative flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-spotify-subtext hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-spotify-green flex items-center justify-center text-black font-black mb-1">
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.518 17.306c-.218.358-.683.473-1.042.253-2.857-1.745-6.455-2.14-10.693-1.171-.41.093-.815-.164-.908-.573-.094-.41.164-.815.573-.908 4.636-1.06 8.608-.611 11.817 1.348.359.22.474.685.253 1.051zm1.474-3.277c-.275.448-.86.591-1.308.316-3.27-2.01-8.253-2.593-12.122-1.418-.504.153-1.042-.134-1.196-.639-.153-.504.134-1.043.639-1.196 4.417-1.34 9.907-.687 13.671 1.629.448.275.591.86.316 1.308zm.126-3.41c-3.921-2.328-10.38-2.543-14.12-1.407-.601.183-1.24-.165-1.423-.766-.182-.602.166-1.24.767-1.423 4.301-1.306 11.433-1.048 15.93 1.621.54.321.717 1.023.396 1.564-.32.539-1.024.718-1.55.411z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Log in to Spotify' : 'Sign up for free'}
          </h3>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 bg-black/40 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-spotify-hover text-white shadow-sm'
                : 'text-spotify-subtext hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 text-sm font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-spotify-hover text-white shadow-sm'
                : 'text-spotify-subtext hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-spotify-subtext" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. soundmaster"
                  className="w-full bg-spotify-black/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-spotify-green transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-spotify-subtext" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@domain.com"
                className="w-full bg-spotify-black/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-spotify-green transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-spotify-subtext" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-spotify-black/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-spotify-green transition-colors"
              />
            </div>
          </div>

          {/* Role Picker (for Registration) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    formData.role === 'user'
                      ? 'border-spotify-green bg-spotify-green/10 text-white'
                      : 'border-white/10 bg-black/20 text-spotify-subtext hover:border-white/20'
                  }`}
                >
                  <Headphones className={`w-5 h-5 ${formData.role === 'user' ? 'text-spotify-green' : ''}`} />
                  <span className="text-xs font-bold">Listener</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'artist' })}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    formData.role === 'artist'
                      ? 'border-spotify-green bg-spotify-green/10 text-white'
                      : 'border-white/10 bg-black/20 text-spotify-subtext hover:border-white/20'
                  }`}
                >
                  <Mic2 className={`w-5 h-5 ${formData.role === 'artist' ? 'text-spotify-green' : ''}`} />
                  <span className="text-xs font-bold">Artist (Upload)</span>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-spotify-green hover:bg-spotify-green-hover disabled:opacity-50 text-black font-bold py-3 rounded-full text-sm mt-2 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{mode === 'login' ? 'Log In' : 'Sign Up'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
