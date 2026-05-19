import React from 'react';
import { Stack } from 'expo-router';
import { cores } from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.bg },
        animation: 'fade',
      }}
    />
  );
}
