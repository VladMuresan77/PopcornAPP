import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import About from './routes/About';
import MyList from './routes/MyList';
import Contact from './routes/Contact';
import Login from './routes/Login';

import type { MovieTypes, WatchedTypes } from './types/movieTypes';
import { useAuth } from './context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function App() {
  const [favoriteMovies, setFavoriteMovies] = useState<MovieTypes[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<WatchedTypes[]>([]);
  const [planToWatchMovies, setPlanToWatchMovies] = useState<WatchedTypes[]>([]);
  const [query, setQuery] = useState<string>('');

  const { globalUser, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !globalUser) return;

    const loadUserData = async () => {
      try {
        const userDoc = doc(db, 'users', globalUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFavoriteMovies(data.favorites ?? []);
          setWatchedMovies(data.watched ?? []);
          setPlanToWatchMovies(data.planToWatch ?? []);
        } else {
          await setDoc(userDoc, {
            favorites: [],
            watched: [],
            planToWatch: [],
          });
          setFavoriteMovies([]);
          setWatchedMovies([]);
          setPlanToWatchMovies([]);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [globalUser, authLoading]);

  useEffect(() => {
    if (!globalUser || authLoading) return;

    const saveUserData = async () => {
      try {
        const userDoc = doc(db, 'users', globalUser.uid);
        await setDoc(
          userDoc,
          { favorites: favoriteMovies, watched: watchedMovies, planToWatch: planToWatchMovies },
          { merge: true }
        );
      } catch (error) {
        console.error('Error saving to Firestore:', error);
      }
    };

    saveUserData();
  }, [favoriteMovies, watchedMovies, planToWatchMovies, globalUser, authLoading]);

  const toggleMovieInList = <T extends { imdbID: string }>(
    movie: T,
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    setList((prev) =>
      prev.some((m) => m.imdbID === movie.imdbID)
        ? prev.filter((m) => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  };

  const toggleWatched = (movie: WatchedTypes) =>
    toggleMovieInList<WatchedTypes>(movie, setWatchedMovies);

  const toggleFavorite = (movie: MovieTypes) =>
    toggleMovieInList<MovieTypes>(movie, setFavoriteMovies);

  const addToPlanToWatch = (movie: WatchedTypes) =>
    toggleMovieInList<WatchedTypes>(movie, setPlanToWatchMovies);

  const removeFromPlanToWatch = (movie: WatchedTypes) =>
    setPlanToWatchMovies((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));

  const listProps = {
    query,
    favoriteMovies,
    watchedMovies,
    planToWatchMovies,
    toggleFavorite,
    toggleWatched,
    addToPlanToWatch,
    removeFromPlanToWatch,
  };

  return (
    <main className="relative flex flex-col min-h-screen bg-transparent">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full bg-no-repeat bg-cover object-cover -z-10"
      >
        <source src="/111loop.mp4" type="video/mp4" />
      </video>

      <Navbar query={query} onChange={setQuery} />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home {...listProps} />} />
          <Route path="/home" element={<Home {...listProps} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/myList" element={<MyList {...listProps} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;