import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  translate?: number;
  style?: any;
};

export default function FadeIn({
  children,
  delay = 0,
  duration = 600,
  translate = 16,
  style,
}: Props) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, duration, v]);
  const s = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ translateY: (1 - v.value) * translate }],
  }));
  return <Animated.View style={[s, style]}>{children}</Animated.View>;
}
