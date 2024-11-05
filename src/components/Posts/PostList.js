// src/components/Posts/PostList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import Post from './Post';

function PostList({ refresh, readonly }) { // Ajout de 'refresh' et 'readonly' en props
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useState([]); // Ajout de l'état posts et son setter
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = useCallback(async (search = '') => {
    try {
      // Construire l'URL de la requête
      const url = `http://localhost:1337/api/posts?populate=*&sort=createdAt:desc&filters[text][$contains]=${search}`;

      // Construire les en-têtes conditionnellement en fonction de la connexion de l'utilisateur
      const headers = {
        'Content-Type': 'application/json',
        ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }), // Ajouter le jeton seulement si l'utilisateur est connecté
      };

      const response = await fetch(url, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts');
      }

      const result = await response.json();

      const formattedPosts =
        result?.data?.map((item) => ({
          id: item.id,
          ...item.attributes,
          author: item.attributes.author?.data
            ? {
                id: item.attributes.author.data.id,
                username: item.attributes.author.data.attributes.username || 'Utilisateur inconnu',
              }
            : { id: null, username: 'Utilisateur inconnu' },
          users_likes: item.attributes.users_likes?.data?.map((user) => user.id) || [],
        })) || [];

      setPosts(formattedPosts); // Utilisation de setPosts pour mettre à jour l'état
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts(searchTerm);
  }, [searchTerm, fetchPosts, refresh]);

  return (
    <div>
      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher un post..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Liste des posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id} post={post} readonly={readonly} refreshPosts={() => fetchPosts(searchTerm)} />
        ))
      ) : (
        <p>Aucun post trouvé.</p>
      )}
    </div>
  );
}

export default PostList;
