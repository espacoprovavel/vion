import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ParticleField from './ParticleField';
import { cores } from '@/constants/colors';

type Props = {
  children?: React.ReactNode;
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
        colors={['#FBFAFE', '#F3F0FC', '#FBFAFE']}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[`${glow ?? cores.accent}1A`, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />
      <ParticleField count={particles} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: cores.bg },
});
