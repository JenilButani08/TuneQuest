import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Shuffle, ArrowLeft, Trash2, FolderHeart } from 'lucide-react';
import { playlistService } from '../../services/playlist/playlistService';
import { musicService } from '../../services/music/musicService';
import { Playlist, Song } from '../../types';
import { Button } from '../../components/ui/Button';
import { SongRow } from '../../components/music/SongRow';
import { usePlayerStore } from '../../store/playerStore';
import { useUIStore } from '../../store/uiStore';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const { playSong, toggleShuffle } = usePlayerStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      playlistService.getPlaylist(id).then(async (pl) => {
        if (pl) {
          setPlaylist(pl);
          const allSongs = await musicService.getSongs();
          setSongs(allSongs.filter((s) => pl.songIds.includes(s.id)));
        }
      });
    }
  }, [id]);

  if (!playlist) {
    return <div className="text-center py-20 text-slate-400">Loading playlist...</div>;
  }

  const handlePlayPlaylist = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  const handleShufflePlaylist = () => {
    if (songs.length > 0) {
      toggleShuffle();
      const randomIndex = Math.floor(Math.random() * songs.length);
      playSong(songs[randomIndex], songs);
    }
  };

  const handleDeletePlaylist = async () => {
    if (confirm(`Are you sure you want to delete "${playlist.title}"?`)) {
      await playlistService.deletePlaylist(playlist.id);
      addToast({ type: 'info', title: 'Playlist Deleted', message: playlist.title });
      navigate('/library');
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

      {/* Playlist Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        <img
          src={playlist.coverImage}
          alt={playlist.title}
          className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-2xl border border-white/10 flex-shrink-0"
        />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">{playlist.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300">{playlist.description}</p>
          <p className="text-xs text-slate-400">
            Created by <span className="text-white font-medium">{playlist.ownerName}</span> • {songs.length} tracks
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
            <Button
              variant="primary"
              size="md"
              glow
              disabled={songs.length === 0}
              onClick={handlePlayPlaylist}
            >
              <Play className="w-4 h-4 fill-current mr-2" /> Play
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={songs.length === 0}
              onClick={handleShufflePlaylist}
            >
              <Shuffle className="w-4 h-4 mr-2 text-cyan-400" /> Shuffle
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="text-rose-400 hover:bg-rose-500/10"
              onClick={handleDeletePlaylist}
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <section className="space-y-2">
        <h3 className="text-lg font-bold text-white mb-2">Tracks in Playlist</h3>
        {songs.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-2xl p-6 text-slate-400 text-xs">
            No tracks in this playlist yet. Add tracks by clicking the "+" icon on any song.
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                playlistContext={songs}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
