import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import api from './utils/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Player from './components/Player';
import AuthModal from './components/AuthModal';
import UploadModal from './components/UploadModal';
import CreateAlbumModal from './components/CreateAlbumModal';
import AlbumDetailView from './components/AlbumDetailView';
import HomeView from './pages/HomeView';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { isAuthenticated, isArtist } = useAuth();

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'search', 'library'
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [createAlbumModalOpen, setCreateAlbumModalOpen] = useState(false);

  // Data
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // Both routes require authentication under authUser middleware
      const [musicsRes, albumsRes] = await Promise.allSettled([
        api.get('/music'),
        api.get('/music/albums'),
      ]);

      if (musicsRes.status === 'fulfilled') {
        setMusics(musicsRes.value.data.musics || []);
      }
      if (albumsRes.status === 'fulfilled') {
        setAlbums(albumsRes.value.data.albums || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, isAuthenticated]);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleSelectAlbum = (album) => {
    setSelectedAlbum(album);
  };

  const handleBackFromAlbum = () => {
    setSelectedAlbum(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-spotify-black text-white">
      {/* Upper Area: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedAlbum(null);
          }}
          onOpenUpload={() => setUploadModalOpen(true)}
          onOpenCreateAlbum={() => setCreateAlbumModalOpen(true)}
          onOpenAuth={handleOpenAuth}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-spotify-dark rounded-lg flex flex-col overflow-hidden relative">
          <Navbar
            onOpenAuth={handleOpenAuth}
            activeTab={activeTab}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              if (selectedAlbum) setSelectedAlbum(null);
            }}
          />

          {/* Scrollable View Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {loading ? (
              <div className="h-full flex items-center justify-center gap-3 text-spotify-subtext">
                <Loader2 className="w-8 h-8 animate-spin text-spotify-green" />
                <span className="text-sm font-semibold">Loading your library...</span>
              </div>
            ) : selectedAlbum ? (
              <AlbumDetailView
                album={selectedAlbum}
                onBack={handleBackFromAlbum}
              />
            ) : (
              <HomeView
                musics={musics}
                albums={albums}
                searchQuery={searchQuery}
                onSelectAlbum={handleSelectAlbum}
                onOpenUpload={() => setUploadModalOpen(true)}
                isArtist={isArtist}
              />
            )}
          </div>
        </main>
      </div>

      {/* Bottom Persistent Audio Player */}
      <Player />

      {/* Modals */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={fetchData}
      />

      <CreateAlbumModal
        isOpen={createAlbumModalOpen}
        tracks={musics}
        onClose={() => setCreateAlbumModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <MainApp />
      </PlayerProvider>
    </AuthProvider>
  );
}
