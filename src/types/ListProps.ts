
import type { MovieTypes, WatchedTypes } from './movieTypes';

export type ListProps = {
  query: string;
  favoriteMovies: MovieTypes[];
  watchedMovies: WatchedTypes[];
  planToWatchMovies: WatchedTypes[];
  toggleFavorite: (movie: MovieTypes) => void;
  toggleWatched: (movie: WatchedTypes) => void;
  addToPlanToWatch: (movie: WatchedTypes) => void;
  removeFromPlanToWatch: (movie: WatchedTypes) => void;
};
