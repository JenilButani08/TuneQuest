import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Disc, Clock } from 'lucide-react';
import { musicService } from '../../services/music/musicService';
import { Album, Song } from '../../types';
import { Button } from '../../components/ui/Button';
import { SongRow } from '../../components/music/SongRow';
import { usePlayerStore } from '../../store/playerStore';
import { AddToPlaylistModal } from '../../components/music/AddToPlaylistModal';

export const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const { playSong } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      musicService.getAlbum(id).then(async (alb) => {
        if (alb) {
          setAlbum(alb);
          const allSongs = await musicService.getSongs();
          setSongs(allSongs.filter((s) => alb.songIds.includes(s.id)));
        }
      });
    }
  }, [id]);

  if (!album) {
    return <div className="text-center py-20 text-slate-400">Loading album details...</div>;
  }

  const totalDurationSeconds = songs.reduce((acc, s) => acc + s.duration, 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Album Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl object-cover shadow-2xl border border-white/10 flex-shrink-0"
        />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Album</span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white">{album.title}</h1>
          <p className="text-sm font-semibold text-slate-200">
            {album.artist} • {album.releaseYear} • {songs.length} songs, {totalMinutes} min
          </p>
          <p className="text-xs text-slate-400">Genre: {album.genre}</p>

          <div className="pt-2">
            {songs.length > 0 && (
              <Button
                variant="primary"
                size="md"
                glow
                onClick={() => playSong(songs[0], songs)}
              >
                <Play className="w-4 h-4 fill-current mr-2" /> Play Album
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <section className="space-y-2">
        <h3 className="text-lg font-bold text-white mb-2">Tracklist</h3>
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              playlistContext={songs}
              showAlbum={false}
              onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
            />
          ))}
        </div>
      </section>

      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
      />
    </div>
  );
};
