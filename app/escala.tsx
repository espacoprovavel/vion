import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import BottomNav from '@/components/BottomNav';
import { NIVEIS } from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';

export default function Escala() {
  const router = useRouter();
  const niveisDesc = [...NIVEIS].reverse();

  return (
    <CosmicBackground particles={40}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>← voltar</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn delay={100}>
            <Text style={styles.titulo}>A Escala</Text>
            <Text style={styles.subtitulo}>
              17 níveis de consciência. De 20Hz à 700Hz.
            </Text>
          </FadeIn>

          <View style={styles.timeline}>
            {niveisDesc.map((n, i) => {
              const acima = n.hz >= 200;
              return (
                <FadeIn key={n.hz} delay={150 + i * 50}>
                  <View style={styles.row}>
                    <View style={styles.timelineCol}>
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: n.cor,
                            shadowColor: n.cor,
                          },
                        ]}
                      />
                      {i < niveisDesc.length - 1 && <View style={styles.line} />}
                    </View>
                    <View style={[styles.card, !acima && { opacity: 0.85 }]}>
                      <View style={styles.cardHeader}>
                        <Text style={[styles.hz, { color: n.cor === '#a0ffc0' ? cores.green : n.cor }]}>
                          {n.hz}
                          <Text style={styles.hzUnit}> Hz</Text>
                        </Text>
                        <Text style={styles.emoji}>{n.emoji}</Text>
                      </View>
                      <Text style={styles.nome}>{n.nome}</Text>
                      <Text style={styles.en}>{n.en}</Text>
                      <Text style={styles.desc}>{n.desc}</Text>
                    </View>
                  </View>
                </FadeIn>
              );
            })}
          </View>

          <FadeIn delay={300}>
            <View style={styles.limiarBox}>
              <Text style={styles.limiarTit}>O limiar dos 200 Hz</Text>
              <Text style={styles.limiarDesc}>
                Abaixo de 200 Hz, a consciência consome — vive em medo, culpa, vergonha. Acima de
                200 Hz, a consciência irradia — sustenta, cura, eleva.{'\n\n'}A coragem é a porta.
              </Text>
            </View>
          </FadeIn>
        </ScrollView>
        <BottomNav active="explorar" />
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8 },
  back: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  content: { paddingHorizontal: 24, paddingBottom: 64, paddingTop: 12 },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 40,
    textAlign: 'center',
  },
  subtitulo: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  timeline: { paddingLeft: 4 },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  timelineCol: {
    width: 24,
    alignItems: 'center',
    paddingTop: 22,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: cores.faint,
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: cores.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
    padding: 16,
    marginBottom: 12,
    marginLeft: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hz: {
    fontFamily: fontes.monoMedium,
    fontSize: 28,
    letterSpacing: 1,
  },
  hzUnit: { fontSize: 12, color: cores.muted },
  emoji: { fontSize: 22 },
  nome: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    marginTop: 2,
  },
  en: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontStyle: 'italic',
    fontSize: 13,
    marginTop: 2,
  },
  desc: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.85,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  limiarBox: {
    marginTop: 24,
    padding: 20,
    borderRadius: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
  },
  limiarTit: {
    fontFamily: fontes.titulo,
    color: cores.gold,
    fontSize: 20,
  },
  limiarDesc: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.85,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
});
