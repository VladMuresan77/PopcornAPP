export interface MovieTypes {
  imdbID: string;
  Title: string;
  Year: string | number;
  Poster: string;
}

export interface ExtendedMovieType extends MovieTypes {
  runtime: number;
  imdbRating: number;
  userRating: number;
  Plot: string;
}

export interface WatchedTypes extends ExtendedMovieType {}
