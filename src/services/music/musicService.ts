import { Song, Artist, Album, Playlist } from '../../types';
import { mockSongs } from '../../mock/songs';
import { mockArtists } from '../../mock/artists';
import { mockAlbums } from '../../mock/albums';
import { mockPlaylists } from '../../mock/playlists';
import { apiClient } from '../api/apiClient';

const IS_DEMO_MODE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEMO_MODE) !== 'false';

// In-memory working copy for dynamic updates in demo mode
let runtimeSongs: Song[] = [...mockSongs];
let runtimeLikedIds = new Set<string>(
  mockSongs.filter((s) => s.isLiked).map((s) => s.id)
);

export interface SearchResults {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

class MusicService {
  public async getSongs(): Promise<Song[]> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 150));
      return [...runtimeSongs];
    }
    return await apiClient.get<Song[]>('/music/songs');
  }

  public async getSong(id: string): Promise<Song | null> {
    if (IS_DEMO_MODE) {
      const found = runtimeSongs.find((s) => s.id === id);
      return found || null;
    }
    return await apiClient.get<Song>(`/music/songs/${id}`);
  }

  public async getTrending(): Promise<Song[]> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 120));
      return [...runtimeSongs].sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 10);
    }
    return await apiClient.get<Song[]>('/music/trending');
  }

  public async getRecommendations(): Promise<Song[]> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 150));
      return [...runtimeSongs].slice(5, 15);
    }
    return await apiClient.get<Song[]>('/music/recommendations');
  }

  public async getArtists(): Promise<Artist[]> {
    if (IS_DEMO_MODE) {
      return [...mockArtists];
    }
    return await apiClient.get<Artist[]>('/music/artists');
  }

  public async getArtist(id: string): Promise<Artist | null> {
    if (IS_DEMO_MODE) {
      return mockArtists.find((a) => a.id === id) || null;
    }
    return await apiClient.get<Artist>(`/music/artists/${id}`);
  }

  public async getAlbums(): Promise<Album[]> {
    if (IS_DEMO_MODE) {
      return [...mockAlbums];
    }
    return await apiClient.get<Album[]>('/music/albums');
  }

  public async getAlbum(id: string): Promise<Album | null> {
    if (IS_DEMO_MODE) {
      return mockAlbums.find((a) => a.id === id) || null;
    }
    return await apiClient.get<Album>(`/music/albums/${id}`);
  }

  public async search(query: string, filter: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all'): Promise<SearchResults> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 180));
      const q = query.toLowerCase().trim();
      if (!q) {
        return { songs: [], artists: [], albums: [], playlists: [] };
      }

      const matchSongs = (filter === 'all' || filter === 'songs')
        ? runtimeSongs.filter(
            (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q)
          )
        : [];

      const matchArtists = (filter === 'all' || filter === 'artists')
        ? mockArtists.filter(
            (a) => a.name.toLowerCase().includes(q) || a.genres.some((g) => g.toLowerCase().includes(q))
          )
        : [];

      const matchAlbums = (filter === 'all' || filter === 'albums')
        ? mockAlbums.filter(
            (al) => al.title.toLowerCase().includes(q) || al.artist.toLowerCase().includes(q)
          )
        : [];

      const matchPlaylists = (filter === 'all' || filter === 'playlists')
        ? mockPlaylists.filter(
            (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          )
        : [];

      return {
        songs: matchSongs,
        artists: matchArtists,
        albums: matchAlbums,
        playlists: matchPlaylists,
      };
    }

    return await apiClient.get<SearchResults>(`/music/search?q=${encodeURIComponent(query)}&type=${filter}`);
  }

  public async toggleLikeSong(songId: string): Promise<boolean> {
    if (IS_DEMO_MODE) {
      const isCurrentlyLiked = runtimeLikedIds.has(songId);
      if (isCurrentlyLiked) {
        runtimeLikedIds.delete(songId);
      } else {
        runtimeLikedIds.add(songId);
      }

      runtimeSongs = runtimeSongs.map((s) =>
        s.id === songId ? { ...s, isLiked: !isCurrentlyLiked } : s
      );

      return !isCurrentlyLiked;
    }

    const res = await apiClient.post<{ isLiked: boolean }>(`/music/songs/${songId}/like`);
    return res.isLiked;
  }

  public async getLikedSongs(): Promise<Song[]> {
    if (IS_DEMO_MODE) {
      return runtimeSongs.filter((s) => runtimeLikedIds.has(s.id));
    }
    return await apiClient.get<Song[]>('/music/liked');
  }
}

export const musicService = new MusicService();
