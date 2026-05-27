import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { cores, fontes } from '@/constants/colors';

type Tab = 'arquetipos' | 'alinhados' | 'eu';

const TABS: { id: Tab; icon: string; label: string; href: any }[] = [
  { id: 'arquetipos', icon: '✦', label: 'Arquétipos', href: '/arquetipos' },
  { id: 'alinhados', icon: '○', label: 'Alinhados', href: '/alinhados' },
  { id: 'eu', icon: '◐', label: 'Evolução', href: '/evolucao' },
];

export default function BottomNav({ active }: { active: Tab }) {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      {TABS.map((t) => {
        const on = active === t.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => router.push(t.href)}
            style={styles.tab}
          >
            <Text style={[styles.icon, on && { color: cores.accentSoft }]}>
              {t.icon}
            </Text>
            <Text style={[styles.label, on && { color: cores.text }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: cores.border,
    backgroundColor: '#FFFFFFE6',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  icon: {
    color: cores.muted,
    fontSize: 22,
    marginBottom: 2,
  },
  label: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 1.5,
  },
});
