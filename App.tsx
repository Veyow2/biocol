import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/services/sqlite/db';
import { FavoritesProvider } from './src/context/FavoritesContext';

export default function App() {
  useEffect(() => {
    initDatabase().catch(err => console.error('DB init error', err));
  }, []);

  return (
    <FavoritesProvider>
      <AppNavigator />
      <StatusBar barStyle="dark-content" />
    </FavoritesProvider>
  );
}
