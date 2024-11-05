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
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:1337/api/users?filters[username][$eq]=${username}`, {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const result = await response.json();
      const targetUser = result.data?.[0];

      if (targetUser) {
        setProfile(targetUser);

        const postsResponse = await fetch(
          `http://localhost:1337/api/posts?filters[user][id][$eq]=${targetUser.id}&populate=user&sort=createdAt:desc`,
          {
            headers: {
              Authorization: `Bearer ${user.jwt}`,
            },
          }
        );

        if (!postsResponse.ok) {
          throw new Error('Erreur lors de la récupération des posts');
        }

        const postsResult = await postsResponse.json();
        const formattedPosts = postsResult.data.map((item) => ({
          id: item.id,
          ...item.attributes,
          user: item.attributes.user.data.attributes,
        }));
        setPosts(formattedPosts);
      } else {
        setError('Utilisateur non trouvé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  }, [username, user.jwt]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : profile ? (
        <>
          <h2>Profil de {profile.username}</h2>
          <p>Description: {profile.description}</p>
          <h3>Posts de {profile.username}</h3>
          {posts.map((post) => (
            <Post key={post.id} post={post} refreshPosts={() => {}} />
          ))}
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default UserProfile;
