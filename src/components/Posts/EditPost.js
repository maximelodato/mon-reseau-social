// src/components/Posts/EditPost.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function EditPost() {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Récupère les détails actuels du post
  const fetchPostDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:1337/api/posts/${post_id}?populate=author`, {
        headers: {
          'Content-Type': 'application/json',
          ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }), // Ajouter l'en-tête Authorization seulement si l'utilisateur est connecté
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du post');
      }

      const result = await response.json();
      if (result?.data) {
        const post = result.data;
        // Vérifier si l'utilisateur est l'auteur du post
        if (post.attributes.author?.data?.id !== user.user.id) {
          setError('Vous n\'êtes pas autorisé à modifier ce post');
        } else {
          setText(post.attributes.text); // Pré-remplit le champ avec le texte actuel du post
        }
      } else {
        setError('Post non trouvé');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du post:', error);
      setError('Impossible de récupérer les détails du post. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  }, [post_id, user]);

  useEffect(() => {
    if (user?.jwt) {
      fetchPostDetails();
    } else {
      setLoading(false);
      setError('Vous devez être connecté pour modifier un post.');
    }
  }, [fetchPostDetails, user?.jwt]);

  // Gère la mise à jour du post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    const data = {
      data: {
        text,
      },
    };

    try {
      const response = await fetch(`http://localhost:1337/api/posts/${post_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Post mis à jour avec succès');
        navigate(`/post/${post_id}`); // Redirige vers la page de détails du post après la mise à jour
      } else {
        throw new Error('Erreur lors de la mise à jour du post');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
      setError('Impossible de mettre à jour le post. Veuillez réessayer plus tard.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h2>Modifier le Post</h2>
      {loading ? (
        <p>Chargement des détails du post...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <form onSubmit={handleUpdatePost}>
          <label>
            Texte du post:
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={updating}>
            {updating ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      )}
    </div>
  );
}

export default EditPost;
