import React, { useState, useEffect } from 'react';
import { Plus, Check, FolderPlus } from 'lucide-react';
import { Song, Playlist } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { playlistService } from '../../services/playlist/playlistService';
import { useUIStore } from '../../store/uiStore';

export interface AddToPlaylistModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  song,
  isOpen,
  onClose,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [addedPlaylistIds, setAddedPlaylistIds] = useState<Set<string>>(new Set());
  const { addToast } = useUIStore();

  useEffect(() => {
    if (isOpen) {
      playlistService.getPlaylists().then((lists) => {
        setPlaylists(lists);
        if (song) {
          const containing = lists.filter((p) => p.songIds.includes(song.id)).map((p) => p.id);
          setAddedPlaylistIds(new Set(containing));
        }
      });
    }
  }, [isOpen, song]);

  if (!song) return null;

  const handleToggleSong = async (pl: Playlist) => {
    if (addedPlaylistIds.has(pl.id)) {
      await playlistService.removeSong(pl.id, song.id);
      setAddedPlaylistIds((prev) => {
        const next = new Set(prev);
        next.delete(pl.id);
        return next;
      });
      addToast({ type: 'info', title: 'Removed from playlist', message: `${song.title} removed from ${pl.title}` });
    } else {
      await playlistService.addSong(pl.id, song.id);
      setAddedPlaylistIds((prev) => new Set(prev).add(pl.id));
      addToast({ type: 'success', title: 'Added to playlist', message: `${song.title} added to ${pl.title}` });
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      const created = await playlistService.createPlaylist(newTitle.trim());
      await playlistService.addSong(created.id, song.id);
      setPlaylists([created, ...playlists]);
      setAddedPlaylistIds((prev) => new Set(prev).add(created.id));
      setNewTitle('');
      addToast({ type: 'success', title: 'Playlist Created!', message: `Added ${song.title} to ${created.title}` });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141420] border border-slate-800 mb-4">
        <img src={song.coverImage} alt={song.title} className="w-12 h-12 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">{song.title}</p>
          <p className="text-xs text-slate-400 truncate">{song.artist}</p>
        </div>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {playlists.map((pl) => {
          const isAdded = addedPlaylistIds.has(pl.id);
          return (
            <button
              key={pl.id}
              onClick={() => handleToggleSong(pl)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                isAdded
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                  : 'bg-surface border-slate-800/80 hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="truncate pr-2">
                <p className="text-sm font-medium truncate">{pl.title}</p>
                <p className="text-xs text-slate-500">{pl.songIds.length} tracks</p>
              </div>
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  isAdded ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700'
                }`}
              >
                {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 text-slate-400" />}
              </div>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleCreateNew} className="pt-3 border-t border-slate-800/80 flex gap-2">
        <Input
          placeholder="New playlist title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Button type="submit" variant="primary" size="md" isLoading={isCreating}>
          <FolderPlus className="w-4 h-4 mr-1" /> Create
        </Button>
      </form>
    </Modal>
  );
};
