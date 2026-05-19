import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ParticleField from './ParticleField';
import { cores } from '@/constants/colors';

type Props = {
  children: React.ReactNode;
  glow?: string;
  particles?: number;
};

export default function CosmicBackground({
  children,
  glow,
  particles = 60,
}: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[cores.bg, '#080614', cores.bg]}
        style={StyleSheet.absoluteFill}
      />
      {glow ? (
        <LinearGradient
          pointerEvents="none"
          colors={[`${glow}55`, 'transparent']}
          style={[StyleSheet.absoluteFill, styles.glow]}
        />
      ) : null}
      <ParticleField count={particles} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: cores.bg },
  glow: { opacity: 0.6 },
});
