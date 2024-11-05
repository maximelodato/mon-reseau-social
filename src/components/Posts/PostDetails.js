// src/components/Posts/PostDetails.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function PostDetails() {
  const { post_id } = useParams(); // Récupère l'ID du post depuis l'URL
  const [user] = useAtom(userAtom);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPostDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Construire les en-têtes de la requête conditionnellement
      const headers = {
        'Content-Type': 'application/json',
        ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }), // Ajouter Authorization seulement si l'utilisateur est connecté
      };

      const response = await fetch(`http://localhost:1337/api/posts/${post_id}`, {
        headers: headers,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: Impossible de récupérer le post`);
      }

      const result = await response.json();

      if (result?.data) {
        setPost({
          id: result.data.id,
          ...result.data.attributes,
        });
      } else {
        setError("Post non trouvé ou erreur lors de la récupération");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du post:', error);
      setError('Impossible de récupérer les détails du post. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, [post_id, user?.jwt]); // Ajout de post_id et user?.jwt dans les dépendances

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]); // Ajout de fetchPostDetails comme dépendance

  return (
    <div>
      {loading ? (
        <p>Chargement du post...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : post ? (
        <>
          <h2>Détails du Post</h2>
          <p>Texte : {post.text}</p>
          <p>Likes : {post.like}</p>
          <p>Modifié : {post.modified ? "Oui" : "Non"}</p>
          <p>Créé le : {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Non disponible"}</p>
          <p>Mis à jour le : {post.updatedAt ? new Date(post.updatedAt).toLocaleString() : "Non disponible"}</p>
        </>
      ) : (
        <p>Post non trouvé.</p>
      )}
    </div>
  );
}

export default PostDetails;
