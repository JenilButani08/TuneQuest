import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Music, User, Disc, FolderHeart, History, TrendingUp } from 'lucide-react';
import { musicService, SearchResults } from '../../services/music/musicService';
import { Song, Artist, Album, Playlist } from '../../types';
import { SongRow } from '../../components/music/SongRow';
import { MusicCard } from '../../components/music/MusicCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { AddToPlaylistModal } from '../../components/music/AddToPlaylistModal';
import { useNavigate } from 'react-router-dom';

const popularSearches = ['Synthwave', 'Midnight Reverie', 'Solaris Wave', 'Lo-Fi Chill', 'Quantum Pulse', 'Aria Sharma'];

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all');
  const [results, setResults] = useState<SearchResults>({ songs: [], artists: [], albums: [], playlists: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Solaris Wave',
    'Lo-Fi Study',
    'Cyber Electro',
  ]);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [], playlists: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await musicService.search(query, activeTab);
        setResults(res);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, activeTab]);

  const handleSelectSearch = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleClearQuery = () => {
    setQuery('');
    setResults({ songs: [], artists: [], albums: [], playlists: [] });
  };

  const totalResults =
    results.songs.length + results.artists.length + results.albums.length + results.playlists.length;

  return (
    <div className="space-y-6">
      {/* Search Header & Input */}
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-extrabold text-white">Search</h1>

        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to or challenge yourself on?"
            className="w-full bg-[#12121C] border border-slate-800 rounded-2xl pl-12 pr-12 py-3.5 text-base text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={handleClearQuery}
              className="absolute right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(['all', 'songs', 'artists', 'albums', 'playlists'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-glow-primary/40'
                    : 'bg-surface border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* When Query is empty: Show Recent & Popular searches */}
      {!query && (
        <div className="space-y-8 pt-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-purple-400" /> Recent Searches
                </span>
                <button
                  onClick={() => setRecentSearches([])}
                  className="hover:text-white text-slate-500 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectSearch(term)}
                    className="px-3 py-1.5 rounded-xl bg-surface border border-slate-800 text-xs font-medium text-slate-300 hover:border-purple-500/50 hover:text-white transition-all flex items-center gap-2"
                  >
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Popular on TuneQuest
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSelectSearch(term)}
                  className="px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs font-medium text-purple-300 hover:bg-purple-900/40 hover:border-purple-600 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-surface">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results Display */}
      {!isLoading && query && (
        <div className="space-y-8">
          {totalResults === 0 ? (
            /* Empty State */
            <div className="text-center py-16 space-y-3 glass-panel rounded-3xl p-8 border border-white/5">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">No results found for "{query}"</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Please check your spelling or try searching for another artist, song title, or genre.
              </p>
            </div>
          ) : (
            <>
              {/* Songs Section */}
              {results.songs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-400" /> Songs ({results.songs.length})
                  </h3>
                  <div className="space-y-1">
                    {results.songs.map((song, i) => (
                      <SongRow
                        key={song.id}
                        song={song}
                        index={i}
                        playlistContext={results.songs}
                        onAddToPlaylist={(s) => setSelectedSongForPlaylist(s)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Artists Section */}
              {results.artists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" /> Artists ({results.artists.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.artists.map((artist) => (
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
                        <h4 className="font-semibold text-sm text-white truncate max-w-full">
                          {artist.name}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {artist.genres[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Albums Section */}
              {results.albums.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Disc className="w-4 h-4 text-pink-400" /> Albums ({results.albums.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.albums.map((album) => (
                      <MusicCard
                        key={album.id}
                        item={album}
                        type="album"
                        onClick={() => navigate(`/album/${album.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Playlists Section */}
              {results.playlists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderHeart className="w-4 h-4 text-indigo-400" /> Playlists ({results.playlists.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {results.playlists.map((pl) => (
                      <MusicCard
                        key={pl.id}
                        item={pl}
                        type="playlist"
                        onClick={() => navigate(`/playlist/${pl.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        song={selectedSongForPlaylist}
        isOpen={!!selectedSongForPlaylist}
        onClose={() => setSelectedSongForPlaylist(null)}
      />
    </div>
  );
};
