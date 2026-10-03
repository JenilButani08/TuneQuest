import genresJson from '../data/genres.json';

export interface GenreItem {
  id: string;
  name: string;
  color: string;
  image: string;
  songCount: number;
}

export interface ActivityMoodItem {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
  tag: string;
}

export const mockGenres: GenreItem[] = genresJson.genres as GenreItem[];
export const mockActivities: ActivityMoodItem[] = genresJson.activities as ActivityMoodItem[];
