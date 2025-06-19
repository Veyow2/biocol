import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SearchScreen from '../screens/SearchScreen';
import OperatorDetailScreen from '../screens/OperatorDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack pour la navigation vers les détails depuis la recherche
function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchHome" component={SearchScreen} options={{ title: 'Recherche' }} />
      <Stack.Screen name="Details" component={OperatorDetailScreen} options={{ title: 'Détails' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Recherche" component={SearchStack} />
        <Tab.Screen name="Favoris" component={FavoritesScreen} />
        <Tab.Screen name="Paramètres" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
