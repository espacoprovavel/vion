import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { cores, fontes } from '@/constants/colors';

export default function Loading({ texto }: { texto?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={cores.accent} size="small" />
      {texto ? <Text style={styles.txt}>{texto}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  txt: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
