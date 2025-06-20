import React, { useEffect, useState } from 'react';
import {
  View,Text,TextInput,StyleSheet,FlatList,ActivityIndicator,Dimensions,TouchableOpacity,Animated,Keyboard,PermissionsAndroid,Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { fetchOperators } from '../services/api';
import { OperatorType } from '../types/Operator';

const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Search'>>();
  const [search, setSearch] = useState('');
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [results, setResults] = useState<OperatorType[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const requestLocationPermissionAndGetPosition = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permission de localisation',
              message:
                'L\'application a besoin de votre position pour afficher les producteurs proches.',
              buttonNeutral: 'Plus tard',
              buttonNegative: 'Annuler',
              buttonPositive: 'OK',
            }
          );

          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Permission localisation refusée');
            return;
          }
        }
                  
        Geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            setCoords({ lat: latitude, lng: longitude });
             console.log('Coordonnées initiales:', { lat: latitude??42, lng: longitude??2 });
          },
          err => {
            console.warn('Erreur GPS', err);
          },
           { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        );
      } catch (error) {
        console.error('Erreur lors de la demande de permission GPS', error);
      }
    };

    requestLocationPermissionAndGetPosition();
  }, []);



  const fetchNearbyOperators = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const data = await fetchOperators({
        q: search,
        lat,
        lng,
        nb: 20,
        trierPar: 'coords',
      });
      setResults(data.items || []);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Erreur API Agence Bio :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    if (coords.lat && coords.lng) fetchNearbyOperators(coords.lat, coords.lng);
  };

  const renderItem = ({ item }: { item: OperatorType }) => {
    const addr = item.adressesOperateurs?.[0];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('OperatorDetail', { operator: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.denominationcourante}</Text>
          <Ionicons name="heart-outline" size={22} color="#2f5223" />
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.activites?.map((a: { nom: string }) => a.nom).join(', ')}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {addr?.lieu}, {addr?.codePostal} {addr?.ville}
        </Text>
      </TouchableOpacity>
    );
  };

  const leafletHTML = coords.lat && coords.lng ? `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style> html, body, #map { height: 100%; margin: 0; padding: 0; } </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const map = L.map('map').setView([${coords.lat}, ${coords.lng}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
          }).addTo(map);
          L.marker([${coords.lat}, ${coords.lng}]).addTo(map).bindPopup('Vous êtes ici').openPopup();
          ${results
            .map(item => {
              const addr = item.adressesOperateurs?.[0];
              const name = (item.denominationcourante || '').replace(/'/g, '');
              return addr?.lat && addr?.long
                ? `L.marker([${addr.lat}, ${addr.long}]).addTo(map).bindPopup('${name}');`
                : '';
            })
            .join('')}
        </script>
      </body>
    </html>
  ` : '<html><body><p style="text-align:center;margin-top:20px;">Chargement de la carte...</p></body></html>';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Trouver un producteur bio</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom, activité, ville..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />

      <WebView
        style={styles.map}
        source={{ html: leafletHTML }}
        originWhitelist={['*']}
        scrollEnabled={false}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2f5223" style={{ marginTop: 16 }} />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContainer}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ef',
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f5223',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#e3e8e0',
    color: '#333',
    fontSize: 16,
    marginBottom: 10,
    elevation: 2,
  },
  map: {
    width: Dimensions.get('window').width,
    height: 200,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listContainer: {
    paddingBottom: 50,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f5223',
    maxWidth: '80%',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  address: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
