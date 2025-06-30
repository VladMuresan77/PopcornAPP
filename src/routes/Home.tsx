import React, { useState, useEffect } from 'react';
import { moviesData } from '../DATA/moviesData';

import { FavoriteIcon, WatchedIcon, PlanToWatchIcon,Star } from '../components/Icons';
import type { WatchedTypes } from '../types/movieTypes';

import { AVGStats } from '../components/utils';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const initialRecommendedIDs = [
  'tt0245429',
  'tt15398776',
  'tt9100054',
  'tt0111161',
  'tt0068646',
  'tt0468569',
  'tt0137523',
  'tt0109830',
  'tt1375666',
];

type Props = {
  query: string;
  favoriteMovies: WatchedTypes;
  watchedMovies: WatchedTypes;
  planToWatchMovies: WatchedTypes;
  toggleFavorite: (movie: typeof moviesData[0]) => void;
  toggleWatched: (movie: typeof moviesData[0]) => void;
  addToPlanToWatch: (movie: typeof moviesData[0]) => void;
};



const Home = ({
  query,
  favoriteMovies,
  watchedMovies,
  planToWatchMovies,
  toggleFavorite,
  toggleWatched,
  addToPlanToWatch,
}: Props) => {
  // Stare locală pentru a putea actualiza userRating pe filmele văzute
  const [watchedMoviesState, setWatchedMoviesState] = useState<WatchedTypes>([]);

  useEffect(() => {
    setWatchedMoviesState(watchedMovies);
  }, [watchedMovies]);

  const [selectedMovie, setSelectedMovie] = useState<WatchedTypes[0] | null>(null);
  const [userRating, setUserRating] = useState<number | ''>('');

  const { avgImdbRating, formattedRuntime } = AVGStats(watchedMoviesState);

  // Calculează media ratingului utilizator
  const avgUserRating =
    watchedMoviesState.length > 0
      ? (
          watchedMoviesState.reduce((acc, cur) => acc + (cur.userRating || 0), 0) /
          watchedMoviesState.length
        ).toFixed(1)
      : '0';

  const onSelectedMovie = (movie: WatchedTypes[0]) => {
    setSelectedMovie(movie);
    setUserRating(movie.userRating || '');
  };

  const updateUserRating = (movieId: string, rating: number) => {
    setWatchedMoviesState((prev) =>
      prev.map((m) =>
        m.imdbID === movieId
          ? {
              ...m,
              userRating: rating,
            }
          : m
      )
    );
  };

  const onSaveRating = () => {
    if (selectedMovie && userRating !== '') {
      updateUserRating(selectedMovie.imdbID, userRating);
      alert(`Salvat rating ${userRating} pentru filmul ${selectedMovie.Title}`);
    }
  };

  const [movieResults, setMovieResults] = useState<WatchedTypes>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<WatchedTypes>([]);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        const movies = await Promise.all(
          initialRecommendedIDs.map(async (imdbID) => {
            const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
            const detailsData = await detailsRes.json();

            return {
              imdbID: detailsData.imdbID,
              Title: detailsData.Title,
              Year: detailsData.Year,
              Poster: detailsData.Poster !== 'N/A' ? detailsData.Poster : '/placeholder.jpg',
              runtime: parseInt(detailsData.Runtime) || 0,
              imdbRating: parseFloat(detailsData.imdbRating) || 0,
              userRating: 0,
              Plot: detailsData.Plot || 'No description available.',
            };
          })
        );

        setRecommendedMovies(movies);
      } catch (error) {
        console.error('Eroare la fetch filme recomandate:', error);
      }
    };

    fetchRecommendedMovies();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) {
        setMovieResults([]);
        return;
      }

      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}`);
        const data = await res.json();

        if (data.Response === 'True') {
          const detailedMovies = await Promise.all(
            data.Search.map(async (m: any) => {
              const detailsRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${m.imdbID}`);
              const detailsData = await detailsRes.json();

              return {
                imdbID: m.imdbID,
                Title: m.Title,
                Year: m.Year,
                Poster: m.Poster !== 'N/A' ? m.Poster : '/placeholder.jpg',
                runtime: parseInt(detailsData.Runtime) || 0,
                imdbRating: parseFloat(detailsData.imdbRating) || 0,
                userRating: 0,
                Plot: detailsData.Plot || 'No description available.',
              };
            })
          );

          setMovieResults(detailedMovies);
        } else {
          setMovieResults([]);
        }
      } catch (error) {
        console.error('Eroare la fetch filme:', error);
        setMovieResults([]);
      }
    };

    fetchMovies();
  }, [query]);

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 border border-gray-600/30 rounded-2xl bg-black/40 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-6 transition-all duration-200">
        {/* Coloana 1: Filme rezultate / recomandate */}
        <div className="flex-1 max-w-[42rem] bg-gray-800 rounded-lg p-4 overflow-y-auto h-[30rem]">
          <h1 className="text-2xl text-white font-bold text-center mb-6">{query === '' ? 'Recommended Movies' : 'Movies'}</h1>
          <ul className="space-y-3">
            {(query === '' ? recommendedMovies : movieResults).map((movie) => (
              <li
                key={movie.imdbID}
                className="flex items-center gap-4 text-lg cursor-pointer hover:bg-gray-600 rounded p-2"
                onClick={() => onSelectedMovie(movie)}
              >
                <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-24 h-auto rounded" />
                <div>
                  <h3 className="text-gray-200 text-left -mt-4">{movie.Title}</h3>
                  <p className="text-gray-400 text-sm text-left">
                    <span>📅 Year:</span> {movie.Year}
                  </p>
                  <p className="text-gray-400 text-sm text-left">
                    <span>⭐ IMDB:</span> {movie.imdbRating}
                  </p>
                </div>
                <div className="flex gap-2 ml-auto">
                  <span>
                    <FavoriteIcon
                      filled={favoriteMovies.some((m) => m.imdbID === movie.imdbID)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(movie);
                      }}
                    />
                  </span>

                  <span>
                    <WatchedIcon
                      filled={watchedMoviesState.some((m) => m.imdbID === movie.imdbID)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatched(movie);
                      }}
                    />
                  </span>

                  <span>
                    <PlanToWatchIcon
                      filled={planToWatchMovies.some((m) => m.imdbID === movie.imdbID)}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToPlanToWatch(movie);
                      }}
                    />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Coloana 2: Watched */}
        <div className="flex-1 max-w-[42rem] bg-gray-800 rounded-lg p-4 h-[30rem] overflow-y-auto text-gray-300">
          {selectedMovie ? (
            <>
              <button
                onClick={() => setSelectedMovie(null)}
                className="mb-6 text-xl text-gray-400 hover:underline flex items-start"
              >
                ⮜
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-center">{selectedMovie.Title}</h2>
              <img src={selectedMovie.Poster} alt={`${selectedMovie.Title} Poster`} className="w-48 mx-auto rounded mb-4" />
              <p>
                <strong>Year:</strong> {selectedMovie.Year}
              </p>
              <p>
                <strong>IMDB Rating:</strong> {selectedMovie.imdbRating}
              </p>
              <p>
                <strong>Runtime:</strong> {selectedMovie.runtime} min
              </p>
              {selectedMovie.Plot && (
                <p className="mt-3 italic text-gray-300">
                  <strong>Description:</strong> {selectedMovie.Plot}
                </p>
              )}

              <div className="mt-6">
                <label className="block mb-1">Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9,10].map((star) => (
                    <Star
                      key={star}
                      filled={userRating !== '' && userRating >= star}
                      onClick={() => setUserRating(star)}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-300">{userRating !== '' ? `${userRating}/10` : 'No rating'}</span>
                </div>
                <button
                  onClick={onSaveRating}
                  className="mt-3 bg-slate-700 hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded mx-auto block"
                >
                  Save Rating
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl text-white font-bold text-center mb-6">Watched Movies</h2>
              <div className="text-center text-gray-300 space-y-1 mb-4">
                <p>{watchedMoviesState.length} filme văzute</p>
                <p>⭐ Rating IMDB mediu: {avgImdbRating}</p>
                <p>💫 Rating utilizator: {avgUserRating}</p>
                <p>⏳ Timp total: {formattedRuntime}</p>
              </div>
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {watchedMoviesState.map((movie) => (
                  <li
                    key={movie.imdbID}
                    className="flex items-center justify-between gap-4 text-lg cursor-pointer hover:bg-gray-600 rounded p-2"
                    onClick={() => onSelectedMovie(movie)}
                  >
                    <img src={movie.Poster} alt={`${movie.Title} Poster`} className='w-20 h-auto rounded' />

                    <div>
                      <h3>{movie.Title}</h3>
                      <p className="text-sm text-gray-400">
                        Rating utilizator: {movie.userRating ?? 'n/a'}
                      </p>
                    </div>
                    <p>{movie.Year}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
