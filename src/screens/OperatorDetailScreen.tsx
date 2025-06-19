import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OperatorDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Détails de l'opérateur</Text>
    </View>
  );
};

export default OperatorDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
