import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { getItems, deleteItem, clearAllItems } from '../services/sqlite/db';

type Item = {
  id: number;
  name: string;
  quantity: number;
  description: string;
};

const FavoritesScreen: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getItems();
      setItems(data);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      Alert.alert('Erreur', 'Impossible de charger les favoris.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleDelete = (id: number) => {
    Alert.alert('Suppression', 'Supprimer ce favori ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        onPress: async () => {
          try {
            await deleteItem(id);
            loadItems();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de supprimer l\'élément.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert('Vider tous les favoris ?', 'Cette action est irréversible.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Vider',
        onPress: async () => {
          try {
            await clearAllItems();
            loadItems();
          } catch (e) {
            Alert.alert('Erreur', 'Impossible de vider les favoris.');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.details}>Quantité : {item.quantity}</Text>
        <Text style={styles.details}>Description : {item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes favoris</Text>

      {items.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
          <Button title="Vider les favoris" onPress={handleClearAll} color="red" />
        </>
      ) : (
        <Text style={{ marginTop: 20 }}>Aucun favori pour le moment.</Text>
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#ff5252',
    padding: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
