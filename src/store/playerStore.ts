import { create } from 'zustand';
import { Song } from '../types';
import { proceduralAudio } from '../utils/audioSynth';
import { musicService } from '../services/music/musicService';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
  currentTime: number;
  duration: number;
  queue: Song[];
  history: Song[];
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  isExpandedMobile: boolean;
  useFallbackSynth: boolean;

  // Actions
  playSong: (song: Song, newQueue?: Song[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleLikeCurrent: () => Promise<void>;
  setIsExpandedMobile: (expanded: boolean) => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (dur: number) => void;
}

// Global HTMLAudioElement singleton
let audioElement: HTMLAudioElement | null = null;

const getAudioElement = () => {
  if (typeof window === 'undefined') return null;
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.preload = 'auto';
  }
  return audioElement;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.8,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  history: [],
  shuffle: false,
  repeat: 'off',
  isExpandedMobile: false,
  useFallbackSynth: false,

  playSong: (song, newQueue) => {
    const audio = getAudioElement();
    const state = get();

    // Stop procedural synth if active
    proceduralAudio.stop();

    if (newQueue) {
      set({ queue: newQueue });
    }

    // Persist to localStorage recently played
    try {
      const storedRecent = getStorageItem<Song[]>(STORAGE_KEYS.RECENTLY_PLAYED, []);
      const updatedRecent = [song, ...storedRecent.filter((s) => s.id !== song.id)].slice(0, 10);
      setStorageItem(STORAGE_KEYS.RECENTLY_PLAYED, updatedRecent);
      set({ history: updatedRecent });
    } catch (e) {
      console.warn('Recently played store notice:', e);
    }

    set({
      currentSong: song,
      isPlaying: true,
      currentTime: 0,
      duration: song.duration,
      useFallbackSynth: false,
    });

    if (audio) {
      audio.pause();
      audio.src = song.audioUrl;
      audio.volume = state.isMuted ? 0 : state.volume;
      audio.currentTime = 0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((_error) => {
          // Fallback to procedural Web Audio synthesizer so sound always plays!
          console.warn('[TuneQuest Player] Streaming preview restricted, switching to Procedural Audio Engine.');
          set({ useFallbackSynth: true });
          proceduralAudio.playTrack(song.id, song.genre);
        });
      }
    }
  },

  pause: () => {
    const audio = getAudioElement();
    if (audio) audio.pause();
    proceduralAudio.stop();
    set({ isPlaying: false });
  },

  resume: () => {
    const { currentSong, useFallbackSynth, isMuted, volume } = get();
    if (!currentSong) return;

    if (useFallbackSynth) {
      proceduralAudio.playTrack(currentSong.id, currentSong.genre);
    } else {
      const audio = getAudioElement();
      if (audio) {
        audio.volume = isMuted ? 0 : volume;
        audio.play().catch(() => {
          proceduralAudio.playTrack(currentSong.id, currentSong.genre);
          set({ useFallbackSynth: true });
        });
      }
    }
    set({ isPlaying: true });
  },

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().resume();
    }
  },

  nextTrack: () => {
    const { queue, currentSong, repeat, shuffle } = get();
    if (!currentSong) return;

    if (repeat === 'one') {
      get().seek(0);
      get().resume();
      return;
    }

    if (queue.length === 0) {
      if (repeat === 'all') {
        get().seek(0);
        get().resume();
      } else {
        get().pause();
      }
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    let nextIndex = 0;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (currentIndex !== -1 && currentIndex + 1 < queue.length) {
      nextIndex = currentIndex + 1;
    } else if (repeat === 'all') {
      nextIndex = 0;
    } else {
      get().pause();
      return;
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      get().playSong(nextSong);
    }
  },

  prevTrack: () => {
    const { queue, currentSong, currentTime } = get();
    // If more than 3 seconds in, restart song
    if (currentTime > 3) {
      get().seek(0);
      return;
    }

    if (!currentSong || queue.length === 0) return;
    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const prevSong = queue[prevIndex];
    if (prevSong) {
      get().playSong(prevSong);
    }
  },

  seek: (seconds) => {
    const audio = getAudioElement();
    if (audio) {
      audio.currentTime = seconds;
    }
    set({ currentTime: seconds });
  },

  setVolume: (volume) => {
    const audio = getAudioElement();
    if (audio) {
      audio.volume = volume;
    }
    proceduralAudio.setVolume(volume);
    set({ volume, isMuted: volume === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume } = get();
    const audio = getAudioElement();
    const nextMuted = !isMuted;
    if (audio) {
      audio.volume = nextMuted ? 0 : volume;
    }
    proceduralAudio.setVolume(nextMuted ? 0 : volume);
    set({ isMuted: nextMuted });
  },

  toggleShuffle: () => {
    set((state) => ({ shuffle: !state.shuffle }));
  },

  cycleRepeat: () => {
    set((state) => {
      const next = state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
      return { repeat: next };
    });
  },

  addToQueue: (song) => {
    set((state) => ({ queue: [...state.queue, song] }));
  },

  removeFromQueue: (index) => {
    set((state) => ({ queue: state.queue.filter((_, i) => i !== index) }));
  },

  clearQueue: () => {
    set({ queue: [] });
  },

  toggleLikeCurrent: async () => {
    const current = get().currentSong;
    if (!current) return;
    const isNowLiked = await musicService.toggleLikeSong(current.id);
    set({ currentSong: { ...current, isLiked: isNowLiked } });
  },

  setIsExpandedMobile: (expanded) => {
    set({ isExpandedMobile: expanded });
  },

  updateCurrentTime: (time) => set({ currentTime: time }),
  updateDuration: (dur) => set({ duration: dur }),
}));

// Set up HTML5 audio event listeners
if (typeof window !== 'undefined') {
  const audio = getAudioElement();
  if (audio) {
    audio.ontimeupdate = () => {
      usePlayerStore.getState().updateCurrentTime(audio.currentTime);
    };
    audio.onloadedmetadata = () => {
      usePlayerStore.getState().updateDuration(audio.duration || 180);
    };
    audio.onended = () => {
      usePlayerStore.getState().nextTrack();
    };
    audio.onerror = () => {
      const { currentSong } = usePlayerStore.getState();
      if (currentSong) {
        proceduralAudio.playTrack(currentSong.id, currentSong.genre);
        usePlayerStore.setState({ useFallbackSynth: true });
      }
    };
  }
}
