import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { CartaJung } from '@/constants/jung';
import { cores, fontes } from '@/constants/colors';

type Props = {
  carta: CartaJung;
  onPress?: () => void;
  largura?: number;
};

/** Carta de Tarot de design original (não copia nenhum baralho). */
export default function CartaTarot({ carta, onPress, largura = 150 }: Props) {
  const altura = largura * 1.6;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 }]}
    >
      <View style={[styles.carta, { width: largura, height: altura, borderColor: carta.cor + '55' }]}>
        <LinearGradient
          colors={['#FFFFFF', carta.cor + '0D']}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.molduraInterna, { borderColor: carta.cor + '33' }]} />

        <View style={styles.topo}>
          <Text style={[styles.numeral, { color: carta.cor }]}>{carta.numeral}</Text>
        </View>

        <View style={styles.centro}>
          <Text style={[styles.glifo, { color: carta.cor }]}>{carta.glifo}</Text>
        </View>

        <View style={styles.base}>
          <View style={[styles.linha, { backgroundColor: carta.cor + '40' }]} />
          <Text style={styles.arcano}>{carta.arcano}</Text>
          <Text style={styles.nome}>{carta.nome}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carta: {
    borderWidth: 1,
    borderRadius: 14,
    backgroundColor: cores.bg,
    overflow: 'hidden',
    padding: 10,
    shadowColor: '#1B1830',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  molduraInterna: {
    position: 'absolute',
    top: 6,
    left: 6,
    right: 6,
    bottom: 6,
    borderWidth: 1,
    borderRadius: 10,
  },
  topo: { alignItems: 'center' },
  numeral: {
    fontFamily: fontes.tituloBold,
    fontSize: 16,
    letterSpacing: 1,
  },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glifo: { fontSize: 46, lineHeight: 54 },
  base: { alignItems: 'center' },
  linha: { width: 28, height: 1, marginBottom: 8 },
  arcano: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 8.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  nome: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
  },
});
