// src/components/Posts/PostList.js
import React, { useEffect, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import Post from './Post';
import { Box, TextField, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import { motion } from 'framer-motion';

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
    <Box
      sx={{
        maxWidth: 1400,
        margin: 'auto',
        padding: 3,
        backgroundColor: '#0d0d0d',
        borderRadius: 3,
        boxShadow: '0 0 30px #00e6e6',
        border: '2px solid #00e6e6',
        color: '#ffffff',
      }}
    >
      {/* Champ de recherche */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Rechercher un post..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            marginBottom: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ff8c00',
              },
              '&:hover fieldset': {
                borderColor: '#ffa500',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff8c00',
              },
            },
            input: {
              color: '#ff8c00',
            },
            label: {
              color: '#ff8c00',
            },
          }}
        />
      </motion.div>

      {/* Message de chargement */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 3 }}>
          <CircularProgress sx={{ color: '#00e6e6' }} />
        </Box>
      )}

      {/* Message d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="error" sx={{ marginBottom: 3, backgroundColor: '#1c1c1c', color: '#ff1744' }}>
            {error}
          </Alert>
        </motion.div>
      )}

      {/* Liste des posts */}
      {!loading && !error && posts.length > 0 ? (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px #00e6e6' }}
                style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: '#121212' }}
              >
                <Post
                  post={post}
                  readonly={readonly}
                  refreshPosts={() => fetchPosts(searchTerm)}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', marginTop: 3, color: '#00e6e6' }}>
              Aucun post trouvé.
            </Typography>
          </motion.div>
        )
      )}
    </Box>
  );
}

export default PostList;
