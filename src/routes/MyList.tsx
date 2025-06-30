import React from 'react';
import { FavoriteIcon } from '../components/Icons';
import type { MovieTypes } from '../types/movieTypes';

type Props = {
  query: string;
  favoriteMovies: MovieTypes[];
  planToWatchMovies: MovieTypes[];
  toggleFavorite: (movie: MovieTypes) => void;
  addToPlanToWatch: (movie: MovieTypes) => void;
};

const MyList = ({
  query,
  favoriteMovies,
  planToWatchMovies,
  toggleFavorite,
  addToPlanToWatch,
}: Props) => {
  const filteredFavorites = favoriteMovies.filter((movie) =>
    movie.Title.toLowerCase().includes(query.toLowerCase())
  );
  const filteredPlanToWatch = planToWatchMovies.filter((movie) =>
    movie.Title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 border border-gray-600/30 rounded-2xl bg-black/40 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-6 transition-all duration-200">

        {/* Favorite Movies */}
        <div className="flex-1 max-w-[42rem] bg-gray-800 rounded-lg p-4 h-[30rem] overflow-y-auto custom-scrollbar">
          <h1 className="text-2xl text-white font-bold text-center mb-6">Favorite Movies</h1>
          <ul className="space-y-3">
            {filteredFavorites.length === 0 && (
              <li className="text-center text-gray-400">No favorite movies match your search.</li>
            )}
            {filteredFavorites.map((movie) => {
              const isFavv = favoriteMovies.some((m) => m.imdbID === movie.imdbID);
              return (
                <li key={movie.imdbID} className="flex items-center gap-4 p-2 rounded-lg bg-gray-600/80 hover:bg-gray-800 shadow-md cursor-pointer transition duration-150">
                  <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-20 sm:w-24 h-auto rounded" />
                  <h3 className="text-white text-sm sm:text-base flex-grow">{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓️</span> <span className="text-gray-400">{movie.Year}</span>
                    </p>
                    <p>
                      <span>⭐</span> <span className="text-gray-400">{movie.imdbRating}</span>
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie);
                    }}
                    className="ml-2"
                  >
                    <FavoriteIcon filled={isFavv} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Plan to Watch */}
        <div className="flex-1 max-w-[42rem] bg-gray-800 rounded-lg p-4 h-[30rem] overflow-y-auto">
          <h2 className="text-2xl text-white font-bold text-center mb-6">Plan to Watch</h2>
          {filteredPlanToWatch.length === 0 ? (
            <p className="text-center text-gray-400">No movies in your plan to watch list.</p>
          ) : (
            <ul className="space-y-4">
              {filteredPlanToWatch.map((movie) => (
                <li key={movie.imdbID} className="flex items-center gap-3 bg-gray-600/70 p-2 rounded-lg shadow-md">
                  <img src={movie.Poster} alt={`${movie.Title} Poster`} className="w-20 h-auto rounded-lg shadow" />
                  <div className="flex flex-col justify-between flex-1">
                    <h3 className="text-lg font-semibold text-white text-left">{movie.Title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-gray-300">
                      <p>
                        <span className="mr-1">⭐</span> <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span className="mr-1">⏳</span> <span>{movie.runtime} min</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToPlanToWatch(movie);
                    }}
                    className="bg-slate-800 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </main>
    </div>
  );
};

export default MyList;
