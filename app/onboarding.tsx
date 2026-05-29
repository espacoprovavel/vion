import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { cores, fontes } from '@/constants/colors';
import { Storage } from '@/lib/storage';
import { useConteudo } from '@/lib/conteudo';
import { track, EVENTOS } from '@/lib/analytics';

export default function Onboarding() {
  const router = useRouter();
  const { t } = useConteudo();
  const [idx, setIdx] = useState(0);

  const SLIDES = [
    { emoji: '✦', label: 'BEM-VINDA', titulo: t('onboarding.s1.titulo'), desc: t('onboarding.s1.desc') },
    { emoji: '◐', label: 'O MÉTODO', titulo: t('onboarding.s2.titulo'), desc: t('onboarding.s2.desc') },
    { emoji: '◉', label: 'AVISO', titulo: t('onboarding.s3.titulo'), desc: t('onboarding.s3.desc') },
  ];
  const ultimo = idx === SLIDES.length - 1;

  const avancar = async () => {
    if (ultimo) {
      await Storage.setOnboardingFeito();
      track(EVENTOS.ONBOARDING_COMPLETO, { saltou: false });
      router.replace('/');
      return;
    }
    setIdx(idx + 1);
  };

  const saltar = async () => {
    await Storage.setOnboardingFeito();
    track(EVENTOS.ONBOARDING_COMPLETO, { saltou: true });
    router.replace('/');
  };

  const s = SLIDES[idx];

  return (
    <CosmicBackground particles={80} glow={cores.accent}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topo}>
          <Pressable onPress={saltar} hitSlop={12}>
            <Text style={styles.saltar}>saltar</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <FadeIn key={`emoji-${idx}`} delay={50}>
            <Text style={styles.emoji}>{s.emoji}</Text>
          </FadeIn>
          <FadeIn key={`label-${idx}`} delay={200}>
            <Text style={styles.label}>{s.label}</Text>
          </FadeIn>
          <FadeIn key={`titulo-${idx}`} delay={400}>
            <Text style={styles.titulo}>{s.titulo}</Text>
          </FadeIn>
          <FadeIn key={`desc-${idx}`} delay={650}>
            <Text style={styles.desc}>{s.desc}</Text>
          </FadeIn>
        </View>

        <View style={styles.rodape}>
          <View style={styles.pontos}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.ponto,
                  i === idx && { backgroundColor: cores.accentSoft, width: 22 },
                ]}
              />
            ))}
          </View>
          <GradientButton
            label={ultimo ? 'Começar' : 'Continuar'}
            variant={ultimo ? 'gold' : 'primary'}
            onPress={avancar}
          />
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  topo: { paddingHorizontal: 24, paddingTop: 12, alignItems: 'flex-end' },
  saltar: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  body: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    color: cores.gold,
    textAlign: 'center',
  },
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 4,
    textAlign: 'center',
    marginTop: 32,
  },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 42,
    lineHeight: 50,
    textAlign: 'center',
    marginTop: 16,
  },
  desc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 28,
    paddingHorizontal: 8,
  },
  rodape: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  pontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.faint,
  },
});
