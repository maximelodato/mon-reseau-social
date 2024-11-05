import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';
import './CreatePost.css';

function CreatePost({ refreshPosts }) {
  const [user] = useAtom(userAtom);
  const [text, setText] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    console.log("Utilisateur actuel :", user);

    if (!user || !user.user || !user.user.id) {
      console.error("Erreur : l'utilisateur n'est pas reconnu");
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
        console.error("Erreur lors de la création du post :", responseData);
        alert(`Erreur: ${responseData?.error?.message || 'Impossible de créer le post'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert("Une erreur s'est produite lors de la création du post.");
    }
  };

  return (
    <form onSubmit={handleCreatePost} className="create-post-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Écrivez quelque chose..."
        required
        className="create-post-input"
      />
      <button type="submit" className="create-post-button">Publier</button>
    </form>
  );
}

export default CreatePost;
