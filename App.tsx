import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import SearchScreen from './src/screens/SearchScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <SearchScreen />
    </SafeAreaView>
  );
}
