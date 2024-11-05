// src/components/Profile/UserProfile.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import Post from '../Posts/Post';

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
          ...(user?.jwt && { Authorization: `Bearer ${user.jwt}` }), // Ajoutez le jeton si l'utilisateur est connecté
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const result = await response.json();
      const targetUser = result?.[0];

      if (targetUser) {
        setProfile(targetUser);
        fetchUserPosts(targetUser.id); // Récupère les posts après avoir trouvé l'utilisateur
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
    <div>
      {profileLoading ? (
        <p>Chargement du profil...</p>
      ) : profileError ? (
        <p style={{ color: 'red' }}>{profileError}</p>
      ) : profile ? (
        <>
          <h2>Profil de {profile.username}</h2>
          <p>Description : {profile.description || 'Aucune description fournie'}</p>
          <h3>Posts de {profile.username}</h3>
          {postsLoading ? (
            <p>Chargement des posts...</p>
          ) : postsError ? (
            <p style={{ color: 'red' }}>{postsError}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Post key={post.id} post={post} readonly={true} refreshPosts={() => {}} />
            ))
          ) : (
            <p>Aucun post trouvé.</p>
          )}
        </>
      ) : (
        <p>Utilisateur non trouvé.</p>
      )}
    </div>
  );
}

export default UserProfile;
