import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { motion } from 'framer-motion';

function CreatePost({ refreshPosts }) {
  const [user] = useAtom(userAtom);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');

    if (!user?.user?.id) {
      setError("Erreur : l'utilisateur n'est pas reconnu");
      return;
    }

    const data = {
      data: {
        text,
        author: user.user.id,
      },
    };

    try {
      const response = await fetch('http://localhost:1337/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        setText('');
        refreshPosts();
      } else {
        setError(`Erreur lors de la création du post: ${responseData.error?.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la création du post.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.05 }}
    >
      <Box
        component="form"
        onSubmit={handleCreatePost}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: 4,
          boxShadow: '0px 0px 20px #ff8c00, inset 0px 0px 20px #ff8c00',
          borderRadius: 3,
          backgroundColor: '#1a1a1a',
          maxWidth: 600,
          margin: '30px auto',
          border: '1px solid #ff8c00',
          transition: 'transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out',
          ':hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 0px 40px #ff8c00, inset 0px 0px 40px #ff8c00',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#ff8c00',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textShadow: '0 0 10px #ff8c00',
            marginBottom: 2,
          }}
        >
          Créez Votre Post
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Partagez vos pensées..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={4}
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: '#333',
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
              color: '#fff',
            },
            label: {
              color: '#ff8c00',
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: '#ff8c00',
            color: '#121212',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            padding: '10px 20px',
            transition: 'all 0.4s ease-in-out',
            ':hover': {
              backgroundColor: '#ffa500',
              boxShadow: '0 0 20px #ffa500',
              transform: 'scale(1.1)',
            },
          }}
        >
          Publier
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2, fontWeight: 'bold', textShadow: '0px 0px 5px #ff1744' }}>
            {error}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
}

export default CreatePost;
