import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '../styles/theme';
import OperatorCard from '../components/OperatorCard';

// ✅ Corrigé
declare const navigator: any;

type Position = {
  coords: {
    latitude: number;
    longitude: number;
  };
};

type Operator = {
  id: string;
  nom: string;
  adresse: string;
};

const SearchScreen = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPositionAndFetch = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('Permission de localisation refusée.');
            setLoading(false);
            return;
          }
        }

        navigator.geolocation.getCurrentPosition(
          async (position: Position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://data.agencebio.org/api/gouv/operateurs/?lat=${latitude}&lon=${longitude}&nb=20`
              );
              const json = await response.json();
              setOperators(Array.isArray(json.operateurs) ? json.operateurs : []);
            } catch (e) {
              setError("Erreur lors de l'appel à l'API.");
            } finally {
              setLoading(false);
            }
          },
          (geoError: any) => {
            console.warn(geoError);
            setError('Erreur de géolocalisation.');
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
      } catch (e) {
        setError('Erreur système.');
        setLoading(false);
      }
    };

    getPositionAndFetch();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ ...FONTS.body, color: COLORS.error }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[FONTS.title, styles.title]}>Opérateurs bio près de vous</Text>
      <FlatList
        data={operators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OperatorCard nom={item.nom} adresse={item.adresse} />
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: SIZES.padding,
  },
});
