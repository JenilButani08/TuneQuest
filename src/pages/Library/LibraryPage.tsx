import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderHeart,
  Heart,
  Plus,
  Disc,
  Users,
  Play,
  Clock,
  Sparkles,
  FolderPlus,
} from 'lucide-react';
import { playlistService } from '../../services/playlist/playlistService';
import { musicService } from '../../services/music/musicService';
import { Playlist, Song, Album, Artist } from '../../types';
import { MusicCard } from '../../components/music/MusicCard';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useUIStore } from '../../store/uiStore';
import { usePlayerStore } from '../../store/playerStore';

export const LibraryPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [activeTab, setActiveTab] = useState<'playlists' | 'albums' | 'artists'>('playlists');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addToast } = useUIStore();
  const { playSong } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    playlistService.getPlaylists().then(setPlaylists);
    musicService.getLikedSongs().then(setLikedSongs);
    musicService.getAlbums().then(setAlbums);
    musicService.getArtists().then(setArtists);
  }, []);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await playlistService.createPlaylist(newTitle.trim(), newDesc.trim());
      setPlaylists([created, ...playlists]);
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      addToast({ type: 'success', title: 'Playlist Created!', message: created.title });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
            <FolderHeart className="w-8 h-8 text-indigo-400" /> Your Sound Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Curated playlists, saved albums, favorite artists, and liked tracks.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsCreateOpen(true)} glow>
          <Plus className="w-4 h-4 mr-1.5" /> New Playlist
        </Button>
      </div>

      {/* Liked Songs Special Banner */}
      <div
        onClick={() => navigate('/liked')}
        className="glass-card p-6 sm:p-8 rounded-3xl cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-rose-500/20 bg-gradient-to-r from-rose-950/20 via-[#12121C] to-purple-950/20"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Liked Songs</h3>
            <p className="text-xs text-slate-400 mt-1">{likedSongs.length} tracks in your personal collection</p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            if (likedSongs.length > 0) playSong(likedSongs[0], likedSongs);
          }}
        >
          <Play className="w-4 h-4 fill-current mr-2" /> Play All
        </Button>
      </div>

      {/* Library Tabs */}
      <div className="flex gap-2 p-1 bg-surface border border-slate-800 rounded-2xl w-fit">
        {(['playlists', 'albums', 'artists'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-purple-600 text-white shadow-glow-primary/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'playlists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((pl) => (
            <MusicCard
              key={pl.id}
              item={pl}
              type="playlist"
              onClick={() => navigate(`/playlist/${pl.id}`)}
            />
          ))}
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((alb) => (
            <MusicCard
              key={alb.id}
              item={alb}
              type="album"
              onClick={() => navigate(`/album/${alb.id}`)}
            />
          ))}
        </div>
      )}

      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer group"
            >
              <img
                src={artist.avatarImage}
                alt={artist.name}
                className="w-24 h-24 rounded-full object-cover mb-3 border border-white/10 group-hover:scale-105 transition-transform"
              />
              <h4 className="font-semibold text-sm text-white truncate max-w-full">{artist.name}</h4>
              <p className="text-xs text-slate-400 truncate">{artist.genres[0]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Playlist Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Playlist">
        <form onSubmit={handleCreatePlaylist} className="space-y-4">
          <Input
            label="Playlist Title"
            placeholder="e.g. Midnight Cyber Synthwave"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Description (Optional)"
            placeholder="e.g. Atmospheric tracks for late night study..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" type="submit" isLoading={isSubmitting} glow>
              <FolderPlus className="w-4 h-4 mr-1.5" /> Create Playlist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
