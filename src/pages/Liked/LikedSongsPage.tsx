import React, { useEffect, useState } from 'react';
import { Heart, Play, Shuffle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { musicService } from '../../services/music/musicService';
import { Song } from '../../types';
import { Button } from '../../components/ui/Button';
import { SongRow } from '../../components/music/SongRow';
import { usePlayerStore } from '../../store/playerStore';
import { AddToPlaylistModal } from '../../components/music/AddToPlaylistModal';

export const LikedSongsPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const { playSong, toggleShuffle } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    musicService.getLikedSongs().then(setSongs);
  }, []);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  const handleShuffle = () => {
    if (songs.length > 0) {
      toggleShuffle();
      const randomIndex = Math.floor(Math.random() * songs.length);
      playSong(songs[randomIndex], songs);
    }
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/20 via-[#141420] to-purple-950/20">
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center text-white shadow-2xl flex-shrink-0">
          <Heart className="w-16 h-16 fill-current" />
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Collection</span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">Liked Songs</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Your personal treasury of tracks you've loved while listening on TuneQuest.
          </p>
          <p className="text-xs text-slate-400 font-mono">{songs.length} saved songs</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
            <Button
              variant="primary"
              size="md"
              glow
              disabled={songs.length === 0}
              onClick={handlePlayAll}
            >
              <Play className="w-4 h-4 fill-current mr-2" /> Play All
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={songs.length === 0}
              onClick={handleShuffle}
            >
              <Shuffle className="w-4 h-4 mr-2 text-cyan-400" /> Shuffle
            </Button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <section className="space-y-2">
        {songs.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/5 space-y-3">
            <Heart className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No liked songs yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Songs you like while listening will appear here. Hit the heart button on any player bar or row!
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/browse')}>
              Explore Music
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                playlistContext={songs}
                onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
              />
            ))}
          </div>
        )}
      </section>

      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
      />
    </div>
  );
};
