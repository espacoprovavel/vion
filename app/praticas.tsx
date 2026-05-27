import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import GradientButton from '@/components/GradientButton';
import { Storage, type TestEntry } from '@/lib/storage';
import { getNivelMaisProximo } from '@/constants/niveis';
import { getGuia } from '@/constants/guias';
import { cores, fontes } from '@/constants/colors';

const CATEGORIAS = [
  { id: 'corpo', nome: 'Corpo', icon: '◯' },
  { id: 'mente', nome: 'Mente', icon: '△' },
  { id: 'emocao', nome: 'Emoção', icon: '✦' },
  { id: 'energia', nome: 'Energia', icon: '✧' },
];

export default function Praticas() {
  const router = useRouter();
  const [hist, setHist] = useState<TestEntry[]>([]);
  const [cat, setCat] = useState<string>('corpo');

  useEffect(() => {
    Storage.getHistorico().then(setHist);
  }, []);

  const ultimo = hist[hist.length - 1];
  const nivel = ultimo ? getNivelMaisProximo(ultimo.nivelHz) : null;
  const guia = nivel ? getGuia(nivel.hz) : null;

  return (
    <CosmicBackground particles={40}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>← voltar</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>PRÁTICAS</Text>
            <Text style={styles.titulo}>Biblioteca diária</Text>
            {nivel ? (
              <Text style={styles.subt}>
                Curadas para o teu nível: {nivel.emoji} {nivel.nome} · {nivel.hz} Hz
              </Text>
            ) : (
              <Text style={styles.subt}>
                Faz o teste para receberes práticas personalizadas
              </Text>
            )}
          </FadeIn>

          <FadeIn delay={150}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabs}
            >
              {CATEGORIAS.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setCat(c.id)}
                  style={[
                    styles.tab,
                    cat === c.id && {
                      borderColor: cores.accent,
                      backgroundColor: '#EDE9FE',
                    },
                  ]}
                >
                  <Text style={[styles.tabIcon, cat === c.id && { color: cores.accentSoft }]}>
                    {c.icon}
                  </Text>
                  <Text style={[styles.tabTexto, cat === c.id && { color: cores.text }]}>
                    {c.nome}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </FadeIn>

          {!guia ? (
            <FadeIn delay={250}>
              <View style={styles.empty}>
                <Text style={styles.emptyTit}>Sem nível detectado</Text>
                <Text style={styles.emptyTexto}>
                  Faz o teste para desbloquear práticas alinhadas com a tua frequência actual.
                </Text>
                <View style={{ height: 20 }} />
                <GradientButton label="Fazer o teste" onPress={() => router.push('/teste')} />
              </View>
            </FadeIn>
          ) : (
            <>
              <FadeIn delay={250}>
                <View style={styles.destaqueCard}>
                  <Text style={styles.destaqueLabel}>PRÁTICA DO DIA</Text>
                  <Text style={styles.destaqueTexto}>{guia.praticas[0]}</Text>
                  <Text style={styles.destaqueNota}>
                    Tempo sugerido: 5 a 10 minutos · Repetir 7 dias.
                  </Text>
                </View>
              </FadeIn>

              <FadeIn delay={400}>
                <Text style={styles.h2}>5 práticas para {nivel!.nome.toLowerCase()}</Text>
                {guia.praticas.map((p, i) => (
                  <View key={i} style={styles.praticaCard}>
                    <View style={styles.praticaNum}>
                      <Text style={styles.praticaNumTxt}>{i + 1}</Text>
                    </View>
                    <Text style={styles.praticaTexto}>{p}</Text>
                  </View>
                ))}
              </FadeIn>

              <FadeIn delay={500}>
                <Text style={styles.h2}>Afirmações vibracionais</Text>
                <View style={styles.afirmCard}>
                  {guia.afirmacoes.map((a, i) => (
                    <Text key={i} style={styles.afirm}>
                      ✦ {a}
                    </Text>
                  ))}
                </View>
              </FadeIn>

              <FadeIn delay={600}>
                <View style={{ marginTop: 28 }}>
                  <GradientButton
                    label="Ver guia completo"
                    onPress={() => router.push({ pathname: '/guia', params: { hz: String(nivel!.hz) } })}
                  />
                </View>
              </FadeIn>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8 },
  back: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14 },
  content: { paddingHorizontal: 24, paddingBottom: 64 },
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 3,
  },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 38,
    marginTop: 4,
  },
  subt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    marginTop: 4,
  },
  tabs: { gap: 10, marginTop: 22, paddingRight: 24 },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.border,
    backgroundColor: cores.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabIcon: { color: cores.muted, fontSize: 14 },
  tabTexto: { fontFamily: fontes.corpoMedium, color: cores.muted, fontSize: 13 },
  empty: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 22 },
  emptyTexto: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  destaqueCard: {
    marginTop: 28,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.accent + '66',
    borderRadius: 14,
    padding: 18,
  },
  destaqueLabel: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 10,
    letterSpacing: 2,
  },
  destaqueTexto: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    lineHeight: 30,
    marginTop: 8,
  },
  destaqueNota: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    marginTop: 8,
  },
  h2: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    marginTop: 28,
    marginBottom: 12,
  },
  praticaCard: {
    flexDirection: 'row',
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  praticaNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: cores.faint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  praticaNumTxt: {
    fontFamily: fontes.monoMedium,
    color: cores.accentSoft,
    fontSize: 14,
  },
  praticaTexto: {
    flex: 1,
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
    lineHeight: 21,
  },
  afirmCard: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
  },
  afirm: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
    lineHeight: 24,
    marginBottom: 4,
  },
});
