import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { useSession } from '@/hooks/useSession';
import { cores, fontes } from '@/constants/colors';

export default function Landing() {
  const router = useRouter();
  const { autenticado, nome } = useSession();

  return (
    <CosmicBackground particles={80}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.topo}>
          <Pressable onPress={() => router.push('/conta')} hitSlop={10}>
            <Text style={styles.topoTxt}>
              {autenticado ? `Olá, ${nome ?? 'eu'}` : 'Entrar'}
            </Text>
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={100}>
            <Text style={styles.logo}>VION</Text>
            <Text style={styles.tagline}>VIBRACIONAL</Text>
          </FadeIn>

          <FadeIn delay={500}>
            <View style={styles.heroBox}>
              <Text style={styles.titulo}>Em que frequência{'\n'}vibras?</Text>
              <Text style={styles.subtitulo}>
                24 situações reais. Sem respostas certas.{'\n'}O teu padrão revela o teu nível
                de consciência.
              </Text>
            </View>
          </FadeIn>

          <FadeIn delay={900}>
            <View style={styles.stats}>
              <Stat valor="17" label="Níveis" />
              <Divider />
              <Stat valor="24" label="Situações" />
              <Divider />
              <Stat valor="∞" label="Padrões" />
            </View>
          </FadeIn>

          <FadeIn delay={1200}>
            <View style={styles.actions}>
              <GradientButton
                label="Iniciar Mapeamento"
                onPress={() => router.push('/teste')}
              />
              <View style={{ height: 12 }} />
              <GradientButton
                label="Ver a Escala Completa"
                variant="secondary"
                onPress={() => router.push('/escala')}
              />
              <View style={{ height: 12 }} />
              <GradientButton
                label="Explorar Arquétipos"
                variant="secondary"
                onPress={() => router.push('/arquetipos')}
              />
              <View style={{ height: 12 }} />
              <GradientButton
                label="Já fiz o teste · Ir para Evolução"
                variant="secondary"
                onPress={() => router.push('/evolucao')}
              />
            </View>
          </FadeIn>

          <FadeIn delay={1500}>
            <Text style={styles.footer}>
              Baseado na Escala de David R. Hawkins · Para reflexão pessoal
            </Text>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topo: { paddingHorizontal: 24, paddingTop: 4, alignItems: 'flex-end' },
  topoTxt: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 12,
    letterSpacing: 2,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 48,
    justifyContent: 'space-between',
  },
  logo: {
    fontFamily: fontes.tituloBold,
    color: cores.gold,
    fontSize: 56,
    letterSpacing: 8,
    textAlign: 'center',
    textShadowColor: '#C4963A66',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  tagline: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 8,
    textAlign: 'center',
    marginTop: 4,
  },
  heroBox: { marginTop: 56, alignItems: 'center' },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 44,
    lineHeight: 50,
    textAlign: 'center',
  },
  subtitulo: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  statItem: { alignItems: 'center', minWidth: 80 },
  statValor: {
    fontFamily: fontes.mono,
    color: cores.text,
    fontSize: 24,
    letterSpacing: 1,
  },
  statLabel: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: cores.border,
    marginHorizontal: 12,
  },
  actions: { marginTop: 48 },
  footer: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
    letterSpacing: 0.5,
  },
});
