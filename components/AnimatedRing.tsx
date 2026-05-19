import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { cores, fontes } from '@/constants/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = { hz: number; color: string; size?: number };

export default function AnimatedRing({ hz, color, size = 260 }: Props) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * radius;

  const progress = useSharedValue(0);
  const hzAnim = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 2200,
      easing: Easing.out(Easing.cubic),
    });
    hzAnim.value = withTiming(hz, {
      duration: 2400,
      easing: Easing.out(Easing.cubic),
    });
  }, [hz, progress, hzAnim]);

  const animProps = useAnimatedProps(() => ({
    strokeDashoffset: circ * (1 - progress.value * (hz / 700)),
  }));

  const [hzDisplay, setHzDisplay] = React.useState(0);

  useEffect(() => {
    const start = Date.now();
    const dur = 2400;
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setHzDisplay(Math.round(eased * hz));
      if (t >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [hz]);

  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withTiming(1, { duration: 1500 });
  }, [pulse]);
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + pulse.value * 0.5,
    transform: [{ scale: 0.95 + pulse.value * 0.05 }],
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[StyleSheet.absoluteFill, pulseStyle]}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <Stop offset="100%" stopColor={color} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={cx} cy={cy} r={radius - 2} fill="url(#glow)" />
        </Svg>
      </Animated.View>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={cores.faint}
          strokeWidth={stroke}
          fill="transparent"
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`}
          animatedProps={animProps}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.hz}>{hzDisplay}</Text>
        <Text style={styles.hzUnit}>Hz</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', alignItems: 'center' },
  hz: {
    fontFamily: fontes.mono,
    color: cores.text,
    fontSize: 64,
    letterSpacing: -1,
  },
  hzUnit: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    letterSpacing: 3,
    marginTop: -6,
  },
});
