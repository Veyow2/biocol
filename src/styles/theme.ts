// src/styles/theme.ts

import { TextStyle } from 'react-native';

export const COLORS = {
  primary: '#2E7D32', // vert foncé
  secondary: '#A5D6A7', // vert clair
  background: '#F4F4F4',
  card: '#FFFFFF',
  text: '#212121',
  muted: '#757575',
  error: '#D32F2F',
  white: '#FFFFFF',
};

export const SIZES = {
  padding: 16,
  margin: 16,
  radius: 8,
  title: 22,
  subtitle: 18,
  body: 16,
  small: 14,
};

// 🛠️ Corrigé : fontWeight est strictement typé avec TextStyle['fontWeight']
export const FONTS = {
  title: {
    fontSize: SIZES.title,
    fontWeight: '700' as TextStyle['fontWeight'],
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: SIZES.subtitle,
    fontWeight: '600' as TextStyle['fontWeight'],
    color: COLORS.text,
  },
  body: {
    fontSize: SIZES.body,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: COLORS.text,
  },
  small: {
    fontSize: SIZES.small,
    fontWeight: '400' as TextStyle['fontWeight'],
    color: COLORS.muted,
  },
};
