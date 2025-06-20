import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OperatorType } from '../types/Operator';

interface FavoritesContextType {
  favorites: OperatorType[];
  toggleFavorite: (operator: OperatorType) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<OperatorType[]>([]);

  // 🔁 Charger les favoris au démarrage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erreur de chargement des favoris', error);
      }
    };

    loadFavorites();
  }, []);

  // 💾 Sauvegarder à chaque changement
  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites)).catch(console.error);
  }, [favorites]);

  const toggleFavorite = (operator: OperatorType) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === operator.id);
      return exists
        ? prev.filter((fav) => fav.id !== operator.id)
        : [...prev, operator];
    });
  };

  const isFavorite = (id: string) => favorites.some((fav) => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};
