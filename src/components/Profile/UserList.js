// src/components/Users/UserList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function UserList() {
  const [user] = useAtom(userAtom);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Vérifier si l'utilisateur est connecté avant de faire la requête
      if (!user?.jwt) {
        throw new Error("Vous devez être connecté pour voir la liste des utilisateurs");
      }

      const response = await fetch('http://localhost:1337/api/users', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }
      
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.jwt]);

  useEffect(() => {
    if (user?.jwt) {
      fetchUsers();
    }
  }, [fetchUsers, user?.jwt]);

  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      {loading ? (
        <p>Chargement des utilisateurs...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <h3>{user.username}</h3>
              <p>Email: {user.email}</p>
              <p>Description: {user.description || 'Aucune description'}</p>
              <p>Posts Likés : {user.posts_liked ? user.posts_liked.length : 0}</p>
              <p>Créé le : {new Date(user.createdAt).toLocaleString()}</p>
              <p>Mis à jour le : {new Date(user.updatedAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun utilisateur trouvé.</p>
      )}
    </div>
  );
}

export default UserList;
