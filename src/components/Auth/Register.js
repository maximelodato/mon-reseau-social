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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
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
          alert("Cet email ou nom d'utilisateur est déjà utilisé. Veuillez en choisir un autre.");
        } else {
          alert(result.error.message || 'Erreur lors de l\'inscription');
        }
      } else if (result.jwt) {
        setUser({ jwt: result.jwt, user: result.user });
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Inscription</h2>
      <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}

export default Register;
