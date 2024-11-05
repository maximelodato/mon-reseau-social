// src/components/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms';

function Landing() {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  // Fonction pour rediriger l'utilisateur vers les pages de Connexion ou Inscription
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue sur Mon Réseau Social</h1>
      <p style={styles.description}>
        Ce site web est un entraînement à React, la gestion d'état global avec Jotai, et l'utilisation des tokens JWT.
        Ici, l'authentification et le routage sont utilisés pour créer un petit réseau social.
      </p>

      {user?.jwt ? (
        <p style={styles.welcomeMessage}>Bonjour {user.user.username}, ravi de vous revoir !</p>
      ) : (
        <div style={styles.buttonContainer}>
          <button onClick={() => handleNavigation('/login')} style={styles.button}>
            Connexion
          </button>
          <button onClick={() => handleNavigation('/register')} style={styles.button}>
            Inscription
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    padding: '20px',
    backgroundColor: '#f0f2f5',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5em',
    color: '#333',
  },
  description: {
    fontSize: '1.2em',
    color: '#555',
    margin: '20px 0',
  },
  welcomeMessage: {
    fontSize: '1.5em',
    color: '#28a745',
    margin: '20px 0',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  button: {
    fontSize: '1em',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
  },
};

export default Landing;
