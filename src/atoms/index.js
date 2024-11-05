import { atom } from 'jotai';

// Vérifie la validité du JSON dans le localStorage pour l'utilisateur
let user;
try {
  const storedUser = localStorage.getItem('user');
  user = storedUser ? JSON.parse(storedUser) : null;
} catch (error) {
  console.error("Erreur lors du parsing JSON :", error);
  user = null; // Définit user sur null si le parsing échoue
}

// Crée un atom pour stocker l'état de l'utilisateur
export const userAtom = atom(user);

// Écoute les changements de userAtom et les sauvegarde dans le localStorage
userAtom.onMount = (setAtom) => {
  const updateLocalStorage = (newUser) => {
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };
  setAtom(updateLocalStorage);
};
