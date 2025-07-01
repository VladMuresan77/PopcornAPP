import React, { useState, useEffect, useCallback } from 'react';
import { moviesData } from '../DATA/moviesData';
import { FavoriteIcon, WatchedIcon, PlanToWatchIcon, Star } from '../components/Icons';
import type { WatchedTypes } from '../types/movieTypes';
import { AVGStats } from '../components/utils';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const initialRecommendedIDs = [
  'tt16311594', 'tt15398776', 'tt9100054', 'tt0111161', 'tt0068646', 'tt0468569', 'tt0137523', 'tt0109830', 'tt1375666',
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

const fetchMovieDetails = async (imdbID: string) => {
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
    const data = await res.json();
    if (data.Response === 'True' || data.imdbID) {
      return {
        imdbID: data.imdbID,
        Title: data.Title,
        Year: data.Year,
        Poster: data.Poster !== 'N/A' ? data.Poster : '/placeholder.jpg',
        runtime: parseInt(data.Runtime) || 0,
        imdbRating: parseFloat(data.imdbRating) || 0,
        userRating: 0,
        Plot: data.Plot || 'No description available.',
      };
    }
  } catch (error) {
    console.error('Eroare la fetch detalii film:', error);
  }
  return null;
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
  const [watchedMoviesState, setWatchedMoviesState] = useState<WatchedTypes>(watchedMovies);
  const [selectedMovie, setSelectedMovie] = useState<WatchedTypes[0] | null>(null);
  const [userRating, setUserRating] = useState<number | ''>('');
  const [movieResults, setMovieResults] = useState<WatchedTypes>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<WatchedTypes>([]);

  useEffect(() => {
    setWatchedMoviesState(watchedMovies);
  }, [watchedMovies]);

  // fetch recommended movies once
  useEffect(() => {
    (async () => {
      const movies = (
        await Promise.all(initialRecommendedIDs.map(id => fetchMovieDetails(id)))
      ).filter(Boolean) as WatchedTypes;
      setRecommendedMovies(movies);
    })();
  }, []);

  // fetch for search results on query change
  useEffect(() => {
    if (!query.trim()) {
      setMovieResults([]);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.Response === 'True' && Array.isArray(data.Search)) {
          const detailedMovies = (
            await Promise.all(data.Search.map((m: any) => fetchMovieDetails(m.imdbID)))
          ).filter(Boolean) as WatchedTypes;
          setMovieResults(detailedMovies);
        } else {
          setMovieResults([]);
        }
      } catch (error) {
        console.error('Eroare la fetch filme:', error);
        setMovieResults([]);
      }
    })();
  }, [query]);

  const { avgImdbRating, formattedRuntime } = AVGStats(watchedMoviesState);

  const avgUserRating =
    watchedMoviesState.length > 0
      ? (
          watchedMoviesState.reduce((acc, cur) => acc + (cur.userRating || 0), 0) / watchedMoviesState.length
        ).toFixed(1)
      : '0';

  const onSelectedMovie = useCallback((movie: WatchedTypes[0]) => {
    setSelectedMovie(movie);
    setUserRating(movie.userRating ?? '');
  }, []);

  const updateUserRating = (movieId: string, rating: number) => {
    setWatchedMoviesState(prev =>
      prev.map(m => (m.imdbID === movieId ? { ...m, userRating: rating } : m))
    );
  };

  const onSaveRating = () => {
    if (selectedMovie && userRating !== '') {
      updateUserRating(selectedMovie.imdbID, userRating);
      alert(`Yay! Rating saved! You give ${userRating} stars for the movie ${selectedMovie.Title}`);
    }
  };

  const moviesToShow = query.trim() === '' ? recommendedMovies : movieResults;

  return (
    <div className="min-h-screen pt-30 py-20 flex items-center flex-col justify-center">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 border border-gray-600/30 rounded-2xl bg-black/40 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-6 transition-all duration-200">
        {/* Left Column: Recommended-Search movies */}
        <div className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 overflow-y-auto h-[30rem]">
          <h1 className="text-2xl text-white font-bold text-center mb-6">
            {query.trim() === '' ? 'Recommended Movies' : 'Movies'}
          </h1>
          <ul className="space-y-3">
            {moviesToShow.map(movie => (
              <li
                key={movie.imdbID}
                className="flex items-center gap-4 text-lg cursor-pointer hover:bg-gray-600 rounded p-2"
                onClick={() => onSelectedMovie(movie)}
              >
                <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-24 h-auto rounded" />
                <div>
                  <h3 className="text-gray-200 text-left -mt-4">{movie.Title}</h3>
                  <p className="text-gray-400 text-sm text-left">📅 Year: {movie.Year}</p>
                  <p className="text-gray-400 text-sm text-left">⭐ IMDB: {movie.imdbRating}</p>
                </div>
              {/*Icons: heart, check, pin*/ }
                <div className="flex gap-2 ml-auto">
                  <FavoriteIcon
                    filled={favoriteMovies.some(m => m.imdbID === movie.imdbID)}
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                  />
                  <WatchedIcon
                    filled={watchedMoviesState.some(m => m.imdbID === movie.imdbID)}
                    onClick={e => {
                      e.stopPropagation();
                      toggleWatched(movie);
                    }}
                  />
                  <PlanToWatchIcon
                    filled={planToWatchMovies.some(m => m.imdbID === movie.imdbID)}
                    onClick={e => {
                      e.stopPropagation();
                      addToPlanToWatch(movie);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Watched Movies-Selected Movie Detail */}
        <div className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 h-[30rem] overflow-y-auto text-gray-300">
          {selectedMovie ? (
            <>
              <button
                onClick={() => setSelectedMovie(null)}
                className="mb-6 text-xl text-gray-400 hover:underline flex items-start"
              >
                {/*  When the user clicks on a movie, show details and rating */}
                ⮜
              </button>
              <h2 className="text-2xl font-semibold mb-4 text-center">{selectedMovie.Title}</h2>
              <img
                src={selectedMovie.Poster}
                alt={`${selectedMovie.Title} Poster`}
                className="w-48 mx-auto rounded mb-4"
              />
              <p><strong>Year:</strong> {selectedMovie.Year}</p>
              <p><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
              <p><strong>Runtime:</strong> {selectedMovie.runtime} min</p>
              {selectedMovie.Plot && (
                <p className="mt-3 italic text-gray-300"><strong>Description:</strong> {selectedMovie.Plot}</p>
              )}

              <div className="mt-6">
                <label className="block mb-1">Rating</label>
                <div className="flex items-center justify-center gap-2">
                  {[...Array(10)].map((_, i) => {
                    const star = i + 1;
                    return (
                      <Star
                        key={star}
                        filled={userRating !== '' && userRating >= star}
                        onClick={() => setUserRating(star)}
                      />
                    );
                  })}
                  <span className="ml-2 text-sm text-gray-300">
                    {userRating !== '' ? `${userRating}/10` : 'No rating'}
                  </span>
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
                <p>{watchedMoviesState.length} Movies watched</p>
                <p>⭐ Average IMDB rating: {avgImdbRating}</p>
                <p>💫 User rating: {avgUserRating}</p>
                <p>⏳ Total time: {formattedRuntime}</p>
              </div>
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {watchedMoviesState.map(movie => (
                  <li
                    key={movie.imdbID}
                    className="flex items-center justify-between gap-4 text-lg cursor-pointer hover:bg-gray-600 rounded p-2"
                    onClick={() => onSelectedMovie(movie)}
                  >
                    <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-20 h-auto rounded" />
                    <div>
                      <h3>{movie.Title}</h3>
                      <p className="text-sm text-gray-400">💫 Your Rating: {movie.userRating ?? 'n/a'}</p>
                    </div>
                    <p className="text-sm">{movie.Year}</p>
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
