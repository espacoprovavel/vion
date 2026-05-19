import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import GradientButton from '@/components/GradientButton';
import {
  CHAKRAS,
  getChakraPorHz,
  getEstadoChakras,
  type Chakra,
} from '@/constants/chakras';
import { cores, fontes } from '@/constants/colors';
import { Storage, type TestEntry } from '@/lib/storage';

export default function Energia() {
  const router = useRouter();
  const [hist, setHist] = useState<TestEntry[]>([]);
  useEffect(() => {
    Storage.getHistorico().then(setHist);
  }, []);

  const ultimo = hist[hist.length - 1];
  const hz = ultimo?.hz ?? 200;
  const chakraAct = getChakraPorHz(hz);
  const estados = getEstadoChakras(hz);

  const [selecionado, setSelecionado] = useState<Chakra>(chakraAct);
  useEffect(() => {
    setSelecionado(chakraAct);
  }, [chakraAct]);

  return (
    <CosmicBackground particles={50} glow={selecionado.cor}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Energia</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>SISTEMA DE CHAKRAS</Text>
            <Text style={styles.titulo}>O teu campo</Text>
            <Text style={styles.subt}>
              Vibração actual {hz} Hz · {estados.filter((e) => e.aberto).length}/7 chakras abertos
            </Text>
          </FadeIn>

          <FadeIn delay={250}>
            <View style={styles.coluna}>
              {[...estados].reverse().map(({ chakra, aberto, activo }, i) => (
                <Pressable
                  key={chakra.id}
                  onPress={() => setSelecionado(chakra)}
                  style={[
                    styles.chakraRow,
                    activo && {
                      borderColor: chakra.cor,
                      backgroundColor: chakra.cor + '11',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.chakraDot,
                      {
                        backgroundColor: aberto ? chakra.cor : cores.faint,
                        shadowColor: aberto ? chakra.cor : 'transparent',
                      },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.chakraNome,
                        !aberto && { color: cores.muted },
                      ]}
                    >
                      {chakra.emoji} {chakra.nome}
                    </Text>
                    <Text style={styles.chakraFunc}>{chakra.funcao}</Text>
                  </View>
                  <Text
                    style={[
                      styles.chakraStatus,
                      activo && { color: chakra.cor },
                      !aberto && { color: cores.muted },
                    ]}
                  >
                    {activo ? 'ACTIVO' : aberto ? 'ABERTO' : 'A DESPERTAR'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </FadeIn>

          <FadeIn delay={400}>
            <View style={[styles.detalhe, { borderColor: selecionado.cor + '88' }]}>
              <Text style={[styles.detalheLabel, { color: selecionado.cor }]}>
                {selecionado.emoji} CHAKRA {selecionado.nome.toUpperCase()}
              </Text>

              <Text style={styles.detalheH}>Função</Text>
              <Text style={styles.detalheP}>{selecionado.funcao}</Text>

              <Text style={styles.detalheH}>Bloqueio típico</Text>
              <Text style={styles.detalheP}>{selecionado.bloqueio}</Text>

              <Text style={styles.detalheH}>Prática</Text>
              <Text style={styles.detalheP}>{selecionado.pratica}</Text>

              <Text style={styles.detalheH}>Respiração</Text>
              <Text style={styles.detalheP}>{selecionado.respiracao}</Text>
            </View>
          </FadeIn>

          <FadeIn delay={550}>
            <View style={{ marginTop: 28 }}>
              <GradientButton
                label="Praticar agora"
                onPress={() => router.push('/praticas')}
              />
            </View>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
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
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
  },
  titulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 34, marginTop: 6 },
  subt: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, marginTop: 4 },
  coluna: { marginTop: 20 },
  chakraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  chakraDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 14,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  chakraNome: {
    fontFamily: fontes.corpoMedium,
    color: cores.text,
    fontSize: 14,
  },
  chakraFunc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 11,
    marginTop: 2,
  },
  chakraStatus: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  detalhe: {
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.card,
    borderWidth: 1,
  },
  detalheLabel: {
    fontFamily: fontes.mono,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 14,
  },
  detalheH: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 14,
    textTransform: 'uppercase',
  },
  detalheP: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },
});
