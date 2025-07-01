import type { WatchedTypes } from '../types/movieTypes';

export function average(arr: (number | undefined | null)[]): string {
  const sum = (acc: number | null | undefined, val: number | null | undefined): number => {
    return (acc ?? 0) + (val ?? 0);
  };

  const validNumbers = arr.filter((num): num is number => typeof num === 'number' && !isNaN(num));
  if (validNumbers.length === 0) return 'N/A';

  const total = validNumbers.reduce(sum, 0);
  return (total / validNumbers.length).toFixed(1);
}

export function AVGStats(movies: WatchedTypes[]) {
  const avgImdbRating = average(movies.map(movie => movie.imdbRating));
  const avgUserRating = average(movies.map(movie => movie.userRating));
  const totalRuntime = movies.reduce((acc, movie) => {
    return acc + (isNaN(movie.runtime) ? 0 : movie.runtime);
  }, 0);

  if (totalRuntime === 0) return { avgImdbRating, avgUserRating, formattedRuntime: 'N/A' };

  const hours = Math.floor(totalRuntime / 60);
  const minutes = totalRuntime % 60;
  const formattedRuntime = `${hours}h ${minutes} min`;

  return { avgImdbRating, avgUserRating, formattedRuntime };
}
