import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Animated,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import { WebView as RNWebView, WebViewMessageEvent } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../navigation/RootStackParamList';
import { fetchOperators } from '../services/api';
import { OperatorType, OperatorParams } from '../types/Operator';
import logo from '../images/logo_biocol_empty.png';

const SearchScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Search'>>();
  const [search, setSearch] = useState('');
  const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [results, setResults] = useState<OperatorType[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const webviewRef = useRef<RNWebView>(null);
  const [sortBy, setSortBy] = useState<'coords' | 'nom' | 'activites'>('coords');
  const [radius, setRadius] = useState(20); // en km
  const { toggleFavorite, isFavorite } = useFavorites();



  useEffect(() => {
    locateAndFetch();
  }, []);

  const locateAndFetch = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'L\'application a besoin de votre position pour afficher les producteurs proches.',
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
          fetchNearbyOperators(latitude, longitude);
        },
        err => {
          console.warn('Erreur GPS', err);
          fetchNearbyOperators();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
      );
    } catch (error) {
      console.error('Erreur lors de la demande de permission GPS', error);
    }
  };

  const fetchNearbyOperators = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
     const data = await fetchOperators({
      q: search,
      lat,
      lng,
      nb: 20,
      trierPar: sortBy,
      rayon: radius, 
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

  const handleMapMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (typeof data === 'number') {
        const operator = results[data];
        if (operator) {
          navigation.navigate('OperatorDetail', { operator });
        }
      } else if ((data.type === 'mapClick' || data.type === 'mapMove') && data.lat && data.lng) {
  setCoords({ lat: data.lat, lng: data.lng });
  fetchNearbyOperators(data.lat, data.lng);
}

    } catch (e) {
      console.warn('Message WebView non traité :', e);
    }
  };

  const renderItem = ({ item, index }: { item: OperatorType; index: number }) => {
  const addr = item.adressesOperateurs?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('OperatorDetail', { operator: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.denominationcourante}</Text>
       <Ionicons
  name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
  size={22}
  color={isFavorite(item.id) ? 'red' : '#2f5223'}
  onPress={() => toggleFavorite(item)}
/>


      </View>
      <Text style={styles.subtitle} numberOfLines={1}>
        {item.activites?.map((a: { nom: string }) => a.nom).join(', ')}
      </Text>
      <Text style={styles.address} numberOfLines={1}>
        {addr?.lieu}, {addr?.codePostal} {addr?.ville}
      </Text>

      {/* Bouton Voir Carte */}
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => {
          if (addr?.lat && addr?.long) {
            webviewRef.current?.injectJavaScript(`
              map.setView([${addr.lat}, ${addr.long}], 13);
              const targetPopup = map._layers && Object.values(map._layers).find(layer =>
                layer instanceof L.Marker &&
                layer.getLatLng &&
                layer.getLatLng().lat === ${addr.lat} &&
                layer.getLatLng().lng === ${addr.long}
              );
              if (targetPopup && targetPopup.openPopup) targetPopup.openPopup();
            `);
          }
        }}
      >
        <Text style={styles.mapButtonText}>📍 Voir carte</Text>
      </TouchableOpacity>
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
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

          const userMarker = L.marker([${coords.lat}, ${coords.lng}], {
            icon: L.icon({
              iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          }).addTo(map).bindPopup('Vous êtes ici').openPopup();

          ${results.map((item, i) => {
            const addr = item.adressesOperateurs?.[0];
            const name = (item.denominationcourante || '').replace(/'/g, '');
            return addr?.lat && addr?.long
              ? `
                const marker${i} = L.marker([${addr.lat}, ${addr.long}]).addTo(map);
                const popup${i} = L.popup().setContent('<div style="cursor:pointer;font-weight:bold;" onclick="window.ReactNativeWebView.postMessage(\\'${i}\\')">${name}</div>');
                marker${i}.bindPopup(popup${i});
              `
              : '';
          }).join('')}

        map.on('click', (e) => {
  const { lat, lng } = e.latlng;
  map.setView([lat, lng], 12);
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapClick', lat, lng }));
});
          

          document.addEventListener('message', function(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'recenter') {
              map.setView([data.lat, data.lng], 12);
            }
          });
        </script>
      </body>
    </html>
  ` : '<html><body><p style="text-align:center;margin-top:20px;">Chargement de la carte...</p></body></html>';

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <TextInput
        style={styles.input}
        placeholder="Nom, activité, ville..."
        placeholderTextColor="#666"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch}
      />

      <View style={styles.mapWrapper}>
        <RNWebView
          ref={webviewRef}
          style={styles.map}
          source={{ html: leafletHTML }}
          originWhitelist={['*']}
          scrollEnabled={false}
          onMessage={handleMapMessage}
        />
      </View>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => {
          Geolocation.getCurrentPosition(
            pos => {
              const { latitude, longitude } = pos.coords;
              setCoords({ lat: latitude, lng: longitude });
              webviewRef.current?.injectJavaScript(`
                document.dispatchEvent(new MessageEvent('message', {
                  data: JSON.stringify({ type: 'recenter', lat: ${latitude}, lng: ${longitude} })
                }));
              `);
            },
            err => console.warn('Erreur recentrage', err),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
          );
        }}
      >
        <Text style={styles.locationButtonText}>Ma position</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#2f5223" style={{ marginTop: 16 }} />
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
             data={results}
              renderItem={({ item, index }) => renderItem({ item, index })}
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
  logo: {
    height: 60,
    width: 160,
    alignSelf: 'center',
    marginBottom: 8,
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
  mapWrapper: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationButton: {
    backgroundColor: '#2f5223',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    marginBottom: 10,
    elevation: 2,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
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
  mapButton: {
  alignSelf: 'flex-end',
  marginTop: 10,
  backgroundColor: '#2f5223',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
},

mapButtonText: {
  color: '#fff',
  fontSize: 13,
  fontWeight: '600',
},

});
