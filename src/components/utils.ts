import type { WatchedTypes } from '../types/movieTypes';

export function average(arr: (number | undefined | null)[]): string {
  const validNumbers = arr.filter(num => typeof num === 'number' && !isNaN(num));
  if (validNumbers.length === 0) return 'N/A';
  const sum = validNumbers.reduce((acc, val) => acc + val, 0);
  return (sum / validNumbers.length).toFixed(1);
}

export function AVGStats(movies: WatchedTypes[]) {
  const avgImdbRating = average(movies.map(movie => Number(movie.imdbRating)));
  const avgUserRating = average(movies.map(movie => Number(movie.userRating)));
  const totalRuntime = movies.reduce((acc, movie) => {
    const runtime = Number(movie.runtime);
    return acc + (isNaN(runtime) ? 0 : runtime);
  }, 0);
  const hours = Math.floor(totalRuntime / 60);
  const minutes = totalRuntime % 60;
  const formattedRuntime = isNaN(hours) || isNaN(minutes) ? 'N/A' : `${hours}h ${minutes} min`;
  return { avgImdbRating, avgUserRating, formattedRuntime };
}
