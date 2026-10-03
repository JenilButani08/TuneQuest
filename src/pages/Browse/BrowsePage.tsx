import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Flame, Sparkles, Disc, Radio, Activity } from 'lucide-react';
import { mockGenres, mockActivities } from '../../mock/genres';
import { musicService } from '../../services/music/musicService';
import { Song, Artist, Album } from '../../types';
import { MusicCard } from '../../components/music/MusicCard';
import { usePlayerStore } from '../../store/playerStore';

export const BrowsePage: React.FC = () => {
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [allRealSongs, setAllRealSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const { playSong } = usePlayerStore();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      musicService.getTrending(),
      musicService.getArtists(),
      musicService.getAlbums(),
      musicService.getSongs(),
    ]).then(([t, art, alb, allSongs]) => {
      setTrendingSongs(t);
      setArtists(art);
      setAlbums(alb);
      setAllRealSongs(allSongs);
    });
  }, []);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white flex items-center gap-3">
          <Compass className="w-8 h-8 text-purple-400" /> Browse & Discover
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore soundscapes across genres, moods, high-energy activities, and top global artists.
        </p>
      </div>

      {/* Full-Length Studio Master Tracks (29 Tracks - 256kbps) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" /> Full Studio Master Songs ({allRealSongs.length} Tracks)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              100% full-length, high-fidelity (256kbps) original master audio — zero short clips.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (allRealSongs.length > 0) playSong(allRealSongs[0], allRealSongs);
              }}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors flex items-center gap-2 shadow-soft-md"
            >
              Play All ({allRealSongs.length})
            </button>
            <button
              onClick={() => {
                if (allRealSongs.length > 0) {
                  const shuffled = [...allRealSongs].sort(() => Math.random() - 0.5);
                  playSong(shuffled[0], shuffled);
                }
              }}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-surface-secondary border border-border hover:bg-surface text-text-primary transition-colors flex items-center gap-2"
            >
              Shuffle
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {allRealSongs.map((song) => (
            <MusicCard
              key={song.id}
              item={song}
              type="song"
              playlistContext={allRealSongs}
            />
          ))}
        </div>
      </section>

      {/* Music for Activities & Moods */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" /> Soundtracks by Activity & Mood
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => {
                if (trendingSongs.length > 0) playSong(trendingSongs[0], trendingSongs);
              }}
              className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card p-4 flex flex-col justify-end cursor-pointer group border border-white/10"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${act.image})` }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${act.color} opacity-85 group-hover:opacity-75 transition-opacity`} />
              <div className="relative z-10">
                <span className="text-[10px] font-bold tracking-wider uppercase text-white/80 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                  {act.tag}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1 leading-tight">{act.name}</h4>
                <p className="text-[11px] text-white/70 truncate">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Genres Grid */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-pink-400" /> Explore by Genre
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockGenres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => {
                const genreSongs = trendingSongs.filter((s) => s.genre.toLowerCase().includes(genre.id));
                if (genreSongs.length > 0) {
                  playSong(genreSongs[0], genreSongs);
                } else if (trendingSongs.length > 0) {
                  playSong(trendingSongs[0], trendingSongs);
                }
              }}
              className={`relative h-28 rounded-2xl overflow-hidden glass-card p-4 flex flex-col justify-between cursor-pointer group bg-gradient-to-br ${genre.color} border border-white/10`}
            >
              <div className="relative z-10">
                <h4 className="font-bold text-white text-base leading-snug">{genre.name}</h4>
                <p className="text-[11px] text-white/70">{genre.songCount} Curated Tracks</p>
              </div>
              <img
                src={genre.image}
                alt={genre.name}
                className="absolute -right-2 -bottom-2 w-18 h-18 rounded-xl object-cover rotate-12 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Featured Creators
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {artists.slice(0, 5).map((artist) => (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="glass-card p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer group"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 border-2 border-purple-500/20 group-hover:border-purple-500 transition-colors shadow-lg">
                <img
                  src={artist.avatarImage}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h4 className="font-semibold text-sm text-white truncate max-w-full">{artist.name}</h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">{artist.genres[0]}</p>
              <span className="text-[10px] text-purple-300 font-mono mt-1">
                {(artist.monthlyListeners / 1000).toFixed(0)}k listeners
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* New Releases & Albums */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Disc className="w-5 h-5 text-amber-400" /> Notable Releases & EP Records
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
};
