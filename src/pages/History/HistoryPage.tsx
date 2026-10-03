import React, { useEffect, useState } from 'react';
import { History, Play, ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { musicService } from '../../services/music/musicService';
import { Song } from '../../types';
import { Button } from '../../components/ui/Button';
import { SongRow } from '../../components/music/SongRow';
import { usePlayerStore } from '../../store/playerStore';
import { useUIStore } from '../../store/uiStore';
import { AddToPlaylistModal } from '../../components/music/AddToPlaylistModal';

export const HistoryPage: React.FC = () => {
  const [historySongs, setHistorySongs] = useState<Song[]>([]);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const { playSong } = usePlayerStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    musicService.getSongs().then((songs) => {
      // Recent history representation
      setHistorySongs(songs.slice(0, 12));
    });
  }, []);

  const handleClearHistory = () => {
    setHistorySongs([]);
    addToast({ type: 'info', title: 'Listening History Cleared' });
  };

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <History className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">Listening History</h1>
            <p className="text-xs text-slate-400 mt-1">Tracks you recently discovered and played</p>
          </div>
        </div>

        {historySongs.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearHistory} className="text-slate-400 hover:text-rose-400">
            <Trash2 className="w-4 h-4 mr-1.5" /> Clear History
          </Button>
        )}
      </div>

      <section className="space-y-2">
        {historySongs.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/5 space-y-2">
            <History className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-white">Your history is clear</p>
            <p className="text-xs text-slate-400">Play some tunes to begin recording your journey.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {historySongs.map((song, i) => (
              <SongRow
                key={`${song.id}-${i}`}
                song={song}
                index={i}
                playlistContext={historySongs}
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
