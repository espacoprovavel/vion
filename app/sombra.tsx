import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import GradientButton from '@/components/GradientButton';
import { getArquetipoPorHz } from '@/constants/arquetipos';
import { SOMBRAS } from '@/constants/sombra';
import { NIVEIS } from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';
import { Storage, type TestEntry } from '@/lib/storage';

export default function Sombra() {
  const router = useRouter();
  const [hist, setHist] = useState<TestEntry[]>([]);
  useEffect(() => {
    Storage.getHistorico().then(setHist);
  }, []);

  const ultimo = hist[hist.length - 1];
  if (!ultimo) {
    return (
      <CosmicBackground>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={styles.semDadosTit}>Sem mapeamento</Text>
          <Text style={styles.semDadosTxt}>
            Para revelar a tua sombra preciso de saber o teu arquétipo.
          </Text>
          <View style={{ height: 20 }} />
          <GradientButton label="Fazer o teste" onPress={() => router.push('/teste')} />
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  const arq = getArquetipoPorHz(ultimo.nivelHz);
  const sombra = SOMBRAS[arq.id];
  const cor = NIVEIS.find((n) => n.hz === arq.hz)?.cor ?? cores.accent;
  const corV = cor === '#a0ffc0' ? cores.green : cor;

  return (
    <CosmicBackground particles={50} glow={corV}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Sombra</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>TRABALHO DE SOMBRA</Text>
            <Text style={styles.titulo}>
              A sombra de "{arq.nome}"
            </Text>
            <Text style={styles.subt}>
              A tua maior elevação está exactamente no que rejeitas em ti.
            </Text>
          </FadeIn>

          <FadeIn delay={250}>
            <View style={styles.bigCard}>
              <Text style={styles.bigEmoji}>🜃</Text>
              <Text style={styles.bigLabel}>O QUE REJEITAS</Text>
              <Text style={styles.bigTexto}>{sombra.oQueRejeitas}</Text>
            </View>
          </FadeIn>

          <FadeIn delay={400}>
            <View style={[styles.bigCard, { borderColor: corV + '44' }]}>
              <Text style={styles.bigLabel}>O QUE PEDE INTEGRAÇÃO</Text>
              <Text style={[styles.bigTexto, { color: cores.text }]}>{sombra.oQuePedeIntegracao}</Text>
            </View>
          </FadeIn>

          <FadeIn delay={550}>
            <View style={styles.perguntaBox}>
              <Text style={styles.perguntaLabel}>PERGUNTA PARA HABITAR</Text>
              <Text style={styles.pergunta}>"{sombra.perguntaCentral}"</Text>
              <Text style={styles.dica}>
                Não a respondas com a mente. Carrega-a por 24 horas. A resposta verdadeira virá
                de baixo da mente.
              </Text>
            </View>
          </FadeIn>

          <FadeIn delay={700}>
            <View style={styles.exercicioBox}>
              <Text style={styles.exLabel}>EXERCÍCIO DE INTEGRAÇÃO</Text>
              <Text style={styles.exTexto}>{sombra.exercicio}</Text>
            </View>
          </FadeIn>

          <FadeIn delay={850}>
            <View style={styles.aviso}>
              <Text style={styles.avisoTxt}>
                O trabalho de sombra é gradual. Volta a este ecrã sempre que sentires
                resistência — a resistência é o mapa.
              </Text>
            </View>
          </FadeIn>

          <FadeIn delay={1000}>
            <View style={{ marginTop: 28 }}>
              <GradientButton
                label="Aplicar com Libertação"
                onPress={() => router.push('/libertacao')}
              />
              <View style={{ height: 12 }} />
              <GradientButton
                label="Ver o meu arquétipo"
                variant="secondary"
                onPress={() => router.push({ pathname: '/perfil', params: { id: arq.id } })}
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
  content: { paddingHorizontal: 24, paddingBottom: 60 },
  label: {
    fontFamily: fontes.mono,
    color: cores.gold,
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 8,
  },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 34,
    marginTop: 6,
    lineHeight: 40,
  },
  subt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
  },
  bigCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
  },
  bigEmoji: { fontSize: 28, marginBottom: 8 },
  bigLabel: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 10,
    letterSpacing: 2.5,
  },
  bigTexto: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    lineHeight: 30,
    marginTop: 8,
  },
  perguntaBox: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.gold + '44',
  },
  perguntaLabel: {
    fontFamily: fontes.mono,
    color: cores.gold,
    fontSize: 10,
    letterSpacing: 2,
  },
  pergunta: {
    fontFamily: fontes.titulo,
    color: cores.goldLight,
    fontSize: 24,
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 32,
  },
  dica: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 12,
  },
  exercicioBox: {
    marginTop: 16,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.accent + '55',
  },
  exLabel: {
    fontFamily: fontes.mono,
    color: cores.accent,
    fontSize: 10,
    letterSpacing: 2,
  },
  exTexto: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
  },
  aviso: {
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    backgroundColor: cores.bg,
    borderWidth: 1,
    borderColor: cores.faint,
  },
  avisoTxt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  semDadosTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 28,
    textAlign: 'center',
  },
  semDadosTxt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
