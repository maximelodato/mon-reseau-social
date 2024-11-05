import React, { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import Post from './Post';
import './PostList.css';

function PostList({ refresh, readonly }) {
  const [user] = useAtom(userAtom);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = useCallback(async (search = '') => {
    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:1337/api/posts?populate=*&sort=createdAt:desc&filters[text][$contains]=${search}`;

      const headers = {
        'Content-Type': 'application/json',
        ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }),
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

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      setError('Impossible de récupérer les posts. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts(searchTerm);
  }, [searchTerm, fetchPosts, refresh]);

  return (
    <div className="post-list-container">
      {/* Champ de recherche */}
      <input
        type="text"
        className="search-input"
        placeholder="Rechercher un post..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Message de chargement */}
      {loading && <p className="loading-message">Chargement des posts...</p>}

      {/* Message d'erreur */}
      {error && <p className="error-message">{error}</p>}

      {/* Liste des posts */}
      {!loading && !error && posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.id} post={post} readonly={readonly} refreshPosts={() => fetchPosts(searchTerm)} />
        ))
      ) : (
        !loading && !error && <p className="no-post-message">Aucun post trouvé.</p>
      )}
    </div>
  );
}

export default PostList;
