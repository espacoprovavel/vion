import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import BottomNav from '@/components/BottomNav';
import { cores, fontes } from '@/constants/colors';

type Cartao = {
  id: string;
  titulo: string;
  desc: string;
  glifo: string;
  cor: string;
  href: any;
};

const CARTOES: Cartao[] = [
  {
    id: 'jung',
    titulo: 'Arquétipos · Jung & Tarot',
    desc: 'Os 12 arquétipos + 4 fundamentais com correspondência nos Arcanos Maiores.',
    glifo: '✦',
    cor: '#7C5CFC',
    href: '/jung',
  },
  {
    id: 'sonhos',
    titulo: 'Diário de Sonhos',
    desc: 'Regista os teus sonhos e recebe uma leitura simbólica junguiana.',
    glifo: '☾',
    cor: '#6E4FDB',
    href: '/sonhos',
  },
  {
    id: 'escala',
    titulo: 'Escala de Hawkins',
    desc: 'Os 17 níveis de consciência — do que pesa ao que liberta.',
    glifo: '◐',
    cor: '#B0822E',
    href: '/escala',
  },
  {
    id: 'protocolo',
    titulo: 'Protocolo 21 Dias',
    desc: 'Caminho diário para elevar a frequência do teu nível atual.',
    glifo: '✺',
    cor: '#0FB67A',
    href: '/protocolo',
  },
  {
    id: 'libertacao',
    titulo: 'Libertação Emocional',
    desc: 'Exercício guiado para libertar uma emoção presa.',
    glifo: '✧',
    cor: '#0089A8',
    href: '/libertacao',
  },
  {
    id: 'praticas',
    titulo: 'Práticas',
    desc: 'Práticas curtas para cada nível de consciência.',
    glifo: '◉',
    cor: '#D2A23F',
    href: '/praticas',
  },
  {
    id: 'sombra',
    titulo: 'Trabalho de Sombra',
    desc: 'Olhar para o que recusamos ver em nós — e integrar.',
    glifo: '☽',
    cor: '#1B1830',
    href: '/sombra',
  },
  {
    id: 'energia',
    titulo: 'Energia & Chakras',
    desc: 'Mapa energético: os centros vitais e o que despertam.',
    glifo: '❋',
    cor: '#E0457F',
    href: '/energia',
  },
  {
    id: 'alinhados',
    titulo: 'Alinhados',
    desc: 'Arquétipos que vibram próximos do teu campo atual.',
    glifo: '○',
    cor: '#8A879E',
    href: '/alinhados',
  },
];

export default function Explorar() {
  const router = useRouter();
  return (
    <CosmicBackground particles={26}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Explorar</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FadeIn>
            <Text style={styles.titulo}>O que queres atravessar hoje?</Text>
            <Text style={styles.sub}>
              Cada porta é uma forma de te encontrares. Toca para entrar.
            </Text>
          </FadeIn>

          <View style={styles.grelha}>
            {CARTOES.map((c, i) => (
              <FadeIn key={c.id} delay={120 + i * 50}>
                <Pressable
                  style={({ pressed }) => [
                    styles.cartao,
                    { borderColor: c.cor + '40' },
                    pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
                  ]}
                  onPress={() => router.push(c.href)}
                >
                  <Text style={[styles.glifo, { color: c.cor }]}>{c.glifo}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cartaoTit}>{c.titulo}</Text>
                    <Text style={styles.cartaoDesc}>{c.desc}</Text>
                  </View>
                  <Text style={[styles.seta, { color: c.cor }]}>→</Text>
                </Pressable>
              </FadeIn>
            ))}
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        <BottomNav active="explorar" />
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 6 },
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  titulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 30, marginTop: 6 },
  sub: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14, lineHeight: 22, marginTop: 10, marginBottom: 18 },
  grelha: { gap: 12 },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
  },
  glifo: { fontSize: 28, width: 36, textAlign: 'center' },
  cartaoTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 17 },
  cartaoDesc: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, marginTop: 2, lineHeight: 18 },
  seta: { fontSize: 18, paddingHorizontal: 4 },
});
