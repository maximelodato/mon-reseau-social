// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [, setUser] = useAtom(userAtom);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const data = { username, email, password };

    try {
      const response = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Response from server:", result);

      if (result.error) {
        if (result.error.message === "Email or Username are already taken") {
          setErrorMessage("Cet email ou nom d'utilisateur est déjà utilisé. Veuillez en choisir un autre.");
        } else {
          setErrorMessage(result.error.message || 'Erreur lors de l\'inscription');
        }
      } else if (result.jwt) {
        setUser({ jwt: result.jwt, user: result.user });
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2 style={styles.title}>Inscription</h2>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Inscription en cours...' : "S'inscrire"}
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

export default Register;
