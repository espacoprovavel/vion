import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { cores, fontes } from '@/constants/colors';

export type Tab = 'inicio' | 'teste' | 'evolucao' | 'explorar' | 'perfil';

const TABS: { id: Tab; icon: string; label: string; href: any }[] = [
  { id: 'inicio',   icon: '◐', label: 'Início',    href: '/' },
  { id: 'teste',    icon: '✦', label: 'Teste',     href: '/teste' },
  { id: 'evolucao', icon: '○', label: 'Evolução',  href: '/evolucao' },
  { id: 'explorar', icon: '✺', label: 'Explorar',  href: '/explorar' },
  { id: 'perfil',   icon: '☉', label: 'Perfil',    href: '/perfil' },
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
            hitSlop={6}
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: cores.border,
    backgroundColor: '#FFFFFFE6',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  icon: {
    color: cores.muted,
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 1.2,
  },
});
