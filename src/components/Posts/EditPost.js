import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

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
          setError("Vous n'êtes pas autorisé à modifier ce post");
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
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        backgroundColor: '#1a1a1a',
        borderRadius: 3,
        boxShadow: '0 0 20px #ff8c00',
        color: '#ffffff',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: '#ffcc00' }}>
        Modifier le Post
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress sx={{ color: '#ff8c00' }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#1c1c1c', color: '#ff1744' }}>
          {error}
        </Alert>
      ) : (
        <form onSubmit={handleUpdatePost}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1c1c1c',
                '& fieldset': {
                  borderColor: '#ff8c00',
                },
                '&:hover fieldset': {
                  borderColor: '#ffcc00',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff8c00',
                },
              },
              input: {
                color: '#ffffff',
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={updating}
              sx={{
                backgroundColor: '#ff8c00',
                color: '#121212',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                ':hover': {
                  backgroundColor: '#ffcc00',
                  boxShadow: '0 0 20px #ffcc00',
                },
              }}
            >
              {updating ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/post/${post_id}`)}
              sx={{
                color: '#ffcc00',
                borderColor: '#ff8c00',
                ':hover': {
                  borderColor: '#ffcc00',
                  backgroundColor: '#1a1a1a',
                },
              }}
            >
              Annuler
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}

export default EditPost;
