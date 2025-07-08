import { useMemo } from 'react';
import { FavoriteIcon } from '../components/Icons';
import type { MovieTypes, WatchedTypes } from '../types/movieTypes';
import type { ListProps } from '../types/ListProps';

const isWatchedTypes = (movie: MovieTypes | WatchedTypes): movie is WatchedTypes => {
  return (
    'runtime' in movie &&
    'imdbRating' in movie &&
    'userRating' in movie &&
    'Plot' in movie
  );
};

const MovieListItem = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onRemovePlanToWatch,
  showRemoveButton = false,
}: {
  movie: MovieTypes | WatchedTypes;
  isFavorite?: boolean;
  onToggleFavorite?: (movie: WatchedTypes) => void;
  onRemovePlanToWatch?: (movie: WatchedTypes) => void;
  showRemoveButton?: boolean;
}) => {
  return (
    <li className="flex gap-7 text-lg ">
      <img
        src={movie.Poster}
        alt={`${movie.Title} Poster`}
        className="w-20 h-auto rounded shadow"
      />

      <div className="flex flex-col justify-between w-full">
        <h3 className="text-white text-lg font-semibold text-left truncate">
          {movie.Title}
        </h3>

        <div className="flex gap-10 text-sm text-gray-400 mt-3">
          {isWatchedTypes(movie) && (
            <>
              <p><span className="mr-1">⏳</span> {movie.runtime} min</p>
              <p><span className="mr-1">⭐</span> {movie.imdbRating}</p>
            </>
          )}
          {!showRemoveButton && (
            <>
            <p><span className="mr-1">📅</span> {movie.Year}</p>
              {!isWatchedTypes(movie) && (
                <p><span className="mr-1">⭐</span> N/A</p>
              )}
            </>
          )}
        </div>

        
        {(onRemovePlanToWatch || onToggleFavorite) && (
          <div className="flex gap-4 mt-4">
            {showRemoveButton && onRemovePlanToWatch && isWatchedTypes(movie) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemovePlanToWatch(movie);
                }}
                className="bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-1 rounded shadow"
              >
                Remove
              </button>
            )}

            {!showRemoveButton && onToggleFavorite && isWatchedTypes(movie) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(movie);
                }}
                className="hover:scale-110 transition-transform"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FavoriteIcon filled={!!isFavorite} onClick={() => {}} />
              </button>
            )}
          </div>
        )}
      </div>
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
    () =>
      favoriteMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      ),
    [favoriteMovies, query]
  );

  const filteredPlanToWatch = useMemo(
    () =>
      planToWatchMovies.filter((movie) =>
        movie.Title.toLowerCase().includes(query.toLowerCase())
      ),
    [planToWatchMovies, query]
  );

  return (
    <div className="min-h-screen pt-30 py-20 flex items-center flex-col justify-center mt-20">
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 border border-gray-600/30 rounded-2xl bg-black/40 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-6 transition-all duration-200">

        {/* Favorite Movies */}
        <section className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 overflow-y-auto h-[30rem] ">
          <h1 className="text-2xl text-white font-bold text-center mb-8">Favorite Movies</h1>
          <ul className="space-y-3">
            {filteredFavorites.length === 0 ? (
              <li className="text-center text-gray-400">
                No favorite movies match your search.
              </li>
            ) : (
              filteredFavorites.map((movie) => (
                <MovieListItem
                  key={movie.imdbID}
                  movie={movie}
                  isFavorite={favoriteMovies.some((m) => m.imdbID === movie.imdbID)}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </ul>
        </section>

        {/* Plan to Watch */}
        <section className="flex-1 max-w-[42rem] bg-black/20 rounded-lg p-4 h-[30rem] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl text-white font-bold text-center mb-6">Plan to Watch</h2>
          <ul className="space-y-4">
            {filteredPlanToWatch.length === 0 ? (
              <p className="text-center text-gray-400">
                No movies in your plan to watch list.
              </p>
            ) : (
              filteredPlanToWatch.map((movie) => (
                <MovieListItem
                  key={movie.imdbID}
                  movie={movie}
                  showRemoveButton
                  onRemovePlanToWatch={removeFromPlanToWatch}
                />
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default MyList;
