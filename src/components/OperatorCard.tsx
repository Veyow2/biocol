import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../styles/theme';

type Props = {
  nom: string;
  adresse: string;
};

const OperatorCard = ({ nom, adresse }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={FONTS.subtitle}>{nom}</Text>
      <Text style={FONTS.body}>{adresse}</Text>
    </View>
  );
};

export default OperatorCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding / 2,
    elevation: 2,
  },
});
