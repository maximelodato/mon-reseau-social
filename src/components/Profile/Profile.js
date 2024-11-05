import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

function Profile() {
  const [user, setUser] = useAtom(userAtom);
  const [username, setUsername] = useState(user?.user?.username || '');
  const [description, setDescription] = useState(user?.user?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = {
      username,
      description,
    };

    try {
      const response = await fetch(`http://localhost:1337/api/users-permissions/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.jwt}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser({
          ...user,
          user: {
            ...user.user,
            username: updatedUser.username,
            description: updatedUser.description,
          },
        });
        alert('Profil mis à jour avec succès');
      } else {
        const errorData = await response.json();
        setError(`Erreur lors de la mise à jour du profil : ${errorData.error.message || 'non spécifiée'}`);
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        maxWidth: 700,
        margin: 'auto',
        padding: 4,
        boxShadow: '0 0 20px #ff8c00',
        borderRadius: 3,
        backgroundColor: '#121212',
        border: '2px solid #ff8c00',
        color: '#ffffff',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 3, color: '#ffcc00', textAlign: 'center' }}>
        Mon Profil
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        Nom d'utilisateur : <strong>{user?.user?.username}</strong>
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        Description : {user?.user?.description || 'Aucune description fournie'}
      </Typography>

      <Typography variant="h5" sx={{ marginBottom: 2, color: '#ffcc00' }}>
        Modifier le profil
      </Typography>
      <Box
        component="form"
        onSubmit={handleUpdateProfile}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          backgroundColor: '#1a1a1a',
          padding: 3,
          borderRadius: 2,
          boxShadow: '0 0 15px #ff8c00',
        }}
      >
        <TextField
          label="Nom d'utilisateur"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
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
              color: '#ffcc00',
            },
            label: {
              color: '#ff8c00',
            },
          }}
        />
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
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
              color: '#ffcc00',
            },
            label: {
              color: '#ff8c00',
            },
          }}
        />
        <Box sx={{ position: 'relative', marginTop: 3 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#ff8c00',
              color: '#121212',
              fontWeight: 'bold',
              ':hover': {
                backgroundColor: '#ffcc00',
                boxShadow: '0 0 20px #ffcc00',
              },
            }}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
                color: '#ffcc00',
              }}
            />
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginTop: 3, backgroundColor: '#1c1c1c', color: '#ff1744' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default Profile;
