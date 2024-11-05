// src/components/Navbar/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function Navbar() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  // Fonction de déconnexion
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Supprime les informations utilisateur du stockage local
    navigate('/'); // Redirige vers la page d'accueil après la déconnexion
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>Mon Réseau Social</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Accueil</Link>
        {user ? (
          <>
            <span style={styles.welcomeMessage}>Bienvenue, {user.user.username}</span>
            <Link to="/profile" style={styles.link}>Mon Profil</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>Se déconnecter</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Se connecter</Link>
            <Link to="/register" style={styles.link}>S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  logo: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  logoLink: {
    textDecoration: 'none',
    color: '#fff',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    margin: '0 15px',
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1em',
  },
  welcomeMessage: {
    marginRight: '15px',
    fontSize: '1em',
    fontStyle: 'italic',
  },
  logoutButton: {
    padding: '5px 10px',
    fontSize: '1em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#dc3545',
    color: '#fff',
  },
};

export default Navbar;
