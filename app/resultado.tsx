import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import AnimatedRing from '@/components/AnimatedRing';
import BarraEscala from '@/components/BarraEscala';
import {
  getNivelMaisProximo,
  getNivelAcima,
  getIndiceNivel,
  NIVEIS,
} from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';
import { Storage } from '@/lib/storage';

export default function Resultado() {
  const { hz: hzParam } = useLocalSearchParams<{ hz: string }>();
  const router = useRouter();
  const hz = parseInt(hzParam ?? '200', 10);
  const nivel = getNivelMaisProximo(hz);
  const proximo = getNivelAcima(nivel.hz);
  const idx = getIndiceNivel(nivel.hz);
  const progressoProx = proximo
    ? Math.max(0, Math.min(1, (hz - nivel.hz) / (proximo.hz - nivel.hz)))
    : 1;
  const acimaLimiar = nivel.hz >= 200;

  const [nome, setNome] = useState('tu');
  useEffect(() => {
    Storage.getNome().then((n) => setNome(n ?? 'tu'));
  }, []);

  const partilhar = () => {
    Share.share({
      message: `A minha frequência vibracional: ${hz}Hz — ${nivel.nome}. Descobre a tua em VION.`,
    }).catch(() => {});
  };

  return (
    <CosmicBackground particles={70} glow={nivel.cor}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn delay={100}>
            <Text style={styles.preTitulo}>Frequência de {nome}</Text>
          </FadeIn>

          <FadeIn delay={300} translate={8}>
            <View style={styles.ringWrap}>
              <AnimatedRing hz={hz} color={nivel.cor === '#a0ffc0' ? cores.green : nivel.cor} />
            </View>
          </FadeIn>

          <FadeIn delay={1200}>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={styles.emoji}>{nivel.emoji}</Text>
              <Text
                style={[
                  styles.nivelNome,
                  {
                    color: nivel.cor === '#a0ffc0' ? cores.green : nivel.cor,
                    textShadowColor: nivel.cor,
                  },
                ]}
              >
                {nivel.nome}
              </Text>
              <Text style={styles.nivelEn}>
                {nivel.hz} Hz · <Text style={{ fontStyle: 'italic' }}>{nivel.en}</Text>
              </Text>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: acimaLimiar ? '#10D98A22' : '#EF444422',
                    borderColor: acimaLimiar ? cores.green : cores.red,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeTexto,
                    { color: acimaLimiar ? cores.green : cores.red },
                  ]}
                >
                  {acimaLimiar ? 'ACIMA DO LIMIAR 200 Hz' : 'ABAIXO DO LIMIAR 200 Hz'}
                </Text>
              </View>
            </View>
          </FadeIn>

          <FadeIn delay={1500}>
            <View style={styles.cardDesc}>
              <Text style={styles.desc}>{nivel.desc}</Text>
            </View>
          </FadeIn>

          <FadeIn delay={1700}>
            <View style={styles.cardLeitura}>
              <Text style={styles.leituraLabel}>LEITURA PESSOAL</Text>
              <Text style={styles.leitura}>{nivel.insight(nome)}</Text>
            </View>
          </FadeIn>

          <FadeIn delay={1900}>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>A TUA POSIÇÃO NA ESCALA</Text>
              <BarraEscala hzActivo={nivel.hz} />
              <Text style={styles.posicao}>
                Nível {idx + 1} de 17
              </Text>
            </View>
          </FadeIn>

          {proximo && (
            <FadeIn delay={2100}>
              <View style={styles.proxBox}>
                <Text style={styles.proxLabel}>PRÓXIMO NÍVEL</Text>
                <View style={styles.proxRow}>
                  <View>
                    <Text style={styles.proxNome}>
                      {proximo.emoji} {proximo.nome}
                    </Text>
                    <Text style={styles.proxHz}>
                      {proximo.hz} Hz · {proximo.en}
                    </Text>
                  </View>
                  <Text style={styles.proxDelta}>+{proximo.hz - nivel.hz}Hz</Text>
                </View>
                <View style={styles.proxBarBg}>
                  <View
                    style={[
                      styles.proxBarFill,
                      {
                        width: `${progressoProx * 100}%`,
                        backgroundColor:
                          proximo.cor === '#a0ffc0' ? cores.green : proximo.cor,
                      },
                    ]}
                  />
                </View>
              </View>
            </FadeIn>
          )}

          <FadeIn delay={2300}>
            <View style={styles.actions}>
              <GradientButton
                label="Guia de Elevação Completo — €4,99"
                variant="gold"
                onPress={() => router.push({ pathname: '/guia', params: { hz: String(nivel.hz) } })}
              />
              <View style={{ height: 12 }} />
              <GradientButton
                label="Partilhar o meu resultado"
                variant="secondary"
                onPress={partilhar}
              />
              <Pressable onPress={() => router.replace('/teste')} style={{ marginTop: 18 }}>
                <Text style={styles.refazer}>Refazer o teste</Text>
              </Pressable>
              <Pressable onPress={() => router.replace('/tracker')} style={{ marginTop: 8 }}>
                <Text style={styles.refazer}>Ver o meu tracker semanal</Text>
              </Pressable>
            </View>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 64,
  },
  preTitulo: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 12,
    letterSpacing: 3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  ringWrap: { alignItems: 'center', marginTop: 24 },
  emoji: { fontSize: 36 },
  nivelNome: {
    fontFamily: fontes.titulo,
    fontSize: 52,
    marginTop: 4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 16,
  },
  nivelEn: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 16,
  },
  badgeTexto: {
    fontFamily: fontes.mono,
    fontSize: 11,
    letterSpacing: 2,
  },
  cardDesc: {
    marginTop: 28,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 18,
  },
  desc: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.92,
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  cardLeitura: {
    marginTop: 14,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.accent + '55',
    borderRadius: 14,
    padding: 18,
  },
  leituraLabel: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  leitura: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 24,
  },
  section: { marginTop: 28 },
  sectionLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  posicao: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  proxBox: {
    marginTop: 24,
    backgroundColor: cores.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
    padding: 18,
  },
  proxLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
  },
  proxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proxNome: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 24,
  },
  proxHz: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    marginTop: 2,
  },
  proxDelta: {
    fontFamily: fontes.mono,
    color: cores.gold,
    fontSize: 16,
  },
  proxBarBg: {
    marginTop: 14,
    height: 4,
    backgroundColor: cores.faint,
    borderRadius: 2,
    overflow: 'hidden',
  },
  proxBarFill: { height: 4 },
  actions: { marginTop: 32 },
  refazer: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});
