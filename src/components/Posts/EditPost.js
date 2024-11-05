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

  // Récupère les détails actuels du post
  const fetchPostDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/posts/${post_id}`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      });
      const result = await response.json();
      if (result?.data) {
        setText(result.data.attributes.text); // Pré-remplit le champ avec le texte actuel du post
      } else {
        console.error("Post non trouvé");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du post:', error);
    } finally {
      setLoading(false);
    }
  }, [post_id, user.jwt]); // Ajout de `user.jwt` et `post_id` dans les dépendances de `fetchPostDetails`

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]); // Inclure `fetchPostDetails` dans les dépendances de `useEffect`

  // Gère la mise à jour du post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
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
        console.error("Erreur lors de la mise à jour du post");
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du post:', error);
    }
  };

  return (
    <div>
      <h2>Modifier le Post</h2>
      {loading ? (
        <p>Chargement des détails du post...</p>
      ) : (
        <form onSubmit={handleUpdatePost}>
          <label>
            Texte du post:
            <textarea value={text} onChange={(e) => setText(e.target.value)} required />
          </label>
          <button type="submit">Enregistrer les modifications</button>
        </form>
      )}
    </div>
  );
}

export default EditPost;
