import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'OperatorDetail'>;

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');

  const filteredFavorites = favorites.filter((op) =>
    op.denominationcourante.toLowerCase().includes(search.toLowerCase()) ||
    op.adressesOperateurs?.[0]?.ville?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💚 Mes producteurs favoris</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un producteur..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('OperatorDetail', { operator: item })}
          >
            <Text style={styles.name}>{item.denominationcourante}</Text>
            <Text style={styles.sub}>{item.adressesOperateurs?.[0]?.ville}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ef',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2f5223',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sub: {
    fontSize: 13,
    color: '#555',
  },
});

export default FavoritesScreen;
