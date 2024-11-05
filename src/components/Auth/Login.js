// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';

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
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Connexion</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <input
          type="text"
          placeholder="Nom d'utilisateur ou E-mail"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  form: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '1.8em',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '1em',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default Login;
