// src/components/Posts/Post.js
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { Link } from 'react-router-dom';
import './Post.css';

function Post({ post, refreshPosts, readonly }) {
  const [user] = useAtom(userAtom);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.like || 0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user?.user?.id && post?.users_likes) {
      setHasLiked(post.users_likes.includes(user.user.id));
    }
  }, [post?.users_likes, user?.user?.id]);

  const postAuthor = post?.author;
  const postAuthorId = postAuthor?.id;

  if (!post || !postAuthor) {
    return null; // Afficher un message ou un indicateur de chargement si les données ne sont pas disponibles
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
        refreshPosts(); // Mettre à jour les posts après un like/dislike
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
          refreshPosts(); // Mettre à jour les posts après suppression
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
    <div className="post-container">
      <div className="post-header">
        <Link to={`/user/${postAuthor.username || 'unknown'}`} className="post-author">
          {postAuthor.username || 'Utilisateur inconnu'}
        </Link>
      </div>
      <p className="post-text">{post.text}</p>

      {/* Affichage des actions uniquement si readonly est faux et si l'utilisateur est connecté */}
      <div className="post-actions">
        {!readonly && user?.jwt && (
          <>
            <button onClick={handleLikeToggle} className="like-button">
              {hasLiked ? "Je n'aime plus" : "J'aime"}
            </button>
            <span className="like-count">{likeCount} likes</span>

            {String(user?.user?.id) === String(postAuthorId) && (
              <button onClick={handleDelete} className="delete-button">Supprimer</button>
            )}
          </>
        )}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Post;
