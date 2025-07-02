import { useMemo } from 'react';
import { FavoriteIcon } from '../components/Icons';
import type { WatchedTypes } from '../types/movieTypes';
import type { ListProps } from '../types/ListProps';

const MovieListItem = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onRemovePlanToWatch,
  showRemoveButton = false,
}: {
  movie: WatchedTypes;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: WatchedTypes) => void;
  onRemovePlanToWatch?: (movie: WatchedTypes) => void;
  showRemoveButton?: boolean;
}) => {
  return (
    <li
      className={`flex items-center gap-4 p-2 rounded-lg shadow-md cursor-pointer transition duration-150 ${
        showRemoveButton ? 'bg-gray-600/70' : 'bg-gray-600/80 hover:bg-gray-800'
      }`}
      onClick={() => {}}
    >
      <img
        src={movie.Poster}
        alt={`${movie.Title} Poster`}
        className={`w-20 h-auto rounded ${showRemoveButton ? 'rounded-lg shadow' : ''}`}
      />
      <div className={showRemoveButton ? 'flex flex-col justify-between flex-1' : 'flex-grow'}>
        <h3 className={`text-white ${showRemoveButton ? 'text-lg font-semibold text-left' : 'text-sm sm:text-base'}`}>
          {movie.Title}
        </h3>
        {showRemoveButton && (
          <div className="flex gap-4 mt-2 text-sm text-gray-300">
            <p>
              <span className="mr-1">⭐</span> {movie.imdbRating}
            </p>
            <p>
              <span className="mr-1">⏳</span> {movie.runtime} min
            </p>
          </div>
        )}
      </div>

      {!showRemoveButton && onToggleFavorite && (
        <div className="flex flex-col items-center">
          <div>
            <p>
              <span role="img" aria-label="Year">
                🗓️
              </span>{' '}
              <span className="text-gray-400">{movie.Year}</span>
            </p>
            <p>
              <span role="img" aria-label="IMDB">
                ⭐
              </span>{' '}
              <span className="text-gray-400">{movie.imdbRating}</span>
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            className="ml-2"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FavoriteIcon filled={!!isFavorite} onClick={() => {}} />
          </button>
        </div>
      )}

      {showRemoveButton && onRemovePlanToWatch && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemovePlanToWatch(movie);
          }}
          className="bg-slate-800 hover:bg-slate-600 text-white text-xs px-3 py-1 rounded"
        >
          Remove
        </button>
      )}
    </li>
  );
};

const MyList = ({
  query,
  favoriteMovies,
  planToWatchMovies,
  toggleFavorite,
  removeFromPlanToWatch,
}: ListProps) => {
  const filteredFavorites = useMemo(
    () => favoriteMovies.filter((movie) => movie.Title.toLowerCase().includes(query.toLowerCase())),
    [favoriteMovies, query]
  );

  const filteredPlanToWatch = useMemo(
    () => planToWatchMovies.filter((movie) => movie.Title.toLowerCase().includes(query.toLowerCase())),
    [planToWatchMovies, query]
  );

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 border border-gray-600/30 rounded-2xl bg-black/40 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-6 transition-all duration-200">
        {/* Favorite Movies Section */}
        <section className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 h-[30rem] overflow-y-auto custom-scrollbar">
          <h1 className="text-2xl text-white font-bold text-center mb-6">Favorite Movies</h1>
          <ul className="space-y-3">
            {filteredFavorites.length === 0 && (
              <li className="text-center text-gray-400">No favorite movies match your search.</li>
            )}
            {filteredFavorites.map((movie) => (
              <MovieListItem
                key={movie.imdbID}
                movie={movie}
                isFavorite={favoriteMovies.some((m) => m.imdbID === movie.imdbID)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </ul>
        </section>

        {/* Plan to Watch Section */}
        <section className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 h-[30rem] overflow-y-auto">
          <h2 className="text-2xl text-white font-bold text-center mb-6">Plan to Watch</h2>
          {filteredPlanToWatch.length === 0 ? (
            <p className="text-center text-gray-400">No movies in your plan to watch list.</p>
          ) : (
            <ul className="space-y-4">
              {filteredPlanToWatch.map((movie) => (
                <MovieListItem
                  key={movie.imdbID}
                  movie={movie}
                  showRemoveButton
                  onRemovePlanToWatch={removeFromPlanToWatch}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyList;
