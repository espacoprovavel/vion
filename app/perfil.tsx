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
import FadeIn from '@/components/FadeIn';
import AvatarOrb from '@/components/AvatarOrb';
import GradientButton from '@/components/GradientButton';
import { ARQUETIPOS, type Arquetipo } from '@/constants/arquetipos';
import { NIVEIS, getNivelMaisProximo } from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';
import { Storage, type TestEntry } from '@/lib/storage';

export default function Perfil() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const arq = ARQUETIPOS.find((a) => a.id === id) ?? ARQUETIPOS[8];
  const cor = getCor(arq.hz);
  const nivel = getNivelMaisProximo(arq.hz);

  const [ultimo, setUltimo] = useState<TestEntry | null>(null);
  const [ocultos, setOcultos] = useState<string[]>([]);

  useEffect(() => {
    Storage.getHistorico().then((h) => setUltimo(h[h.length - 1] ?? null));
  }, []);

  const compatibilidade = ultimo ? calcularCompat(ultimo.hz, arq.hz) : null;

  const partilhar = () => {
    Share.share({
      message: `Acabei de encontrar o arquétipo "${arq.nome}" em VION — vibra a ${arq.hz}Hz. ${arq.bio}`,
    }).catch(() => {});
  };

  return (
    <CosmicBackground particles={60} glow={cor}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Arquétipo</Text>
          <Pressable onPress={partilhar} hitSlop={12}>
            <Text style={styles.share}>↗</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <View style={styles.heroWrap}>
              <AvatarOrb
                emoji={arq.emoji}
                nome={arq.nome}
                cor={cor}
                size={140}
                active
                hideLabel
              />
            </View>
          </FadeIn>

          <FadeIn delay={250}>
            <Text style={styles.nome}>{arq.nome}</Text>
            <Text style={styles.titulo}>{arq.titulo}</Text>
          </FadeIn>

          <FadeIn delay={400}>
            <View style={[styles.freqBox, { borderColor: cor + '88' }]}>
              <Text style={styles.freqLabel}>FREQUÊNCIA</Text>
              <Text style={[styles.freqValor, { color: cor, textShadowColor: cor }]}>
                {arq.hz}
              </Text>
              <Text style={styles.freqUnit}>
                Hz · {nivel.nome} <Text style={{ fontStyle: 'italic' }}>({nivel.en})</Text>
              </Text>
            </View>
          </FadeIn>

          {compatibilidade !== null && (
            <FadeIn delay={550}>
              <View style={styles.compatBox}>
                <View style={styles.compatRow}>
                  <Text style={styles.compatLabel}>COMPATIBILIDADE CONTIGO</Text>
                  <Text
                    style={[
                      styles.compatValor,
                      {
                        color:
                          compatibilidade >= 70
                            ? cores.green
                            : compatibilidade >= 40
                              ? cores.gold
                              : cores.muted,
                      },
                    ]}
                  >
                    {compatibilidade}%
                  </Text>
                </View>
                <View style={styles.compatBarBg}>
                  <View
                    style={[
                      styles.compatBarFill,
                      {
                        width: `${compatibilidade}%`,
                        backgroundColor:
                          compatibilidade >= 70
                            ? cores.green
                            : compatibilidade >= 40
                              ? cores.gold
                              : cores.accent,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.compatNota}>
                  {compatibilidade >= 70
                    ? 'Ressonância forte — vibram quase na mesma faixa.'
                    : compatibilidade >= 40
                      ? 'Afinidade moderada — há ponte possível.'
                      : 'Vibrações distantes — é território de aprendizagem mútua.'}
                </Text>
              </View>
            </FadeIn>
          )}

          <Seccao label="Bio" delay={700}>
            <Text style={styles.paragrafo}>{arq.bio}</Text>
          </Seccao>

          <Seccao label="Como se manifesta" delay={800}>
            <Text style={styles.paragrafo}>{arq.comoSeManifesta}</Text>
          </Seccao>

          {ultimo && (
            <Seccao label="Porque és afim" delay={900}>
              <Text style={styles.paragrafoItalic}>"{arq.porqueEsAfim}"</Text>
            </Seccao>
          )}

          <FadeIn delay={1000}>
            <View style={styles.actions}>
              <GradientButton
                label="Ver Relatório"
                onPress={() => router.push({ pathname: '/guia', params: { hz: String(arq.hz) } })}
              />
              <View style={{ height: 12 }} />
              <Pressable
                onPress={() => setOcultos((o) => [...o, arq.id])}
                style={({ pressed }) => [
                  styles.ocultar,
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text style={styles.ocultarTexto}>Ocultar</Text>
              </Pressable>
            </View>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Seccao({
  label,
  delay,
  children,
}: {
  label: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <FadeIn delay={delay}>
      <View style={styles.seccao}>
        <Text style={styles.seccaoLabel}>{label.toUpperCase()}</Text>
        <View style={styles.seccaoBody}>{children}</View>
      </View>
    </FadeIn>
  );
}

function calcularCompat(meuHz: number, outroHz: number): number {
  const dif = Math.abs(meuHz - outroHz);
  const pct = Math.max(0, Math.round(100 - (dif / 700) * 100 * 1.4));
  return Math.min(99, pct);
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
  share: { color: cores.muted, fontSize: 20 },
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  content: { paddingHorizontal: 24, paddingBottom: 64 },
  heroWrap: { alignItems: 'center', marginTop: 16 },
  nome: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 44,
    textAlign: 'center',
    marginTop: 20,
  },
  titulo: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  freqBox: {
    marginTop: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 18,
    backgroundColor: cores.card,
  },
  freqLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 3,
  },
  freqValor: {
    fontFamily: fontes.monoMedium,
    fontSize: 56,
    letterSpacing: -1,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
    marginTop: 4,
  },
  freqUnit: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
  },
  compatBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
  },
  compatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compatLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
  },
  compatValor: {
    fontFamily: fontes.monoMedium,
    fontSize: 24,
  },
  compatBarBg: {
    height: 4,
    backgroundColor: cores.faint,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 10,
  },
  compatBarFill: { height: 4 },
  compatNota: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  seccao: { marginTop: 22 },
  seccaoLabel: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 10,
    letterSpacing: 2.5,
    marginBottom: 8,
  },
  seccaoBody: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    padding: 16,
  },
  paragrafo: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.92,
    fontSize: 14,
    lineHeight: 22,
  },
  paragrafoItalic: {
    fontFamily: fontes.titulo,
    color: cores.accentSoft,
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 25,
  },
  actions: { marginTop: 28 },
  ocultar: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ocultarTexto: {
    fontFamily: fontes.corpoMedium,
    color: cores.muted,
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
