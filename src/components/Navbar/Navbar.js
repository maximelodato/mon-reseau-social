// src/components/Navbar/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function Navbar() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Supprime les informations utilisateur
    navigate('/');
  };

  return (
    <nav>
      <Link to="/">Accueil</Link>
      {user ? (
        <>
          <Link to="/profile">Mon Profil</Link>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <>
          <Link to="/login">Se connecter</Link>
          <Link to="/register">S'inscrire</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
