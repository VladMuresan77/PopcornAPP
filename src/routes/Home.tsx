import { useState, useEffect, useCallback } from 'react';
import { FavoriteIcon, WatchedIcon, PlanToWatchIcon, Star } from '../components/Icons';
import type { WatchedTypes } from '../types/movieTypes';
import type { ListProps as Props } from '../types/ListProps';
import { AVGStats } from '../components/utils';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const initialRecommendedIDs = [
  'tt16311594', 'tt15398776', 'tt9100054', 'tt0111161',
  'tt0068646', 'tt0468569', 'tt0137523', 'tt0109830', 'tt1375666',
];

const fetchMovieDetails = async (imdbID: string): Promise<WatchedTypes | null> => {
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
    const data = await res.json();
    if (data.Response === 'True' && data.imdbID) {
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
  removeFromWatched, 
}: Props & { removeFromWatched?: (movie: WatchedTypes) => void }) => {
  const [watchedMoviesState, setWatchedMoviesState] = useState<WatchedTypes[]>(watchedMovies);
  const [selectedMovie, setSelectedMovie] = useState<WatchedTypes | null>(null);
  const [userRating, setUserRating] = useState<number | ''>('');
  const [movieResults, setMovieResults] = useState<WatchedTypes[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<WatchedTypes[]>([]);

  useEffect(() => {
    setWatchedMoviesState(watchedMovies);
  }, [watchedMovies]);

  useEffect(() => {
    (async () => {
      const movies = (
        await Promise.all(initialRecommendedIDs.map(id => fetchMovieDetails(id)))
      ).filter(Boolean) as WatchedTypes[];
      setRecommendedMovies(movies);
    })();
  }, []);

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
          ).filter(Boolean) as WatchedTypes[];
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

  const onSelectedMovie = useCallback((movie: WatchedTypes) => {
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

  
  const handleRemoveWatched = (movie: WatchedTypes) => {
    if (removeFromWatched) {
      removeFromWatched(movie);
    } else {
      setWatchedMoviesState(prev => prev.filter(m => m.imdbID !== movie.imdbID));
    }
  };

  const moviesToShow = query.trim() === '' ? recommendedMovies : movieResults;

  return (
    <div className="min-h-screen pt-30 py-20 flex items-center flex-col justify-center mt-20">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 border border-zinc-900/40 rounded-2xl bg-black/40 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-6 transition-all duration-200">
        <div className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 overflow-y-auto h-[30rem] ">
          <h1 className="text-2xl text-white font-bold text-center mb-8">
            {query.trim() === '' ? 'Recommended Movies' : 'Movies'}
          </h1>
          <ul className="space-y-3">
            {moviesToShow.map(movie => (
              <li
                key={movie.imdbID}
                className="flex items-center gap-4 text-lg cursor-pointer hover:bg-zinc-700 rounded p-3"
                onClick={() => onSelectedMovie(movie)}
              >
                <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-24 h-auto rounded" />
                <div className="flex flex-col justify-between w-full">
                <div>
                  <h3 className="text-gray-200 text-left truncate whitespace-nowrap min-w-[300px] flex gap-4">{movie.Title}</h3>
                 
                  <div className="flex gap-6 text-sm text-gray-400 mt-1 ">
                    <p>⭐ IMDB: {movie.imdbRating}</p>
                    <p>📅 Year: {movie.Year}</p></div>
                </div>
                <div className="flex gap-6 text-sm text-gray-400 mt-5">
                  <FavoriteIcon
                    filled={favoriteMovies.some(m => m.imdbID === movie.imdbID)}
                    onClick={() => toggleFavorite(movie)}
                  />
                  <WatchedIcon
                    filled={watchedMoviesState.some(m => m.imdbID === movie.imdbID)}
                    onClick={() => toggleWatched(movie)}
                  />
                  <PlanToWatchIcon
                    filled={planToWatchMovies.some(m => m.imdbID === movie.imdbID)}
                    onClick={() => addToPlanToWatch(movie)}
                  />
                  </div>
                </div>
                
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 h-[30rem] overflow-y-auto text-gray-300">
          {selectedMovie ? (
            <>
              <button
                onClick={() => setSelectedMovie(null)}
                className="mb-6 text-xl text-gray-400 hover:underline flex items-start"
              >
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
                  className="mt-3 bg-red-900 hover:bg-[#6e0b14] text-white font-semibold py-2 px-4 rounded mx-auto block"
                >
                  Save Rating
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl text-white font-bold text-center mb-8">Watched Movies</h2>
              <div className="text-center text-gray-300 space-y-1 mb-4">
                <p>{watchedMoviesState.length} Movies watched</p>
                <p>⭐ Average IMDB rating: {avgImdbRating}</p>
                <p>⏳ Average runtime: {formattedRuntime}</p>
                <p>💫 Your rating average: {avgUserRating}</p>
              </div>
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {watchedMoviesState.map(movie => (
                  <li
                    key={movie.imdbID}
                    className="flex items-center justify-between gap-4 text-lg cursor-pointer hover:bg-zinc-700 rounded p-2"
                    onClick={() => onSelectedMovie(movie)}
                  >
                    <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-20 h-auto rounded" />
                    <div>
                      <h3 className='text-gray-200 text-left  truncate whitespace-nowrap min-w-[300px] flex gap-4'>{movie.Title}</h3>
                      <p className="text-sm text-gray-400 flex flex-col justify-between w-full">💫 Your Rating: {movie.userRating ?? 'n/a'}</p>
                    {/* <p className="text-sm text-gray-400 flex flex-col justify-between w-full">{movie.Year}</p> */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveWatched(movie);
                      }}
                      className="bg-red-500 hover:bg-red-800 text-white  flex gap-10 mt-4 -ml-1 sm:ml-4 text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    </div>
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
