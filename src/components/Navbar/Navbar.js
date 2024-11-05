import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../../atoms';

function Navbar() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ff6f00' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#000' }}>
            Mon Réseau Social
          </Link>
        </Typography>
        {user ? (
          <>
            <Typography variant="body1" sx={{ marginRight: 2, color: '#000' }}>
              Bienvenue, {user.user.username}
            </Typography>
            <Button 
              sx={{ color: '#000', fontWeight: 'bold' }} 
              onClick={() => navigate('/profile')}
            >
              Mon Profil
            </Button>
            <Button 
              sx={{ color: '#000', fontWeight: 'bold' }} 
              onClick={handleLogout}
            >
              Se Déconnecter
            </Button>
          </>
        ) : (
          <>
            <Button 
              sx={{ color: '#000', fontWeight: 'bold' }} 
              onClick={() => navigate('/login')}
            >
              Se Connecter
            </Button>
            <Button 
              sx={{ color: '#000', fontWeight: 'bold' }} 
              onClick={() => navigate('/register')}
            >
              S'Inscrire
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
