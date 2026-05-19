import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores, fontes } from '@/constants/colors';

type Props = {
  emoji: string;
  nome: string;
  cor: string;
  hz?: number;
  size?: number;
  active?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  hideLabel?: boolean;
};

export default function AvatarOrb({
  emoji,
  nome,
  cor,
  hz,
  size = 72,
  active = false,
  onPress,
  style,
  hideLabel,
}: Props) {
  const ring = size + (active ? 12 : 0);
  const corVisivel = cor === '#a0ffc0' ? cores.green : cor;

  return (
    <Pressable onPress={onPress} style={[styles.wrap, style]}>
      <View
        style={[
          styles.ringWrap,
          {
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            borderColor: active ? corVisivel : 'transparent',
            shadowColor: active ? corVisivel : 'transparent',
          },
        ]}
      >
        <LinearGradient
          colors={[corVisivel + 'cc', corVisivel + '22', cores.card]}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: cores.border,
          }}
        >
          <Text style={{ fontSize: size * 0.4 }}>{emoji}</Text>
        </LinearGradient>
      </View>
      {!hideLabel && (
        <>
          <Text style={styles.nome} numberOfLines={1}>
            {nome}
          </Text>
          {hz !== undefined && <Text style={styles.hz}>{hz} Hz</Text>}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  ringWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  nome: {
    fontFamily: fontes.corpoMedium,
    color: cores.text,
    fontSize: 12,
    marginTop: 8,
    maxWidth: 80,
    textAlign: 'center',
  },
  hz: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    marginTop: 1,
    letterSpacing: 1,
  },
});
