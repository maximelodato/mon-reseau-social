// src/components/Posts/Post.js
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { Link } from 'react-router-dom';

function Post({ post, refreshPosts, readonly }) {
  const [user] = useAtom(userAtom);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like || 0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user?.user?.id && post.users_likes) {
      setHasLiked(post.users_likes.includes(user.user.id));
    }
  }, [post.users_likes, user?.user?.id]);

  // Vérifiez les données du post dans la console
  console.log('Données du post:', post);

  const postAuthor = post.author;
  const postAuthorId = post.author?.id;

  if (!post || !postAuthor) {
    return null; // Ou afficher un indicateur de chargement
  }

  const handleLikeToggle = async () => {
    if (readonly || !user?.jwt) return; // Désactiver l'action si en mode lecture seule ou non connecté

    const updatedLikes = hasLiked
      ? (post.users_likes || []).filter((id) => id !== user.user.id)
      : [...(post.users_likes || []), user.user.id];

    const updatedLikeCount = hasLiked ? likeCount - 1 : likeCount + 1;

    const data = {
      like: updatedLikeCount,
      users_likes: updatedLikes,
    };

    try {
      const response = await fetch(`http://localhost:1337/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        setHasLiked(!hasLiked);
        setLikeCount(updatedLikeCount);
        refreshPosts();
      } else {
        const errorText = await response.text();
        setErrorMessage(`Erreur lors de la mise à jour du like: ${errorText}`);
      }
    } catch (error) {
      setErrorMessage('Erreur lors de la mise à jour du like');
      console.error('Erreur lors de la mise à jour du like:', error);
    }
  };

  const handleDelete = async () => {
    if (readonly || !user?.jwt) return; // Désactiver l'action si en mode lecture seule ou non connecté

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      try {
        const response = await fetch(`http://localhost:1337/api/posts/${post.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        });

        if (response.ok) {
          console.log('Post supprimé avec succès');
          refreshPosts();
        } else {
          const errorText = await response.text();
          setErrorMessage(`Erreur lors de la suppression du post: ${errorText}`);
        }
      } catch (error) {
        setErrorMessage('Erreur lors de la suppression du post');
        console.error('Erreur lors de la suppression du post:', error);
      }
    }
  };

  return (
    <div>
      <Link to={`/user/${postAuthor.username || 'unknown'}`}>
        {postAuthor.username || 'Utilisateur inconnu'}
      </Link>
      <p>{post.text}</p>

      {/* Affichage des actions uniquement si readonly est faux */}
      {!readonly && user?.jwt && (
        <>
          <button onClick={handleLikeToggle}>
            {hasLiked ? "Je n'aime plus" : "J'aime"}
          </button>
          <span>{likeCount} likes</span>

          {String(user?.user?.id) === String(postAuthorId) && (
            <button onClick={handleDelete}>Supprimer</button>
          )}
        </>
      )}

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Post;
