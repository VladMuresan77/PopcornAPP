import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import About from './routes/About';
import MyList from './routes/MyList';
import Contact from './routes/Contact';
import Login from './routes/Login';

import type { MovieTypes } from './types/movieTypes';
import { useAuth } from './context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function App() {
  const [favoriteMovies, setFavoriteMovies] = useState<MovieTypes[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<MovieTypes[]>([]);
  const [planToWatchMovies, setPlanToWatchMovies] = useState<MovieTypes[]>([]);
  const [query, setQuery] = useState('');

  const { globalUser, authLoading } = useAuth();

  // 1. Încarcă datele din Firestore după autentificare
  useEffect(() => {
    if (authLoading || !globalUser) return;

    async function loadUserData() {
      try {
        const userDoc = doc(db, "users", globalUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFavoriteMovies(data.favoriteMovies || []);
          setWatchedMovies(data.watchedMovies || []);
          setPlanToWatchMovies(data.planToWatchMovies || []);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }

    loadUserData();
  }, [globalUser, authLoading]);

  // 2. Salvează datele în Firestore când se modifică listele
  useEffect(() => {
    if (!globalUser || authLoading) return;

    async function saveUserData() {
      try {
        const userDoc = doc(db, "users", globalUser.uid);
        await setDoc(userDoc, {
          favoriteMovies,
          watchedMovies,
          planToWatchMovies,
        }, { merge: true });
      } catch (error) {
        console.error("Eroare la salvarea în Firestore:", error);
      }
    }

    saveUserData();
  }, [favoriteMovies, watchedMovies, planToWatchMovies, globalUser, authLoading]);

  // 3. Funcții de toggle
  const toggleWatched = (movie: MovieTypes) => {
    setWatchedMovies(prev =>
      prev.some(m => m.imdbID === movie.imdbID)
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  };

  const toggleFavorite = (movie: MovieTypes) => {
    setFavoriteMovies(prev =>
      prev.some(m => m.imdbID === movie.imdbID)
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
  };

  const addToPlanToWatch = (movie: MovieTypes) => {
    setPlanToWatchMovies(prev =>
      prev.some(m => m.imdbID === movie.imdbID)
        ? prev.filter(m => m.imdbID !== movie.imdbID)
        : [...prev, movie]
    );
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
          <Route
            path="/"
            element={
              <Home
                query={query}
                favoriteMovies={favoriteMovies}
                watchedMovies={watchedMovies}
                planToWatchMovies={planToWatchMovies}
                toggleFavorite={toggleFavorite}
                toggleWatched={toggleWatched}
                addToPlanToWatch={addToPlanToWatch}
              />
            }
          />
          <Route path="/home" element={<Home
            query={query}
            favoriteMovies={favoriteMovies}
            watchedMovies={watchedMovies}
            planToWatchMovies={planToWatchMovies}
            toggleFavorite={toggleFavorite}
            toggleWatched={toggleWatched}
            addToPlanToWatch={addToPlanToWatch}
          />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/myList" element={
            <MyList
              query={query}
              favoriteMovies={favoriteMovies}
              watchedMovies={watchedMovies}
              planToWatchMovies={planToWatchMovies}
              toggleFavorite={toggleFavorite}
              toggleWatched={toggleWatched}
              addToPlanToWatch={addToPlanToWatch}
            />
          } />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </main>
  );
}

export default App;
