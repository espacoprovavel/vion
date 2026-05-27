import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cores, fontes } from '@/constants/colors';

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'gold';
  style?: ViewStyle;
  disabled?: boolean;
};

export default function GradientButton({
  label,
  onPress,
  variant = 'primary',
  style,
  disabled,
}: Props) {
  const colors: [string, string] =
    variant === 'primary'
      ? [cores.accent, '#A88BFF']
      : variant === 'gold'
        ? [cores.gold, cores.goldLight]
        : [cores.surface, cores.card];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.wrap,
        style,
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        disabled && { opacity: 0.4 },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.btn,
          variant === 'secondary' && {
            borderWidth: 1,
            borderColor: cores.border,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            variant === 'secondary' && { color: cores.text },
            variant === 'gold' && { color: '#fff' },
          ]}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', maxWidth: 340, alignSelf: 'center' },
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontes.corpoMedium,
    color: '#fff',
    fontSize: 14.5,
    letterSpacing: 0.3,
  },
});
