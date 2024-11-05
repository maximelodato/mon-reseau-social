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
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Landing />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/user/:username" element={user ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/post/:postId" element={user ? <PostDetail /> : <Navigate to="/login" />} /> {/* Nouvelle route */}
        <Route path="/post/edit/:post_id" element={user ? <EditPost /> : <Navigate to="/login" />} />
        <Route path="/users" element={user ? <UserList /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
