import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const OperatorDetailScreen = ({ route }: any) => {
  const { operator } = route.params;
  const addr = operator.adressesOperateurs?.[0];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{operator.denominationcourante}</Text>
      <Text style={styles.subtitle}>{operator.activites?.map((a: any) => a.nom).join(', ')}</Text>
      {addr && (
        <Text style={styles.text}>
          {addr.lieu}, {addr.codePostal} {addr.ville}
        </Text>
      )}
      <Text style={styles.section}>Produits :</Text>
      {operator.productions?.map((prod: any) => (
        <Text key={prod.id} style={styles.text}>• {prod.nom}</Text>
      ))}
      <Text style={styles.section}>Certificats :</Text>
      {operator.certificats?.map((cert: any, i: number) => (
        <View key={i}>
          <Text style={styles.text}>Organisme : {cert.organisme}</Text>
          <Text style={styles.text}>Engagé depuis : {cert.dateEngagement}</Text>
          {cert.url && <Text style={[styles.text, styles.link]}>{cert.url}</Text>}
        </View>
      ))}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f5223',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f5f5f',
  },
  text: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  section: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#2f5223',
  },
  link: {
    color: '#2e7d32',
    textDecorationLine: 'underline',
  },
});
