import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { enableScreens } from 'react-native-screens';
enableScreens(); // <-- tout en haut de App.tsx

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </>
  );
}
