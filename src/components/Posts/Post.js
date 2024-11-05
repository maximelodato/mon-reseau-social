import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import Avatar from '@mui/material/Avatar';

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
    if (readonly || !user?.jwt) return;

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
    if (readonly || !user?.jwt) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      try {
        const response = await fetch(`http://localhost:1337/api/posts/${post.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        });

        if (response.ok) {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      style={{ marginBottom: '30px' }}
    >
      <Card
        elevation={5}
        sx={{
          maxWidth: 600,
          margin: 'auto',
          borderRadius: '20px',
          backgroundColor: '#1a1a1a',
          color: '#fff',
          boxShadow: '0 0 20px #ff8c00, 0 0 40px #ff8c00',
          transition: 'transform 0.5s, box-shadow 0.5s',
          ':hover': {
            boxShadow: '0 0 40px #ff8c00, 0 0 80px #ff8c00',
          },
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: '#ff8c00', color: '#121212' }}>
              {postAuthor.username[0].toUpperCase()}
            </Avatar>
          }
          title={
            <Link to={`/user/${postAuthor.username || 'unknown'}`} style={{ textDecoration: 'none', color: '#ff8c00' }}>
              {postAuthor.username || 'Utilisateur inconnu'}
            </Link>
          }
          subheader={<Typography sx={{ color: '#ffcc00' }}>{new Date(post.createdAt).toLocaleString()}</Typography>}
        />
        <CardContent>
          <Typography variant="body1" sx={{ color: '#e0e0e0', textShadow: '0 0 10px #ff8c00' }}>
            {post.text}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          {!readonly && user?.jwt && (
            <>
              <IconButton
                onClick={handleLikeToggle}
                sx={{
                  color: hasLiked ? '#ffcc00' : '#fff',
                  transition: 'color 0.4s ease-in-out',
                  ':hover': { color: '#ff8c00' },
                }}
              >
                <FavoriteIcon />
              </IconButton>
              <Typography variant="body2" color="#ffcc00" sx={{ fontWeight: 'bold' }}>
                {likeCount} {likeCount > 1 ? 'likes' : 'like'}
              </Typography>
              {String(user?.user?.id) === String(postAuthorId) && (
                <IconButton onClick={handleDelete} sx={{ color: '#ff1744', ':hover': { color: '#ff5555' } }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </>
          )}
        </CardActions>
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ marginLeft: 2, marginBottom: 2, textShadow: '0px 0px 5px #ff1744' }}>
            {errorMessage}
          </Typography>
        )}
      </Card>
    </motion.div>
  );
}

export default Post;
