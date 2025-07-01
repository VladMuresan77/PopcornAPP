
import type { MovieTypes, ExtendedMovieType } from "../types/movieTypes";

export const moviesData: MovieTypes[] = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

export const recommendedMovies: ExtendedMovieType[] = [
  {
    imdbID: "tt1751634",
    Title: "The Sandman",
    Year: "2022",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNjY5MGQ3N2EtZmFjYy00ODUwLTk1MzctZWIzNDQ0ZTZiNzRkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    runtime: 45,
    imdbRating: 7.7,
    userRating: 0,
    Plot:
      "Upon escaping after decades of imprisonment by a mortal wizard, Dream, the personification of dreams, sets about to reclaim his lost equipment.",
  },
  {
    imdbID: "tt15398776",
    Title: "Oppenheimer",
    Year: "2023",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZDk2MGI4ZDItZGU1Yy00ZmIxLTgzMzAtNmJhNzIzNjkxYzBhXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg",
    runtime: 180,
    imdbRating: 8.4,
    userRating: 0,
    Plot:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
  },
  {
    imdbID: "tt10919420",
    Title: "Squid Game",
    Year: "2021",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMTg2NzQxZmMtMzAwYy00OTVmLTgwZTEtN2EzNWRhZTcxNTdjXkEyXkFqcGdeQXVyMTQyMTMwOTk0._V1_SX300.jpg",
    runtime: 55,
    imdbRating: 8.0,
    userRating: 0,
    Plot:
      "Hundreds of cash-strapped contestants accept an invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
  },
];
