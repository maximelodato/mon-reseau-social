// src/components/Auth/Login.js
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [, setUser] = useAtom(userAtom);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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
        alert('Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Connexion</h2>
      <input type="text" placeholder="Nom d'utilisateur ou E-mail" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Se connecter</button>
    </form>
  );
}

export default Login;
