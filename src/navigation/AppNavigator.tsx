import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import OperatorDetailScreen from '../screens/OperatorDetailScreen';
import { OperatorType } from '../types/Operator';

export type TabParamList = {
  Search: undefined;
  Favorites: undefined;
};

export type RootStackParamList = {
  Tabs: undefined;
  OperatorDetail: { operator: OperatorType };
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName: string = route.name === 'Search' ? 'search' : 'heart';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2f5223',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Recherche' }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoris' }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="OperatorDetail"
        component={OperatorDetailScreen}
        options={{ title: 'Détail producteur' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
