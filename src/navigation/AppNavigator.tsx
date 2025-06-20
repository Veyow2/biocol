import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OperatorDetailScreen from '../screens/OperatorDetailScreen';

// ✅ ➜ Déclare tes types ici
export type RootStackParamList = {
  Search: undefined;
  Favorites: undefined;
  Settings: undefined;
  OperatorDetail: { operator: any };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Recherche' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoris' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Paramètres' }} />
        <Stack.Screen
          name="OperatorDetail"
          component={OperatorDetailScreen}
          options={{ title: 'Détails du producteur' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
