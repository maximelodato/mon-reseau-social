// src/components/Landing.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);

  // Fonction pour rediriger l'utilisateur vers les pages de Connexion ou Inscription
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <h1 className="title">Bienvenue sur Mon Réseau Social</h1>
      <p className="description">
        Ce site web est un entraînement à React, la gestion d'état global avec Jotai, et l'utilisation des tokens JWT.
        Ici, l'authentification et le routage sont utilisés pour créer un petit réseau social.
      </p>

      {user?.jwt ? (
        <p className="welcome-message">Bonjour {user.user.username}, ravi de vous revoir !</p>
      ) : (
        <div className="button-container">
          <button onClick={() => handleNavigation('/login')} className="button">
            Connexion
          </button>
          <button onClick={() => handleNavigation('/register')} className="button">
            Inscription
          </button>
        </div>
      )}
    </div>
  );
}

export default Landing;
