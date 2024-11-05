// src/components/Home.js
import React, { useState, useEffect, useCallback } from 'react';
import CreatePost from './Posts/CreatePost';
import PostList from './Posts/PostList';
import { useAtom } from 'jotai';
import { userAtom } from '../atoms';

function Home() {
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Utiliser useCallback pour mémoriser la fonction fetchPosts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:1337/api/posts?populate=*', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Ajouter l'en-tête Authorization uniquement si l'utilisateur est connecté
          ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }),
        },
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts');
      }
      const data = await response.json();

      // Formater les posts
      const formattedPosts = data?.data?.map((item) => ({
        id: item.id,
        text: item.attributes.text,
        like: item.attributes.like,
        createdAt: item.attributes.createdAt,
        updatedAt: item.attributes.updatedAt,
        author: item.attributes.author?.data?.attributes?.username || 'Utilisateur inconnu',
      })) || [];

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      setError('Impossible de récupérer les posts. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Inclure fetchPosts dans le tableau des dépendances de useEffect
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      <h2>Accueil</h2>
      {user?.jwt && <CreatePost refreshPosts={fetchPosts} />}
      
      {loading && <p>Chargement des posts...</p>}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!loading && !error && (
        <PostList posts={posts} refreshPosts={fetchPosts} readonly={!user?.jwt} />
      )}
    </div>
  );
}

export default Home;
