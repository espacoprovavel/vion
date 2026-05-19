import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

type Particle = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }).map(() => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 2.4 + 0.6,
    opacity: Math.random() * 0.6 + 0.2,
    duration: 2500 + Math.random() * 4000,
    delay: Math.random() * 3000,
  }));
}

function Dot({ p }: { p: Particle }) {
  const v = useSharedValue(0.2);
  useEffect(() => {
    v.value = withDelay(
      p.delay,
      withRepeat(
        withTiming(1, { duration: p.duration, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      ),
    );
  }, [p.delay, p.duration, v]);

  const style = useAnimatedStyle(() => ({
    opacity: v.value * p.opacity,
    transform: [{ scale: 0.7 + v.value * 0.6 }],
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: p.x,
          top: p.y,
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
        },
        style,
      ]}
    />
  );
}

export default function ParticleField({ count = 60 }: { count?: number }) {
  const particles = useMemo(() => makeParticles(count), [count]);
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p, i) => (
        <Dot key={i} p={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    backgroundColor: '#A78BFA',
    shadowColor: '#7C5CFC',
    shadowOpacity: 0.9,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});
