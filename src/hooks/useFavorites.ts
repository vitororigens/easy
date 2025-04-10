import { useState, useEffect } from 'react';
import { useUserAuth } from './useUserAuth';
import { IFavorite, addFavorite, listFavorites, removeFavorite, isFavorite } from '../services/firebase/favorites.firebase';
import { Timestamp } from '@react-native-firebase/firestore';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUserAuth();

  useEffect(() => {
    if (user?.uid) {
      loadFavorites();
    }
  }, [user?.uid]);

  const loadFavorites = async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      const userFavorites = await listFavorites(user.uid);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (favoriteUid: string, favoriteName: string) => {
    if (!user?.uid) return;
    try {
      const newFavorite: Omit<IFavorite, 'id'> = {
        uid: user.uid,
        favoriteUid,
        favoriteName,
        createdAt: Timestamp.now(),
      };
      await addFavorite(newFavorite);
      await loadFavorites();
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };

  const removeFromFavorites = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId);
      await loadFavorites();
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const checkIsFavorite = async (favoriteUid: string) => {
    if (!user?.uid) return false;
    try {
      return await isFavorite(user.uid, favoriteUid);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
    refreshFavorites: loadFavorites,
  };
}; 