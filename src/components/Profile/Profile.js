// src/components/Profile/Profile.js
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function Profile() {
  const [user, setUser] = useAtom(userAtom);
  const [username, setUsername] = useState(user.user.username);
  const [description, setDescription] = useState(user.user.description || '');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const data = {
      username,
      description,
    };
  
    try {
      const response = await fetch(`http://localhost:1337/api/users-permissions/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUser({
          ...user,
          user: {
            ...user.user,
            username: updatedUser.username,
            description: updatedUser.description,
          },
        });
        alert('Profil mis à jour avec succès');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de la mise à jour:', errorData);
        alert("Erreur lors de la mise à jour du profil : " + (errorData.error.message || 'non spécifiée'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert("Une erreur est survenue");
    }
  };

  return (
    <div>
      <h2>Mon Profil</h2>
      <p>Nom d'utilisateur: {user.user.username}</p>
      <p>Description: {user.user.description}</p>

      <h3>Modifier le profil</h3>
      <form onSubmit={handleUpdateProfile}>
        <label>
          Nom d'utilisateur:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
}

export default Profile;
