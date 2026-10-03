import { Playlist } from '../../types';
import { mockPlaylists } from '../../mock/playlists';
import { apiClient } from '../api/apiClient';

const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

let runtimePlaylists: Playlist[] = [...mockPlaylists];

class PlaylistService {
  public async getPlaylists(): Promise<Playlist[]> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 100));
      return [...runtimePlaylists];
    }
    return await apiClient.get<Playlist[]>('/playlists');
  }

  public async getPlaylist(id: string): Promise<Playlist | null> {
    if (IS_DEMO_MODE) {
      return runtimePlaylists.find((p) => p.id === id) || null;
    }
    return await apiClient.get<Playlist>(`/playlists/${id}`);
  }

  public async createPlaylist(title: string, description: string = ''): Promise<Playlist> {
    if (IS_DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 200));
      const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        title: title.trim() || 'My Favorite Quest List',
        description: description.trim() || 'Curated tunes on TuneQuest',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        ownerId: 'usr_music_explorer_01',
        ownerName: 'Alex Rivers',
        songIds: [],
        isPublic: true,
        createdAt: new Date().toISOString(),
      };
      runtimePlaylists = [newPlaylist, ...runtimePlaylists];
      return newPlaylist;
    }

    return await apiClient.post<Playlist>('/playlists', { title, description });
  }

  public async addSong(playlistId: string, songId: string): Promise<Playlist> {
    if (IS_DEMO_MODE) {
      runtimePlaylists = runtimePlaylists.map((pl) => {
        if (pl.id === playlistId && !pl.songIds.includes(songId)) {
          return { ...pl, songIds: [...pl.songIds, songId] };
        }
        return pl;
      });
      return runtimePlaylists.find((p) => p.id === playlistId)!;
    }

    return await apiClient.post<Playlist>(`/playlists/${playlistId}/songs`, { songId });
  }

  public async removeSong(playlistId: string, songId: string): Promise<Playlist> {
    if (IS_DEMO_MODE) {
      runtimePlaylists = runtimePlaylists.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, songIds: pl.songIds.filter((id) => id !== songId) };
        }
        return pl;
      });
      return runtimePlaylists.find((p) => p.id === playlistId)!;
    }

    return await apiClient.post<Playlist>(`/playlists/${playlistId}/songs/${songId}/remove`);
  }

  public async deletePlaylist(playlistId: string): Promise<void> {
    if (IS_DEMO_MODE) {
      runtimePlaylists = runtimePlaylists.filter((p) => p.id !== playlistId);
      return;
    }

    await apiClient.post(`/playlists/${playlistId}/delete`);
  }
}

export const playlistService = new PlaylistService();
