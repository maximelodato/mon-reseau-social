import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Login.css';

function Login() {
  const [, setUser] = useAtom(userAtom);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const data = { identifier, password };

    try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.jwt) {
        const userData = { jwt: result.jwt, user: result.user };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData)); // Stockage dans le localStorage
        navigate('/');
      } else {
        setErrorMessage(result.message || 'Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        className="form"
        onSubmit={handleLogin}
        initial={{ opacity: 0.9, scale: 1 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px #ff8c00' }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="title">Connexion</h2>
        {errorMessage && (
          <motion.p
            className="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {errorMessage}
          </motion.p>
        )}
        <input
          type="text"
          className="input"
          placeholder="Nom d'utilisateur ou E-mail"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          className="input"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <motion.button
          type="submit"
          className="button"
          disabled={loading}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px #ff8c00' }}
          transition={{ duration: 0.3 }}
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default Login;
