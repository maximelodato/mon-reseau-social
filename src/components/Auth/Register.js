import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Register.css';

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
          setErrorMessage(result.error.message || "Erreur lors de l'inscription");
        }
      } else if (result.jwt) {
        setUser({ jwt: result.jwt, user: result.user });
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage("Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard.");
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
        onSubmit={handleRegister}
        className="form"
        initial={{ opacity: 0.9, scale: 1 }}
        whileHover={{ scale: 1.02, boxShadow: '0 0 20px #ff8c00' }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="title">Inscription</h2>
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
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
        <motion.button
          type="submit"
          className="button"
          disabled={loading}
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px #ff8c00' }}
          transition={{ duration: 0.3 }}
        >
          {loading ? 'Inscription en cours...' : "S'inscrire"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default Register;
