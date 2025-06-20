import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OperatorDetailScreen = ({ route }: any) => {
  const { operator } = route.params;
  const addr = operator.adressesOperateurs?.[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="leaf" size={32} color="#2f5223" />
        <Text style={styles.title}>{operator.denominationcourante}</Text>
        <Text style={styles.subtitle}>{operator.activites?.map((a: any) => a.nom).join(', ')}</Text>
        {addr && (
          <Text style={styles.address}>
            📍 {addr.lieu}, {addr.codePostal} {addr.ville}
          </Text>
        )}
      </View>

      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>🌾 Produits</Text>
        {operator.productions?.length > 0 ? operator.productions.map((prod: any) => (
          <Text key={prod.id} style={styles.itemText}>• {prod.nom}</Text>
        )) : <Text style={styles.emptyText}>Aucun produit référencé.</Text>}
      </View>

      <View style={styles.sectionBox}>
        <Text style={styles.sectionTitle}>📜 Certificats</Text>
        {operator.certificats?.length > 0 ? operator.certificats.map((cert: any, i: number) => (
          <View key={i} style={styles.certBlock}>
            <Text style={styles.itemText}>Organisme : {cert.organisme}</Text>
            <Text style={styles.itemText}>Engagé depuis : {cert.dateEngagement}</Text>
            {cert.url && (
              <TouchableOpacity onPress={() => Linking.openURL(cert.url)}>
                <Text style={styles.link}>Voir le certificat 🔗</Text>
              </TouchableOpacity>
            )}
          </View>
        )) : <Text style={styles.emptyText}>Aucun certificat affiché.</Text>}
      </View>
    </ScrollView>
  );
};

export default OperatorDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ef',
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2f5223',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5f5f5f',
    marginTop: 4,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f5223',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  certBlock: {
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    color: '#2e7d32',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
  },
});
