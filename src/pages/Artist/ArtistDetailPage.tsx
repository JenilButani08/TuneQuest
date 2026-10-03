import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Heart, Users, Sparkles, ArrowLeft, Disc } from 'lucide-react';
import { musicService } from '../../services/music/musicService';
import { Artist, Song, Album } from '../../types';
import { Button } from '../../components/ui/Button';
import { SongRow } from '../../components/music/SongRow';
import { MusicCard } from '../../components/music/MusicCard';
import { usePlayerStore } from '../../store/playerStore';
import { AddToPlaylistModal } from '../../components/music/AddToPlaylistModal';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const { playSong } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      musicService.getArtist(id).then(async (art) => {
        if (art) {
          setArtist(art);
          const allSongs = await musicService.getSongs();
          const artistTracks = allSongs.filter((s) => s.artistId === art.id);
          setTopSongs(artistTracks);
          const allAlbums = await musicService.getAlbums();
          setAlbums(allAlbums.filter((a) => a.artistId === art.id));
        }
      });
    }
  }, [id]);

  if (!artist) {
    return <div className="text-center py-20 text-slate-400">Loading artist profile...</div>;
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 flex flex-col justify-end min-h-[280px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${artist.bannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080D] via-[#08080D]/70 to-transparent" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end gap-6">
          <img
            src={artist.avatarImage}
            alt={artist.name}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-purple-500/40 shadow-2xl flex-shrink-0"
          />
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
              Verified Creator
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white">{artist.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{artist.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span>{artist.monthlyListeners.toLocaleString()} monthly listeners</span>
              <span>•</span>
              <span>{artist.followers.toLocaleString()} followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-4">
        {topSongs.length > 0 && (
          <Button
            variant="primary"
            size="lg"
            glow
            onClick={() => playSong(topSongs[0], topSongs)}
          >
            <Play className="w-5 h-5 fill-current mr-2" /> Play Discography
          </Button>
        )}
      </div>

      {/* Top Songs */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white">Popular Tracks</h3>
        <div className="space-y-1">
          {topSongs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i}
              playlistContext={topSongs}
              onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
            />
          ))}
        </div>
      </section>

      {/* Albums */}
      {albums.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-purple-400" /> Albums
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {albums.map((album) => (
              <MusicCard
                key={album.id}
                item={album}
                type="album"
                onClick={() => navigate(`/album/${album.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
      />
    </div>
  );
};
