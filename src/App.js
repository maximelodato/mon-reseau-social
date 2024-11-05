// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from './atoms';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './components/Profile/Profile';
import UserProfile from './components/Profile/UserProfile';
import Landing from './components/Landing';
import PostDetail from './components/Posts/PostDetails';
import EditPost from './components/Posts/EditPost';
import UserList from './components/Profile/UserList';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from '@mui/material';

function App() {
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà dans le localStorage au démarrage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  useEffect(() => {
    // Met à jour le localStorage chaque fois que `user` change
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Box
      sx={{
        backgroundColor: '#a8a9ad', // Gris Nardo
        minHeight: '100vh', // S'assurer que le fond couvre toute la hauteur de la page
        paddingBottom: '50px', // Optionnel: pour éviter le chevauchement des contenus avec la fin de la page
      }}
    >
      <Router>
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {user ? <Home /> : <Landing />}
                </motion.div>
              }
            />
            <Route
              path="/login"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {!user ? <Login /> : <Navigate to="/" />}
                </motion.div>
              }
            />
            <Route
              path="/register"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {!user ? <Register /> : <Navigate to="/" />}
                </motion.div>
              }
            />
            <Route
              path="/profile"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {user ? <Profile /> : <Navigate to="/login" />}
                </motion.div>
              }
            />
            <Route
              path="/user/:username"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {user ? <UserProfile /> : <Navigate to="/login" />}
                </motion.div>
              }
            />
            <Route
              path="/post/:postId"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {user ? <PostDetail /> : <Navigate to="/login" />}
                </motion.div>
              }
            />
            <Route
              path="/post/edit/:post_id"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {user ? <EditPost /> : <Navigate to="/login" />}
                </motion.div>
              }
            />
            <Route
              path="/users"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {user ? <UserList /> : <Navigate to="/login" />}
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Router>
    </Box>
  );
}

export default App;
