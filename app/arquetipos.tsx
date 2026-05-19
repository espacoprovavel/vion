import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import AvatarOrb from '@/components/AvatarOrb';
import BottomNav from '@/components/BottomNav';
import { ARQUETIPOS, getArquetipoPorHz } from '@/constants/arquetipos';
import { NIVEIS } from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';
import { Storage, type TestEntry } from '@/lib/storage';

export default function Arquetipos() {
  const router = useRouter();
  const [historico, setHistorico] = useState<TestEntry[]>([]);

  useEffect(() => {
    Storage.getHistorico().then(setHistorico);
  }, []);

  const ultimo = historico[historico.length - 1];
  const meuArq = ultimo ? getArquetipoPorHz(ultimo.nivelHz) : null;

  const ordenados = [...ARQUETIPOS].sort((a, b) => {
    if (!ultimo) return a.hz - b.hz;
    return Math.abs(a.hz - ultimo.nivelHz) - Math.abs(b.hz - ultimo.nivelHz);
  });

  return (
    <CosmicBackground particles={70} glow={meuArq ? getCor(meuArq.hz) : undefined}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Arquétipos</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>CONSTELAÇÃO DE ALMAS</Text>
            <Text style={styles.titulo}>
              {meuArq ? `Quem vibra contigo` : `Os 17 arquétipos`}
            </Text>
            <Text style={styles.subt}>
              {meuArq
                ? `Ordenados pela proximidade ao teu campo (${ultimo!.hz} Hz)`
                : 'Faz o teste para descobrires quem ressoa contigo'}
            </Text>
          </FadeIn>

          <FadeIn delay={250}>
            <View style={styles.grid}>
              {ordenados.map((a, i) => {
                const active = meuArq?.id === a.id;
                return (
                  <FadeIn key={a.id} delay={350 + i * 40}>
                    <View style={styles.gridItem}>
                      <AvatarOrb
                        emoji={a.emoji}
                        nome={a.nome}
                        cor={getCor(a.hz)}
                        hz={a.hz}
                        active={active}
                        onPress={() =>
                          router.push({ pathname: '/perfil', params: { id: a.id } })
                        }
                      />
                    </View>
                  </FadeIn>
                );
              })}
            </View>
          </FadeIn>
        </ScrollView>

        <BottomNav active="arquetipos" />
      </SafeAreaView>
    </CosmicBackground>
  );
}

function getCor(hz: number) {
  const n = NIVEIS.find((nv) => nv.hz === hz);
  return n?.cor ?? cores.accent;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 6,
  },
  back: { color: cores.muted, fontSize: 22 },
  headerTitulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
  },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 12,
  },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 34,
    textAlign: 'center',
    marginTop: 6,
  },
  subt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 20,
  },
  gridItem: { width: '33%', alignItems: 'center', paddingVertical: 10 },
});
