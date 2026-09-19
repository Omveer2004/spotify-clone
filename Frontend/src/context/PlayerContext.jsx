import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(null);
    };
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };
    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setAudioError('Failed to load audio stream');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [isLooping, queue, currentIndex]);

  const playTrack = (track, newQueue = null) => {
    if (!track || !track.uri) {
      console.warn('Track has no valid audio URI', track);
      return;
    }

    const audio = audioRef.current;
    setAudioError(null);

    let activeQueue = queue;
    if (newQueue && Array.isArray(newQueue)) {
      setQueue(newQueue);
      activeQueue = newQueue;
    } else if (queue.length === 0 || !queue.some((t) => t._id === track._id)) {
      activeQueue = [track];
      setQueue([track]);
    }

    const index = activeQueue.findIndex((t) => t._id === track._id);
    setCurrentIndex(index !== -1 ? index : 0);
    setCurrentTrack(track);

    audio.src = track.uri;
    audio.currentTime = 0;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error('Playback error:', err);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const seek = (seconds) => {
    const audio = audioRef.current;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const setVolume = (val) => {
    const audio = audioRef.current;
    const newVol = Math.max(0, Math.min(1, val));
    audio.volume = newVol;
    setVolumeState(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
    if (nextIndex < queue.length) {
      playTrack(queue[nextIndex], queue);
    } else if (isLooping) {
      playTrack(queue[0], queue);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrev = () => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (queue.length === 0) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    playTrack(queue[prevIndex], queue);
  };

  const toggleLoop = () => setIsLooping((prev) => !prev);
  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffle,
    audioError,
    queue,
    playTrack,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrev,
    toggleLoop,
    toggleShuffle,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
