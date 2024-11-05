import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import Post from '../Posts/Post';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

function UserProfile() {
  const { username } = useParams();
  const [user] = useAtom(userAtom);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [postsError, setPostsError] = useState('');

  const fetchUserPosts = useCallback(async (userId) => {
    setPostsLoading(true);
    setPostsError('');
    try {
      const response = await fetch(
        `http://localhost:1337/api/posts?filters[user][id][$eq]=${userId}&populate=author&sort=createdAt:desc`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts');
      }

      const result = await response.json();
      const formattedPosts = result.data.map((item) => ({
        id: item.id,
        ...item.attributes,
        author: item.attributes.author?.data?.attributes,
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Erreur lors de la récupération des posts:', error);
      setPostsError(error.message);
    } finally {
      setPostsLoading(false);
    }
  }, [user?.jwt]);

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    setProfileError('');
    try {
      const response = await fetch(`http://localhost:1337/api/users?filters[username][$eq]=${username}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const result = await response.json();
      const targetUser = result?.[0];

      if (targetUser) {
        setProfile(targetUser);
        fetchUserPosts(targetUser.id);
      } else {
        setProfileError('Utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setProfileError(error.message);
    } finally {
      setProfileLoading(false);
    }
  }, [username, user?.jwt, fetchUserPosts]);

  useEffect(() => {
    if (username && user?.jwt) {
      fetchProfile();
    }
  }, [fetchProfile, username, user?.jwt]);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        maxWidth: 900,
        margin: 'auto',
        padding: 3,
        backgroundColor: '#121212',
        borderRadius: 3,
        boxShadow: '0 0 30px #ff8c00',
        border: '2px solid #ff8c00',
        color: '#ffffff',
      }}
    >
      {profileLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
          <CircularProgress sx={{ color: '#ff8c00' }} />
        </Box>
      ) : profileError ? (
        <Alert severity="error" sx={{ backgroundColor: '#1c1c1c', color: '#ff1744' }}>
          {profileError}
        </Alert>
      ) : profile ? (
        <>
          <Card
            elevation={5}
            sx={{
              marginBottom: 3,
              padding: 2,
              backgroundColor: '#1a1a1a',
              boxShadow: '0 0 20px #ff8c00',
              borderRadius: 2,
              color: '#fff',
            }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: '#ff8c00', marginRight: 2 }}>
                {profile.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ color: '#ffcc00', fontWeight: 'bold' }}>
                  {profile.username}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ color: '#e0e0e0' }}>
                  {profile.description || 'Aucune description fournie'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="h5" sx={{ marginBottom: 2, color: '#ffcc00' }}>
            Posts de {profile.username}
          </Typography>
          {postsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
              <CircularProgress sx={{ color: '#ff8c00' }} />
            </Box>
          ) : postsError ? (
            <Alert severity="error" sx={{ marginTop: 2, backgroundColor: '#1c1c1c', color: '#ff1744' }}>
              {postsError}
            </Alert>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Post key={post.id} post={post} readonly={true} refreshPosts={() => {}} />
              </motion.div>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2, color: '#e0e0e0' }}>
              Aucun post trouvé.
            </Typography>
          )}
        </>
      ) : (
        <Alert severity="error" sx={{ backgroundColor: '#1c1c1c', color: '#ff1744' }}>
          Utilisateur non trouvé.
        </Alert>
      )}
    </Box>
  );
}

export default UserProfile;
