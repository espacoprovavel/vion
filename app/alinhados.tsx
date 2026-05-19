import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import AvatarOrb from '@/components/AvatarOrb';
import BottomNav from '@/components/BottomNav';
import GradientButton from '@/components/GradientButton';
import { ARQUETIPOS, getArquetipoPorHz, getArquetiposAfins } from '@/constants/arquetipos';
import { NIVEIS } from '@/constants/niveis';
import { cores, fontes } from '@/constants/colors';
import { Storage, type TestEntry } from '@/lib/storage';

export default function Alinhados() {
  const router = useRouter();
  const [historico, setHistorico] = useState<TestEntry[]>([]);

  useEffect(() => {
    Storage.getHistorico().then(setHistorico);
  }, []);

  const ultimo = historico[historico.length - 1];

  if (!ultimo) {
    return (
      <CosmicBackground particles={50}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text style={styles.back}>←</Text>
            </Pressable>
            <Text style={styles.headerTitulo}>Alinhados</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>○</Text>
            <Text style={styles.emptyTit}>Sem leitura ainda</Text>
            <Text style={styles.emptyTexto}>
              Para revelarmos quem vibra contigo, precisas de fazer o teste primeiro.
            </Text>
            <View style={{ height: 20 }} />
            <GradientButton label="Iniciar Mapeamento" onPress={() => router.push('/teste')} />
          </View>
          <BottomNav active="alinhados" />
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  const meuArq = getArquetipoPorHz(ultimo.nivelHz);
  const afins = getArquetiposAfins(ultimo.nivelHz, 50).filter((a) => a.id !== meuArq.id);
  const corMinha = getCor(meuArq.hz);

  return (
    <CosmicBackground particles={70} glow={corMinha}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Alinhados</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>VIBRAM NA TUA FAIXA</Text>
            <Text style={styles.titulo}>{afins.length} arquétipos afins</Text>
            <Text style={styles.subt}>
              ±50 Hz do teu campo · {ultimo.hz} Hz
            </Text>
          </FadeIn>

          <FadeIn delay={250}>
            <View style={styles.centroWrap}>
              <View style={styles.centro}>
                <AvatarOrb
                  emoji={meuArq.emoji}
                  nome={meuArq.nome}
                  cor={corMinha}
                  hz={meuArq.hz}
                  active
                  size={96}
                />
                <View style={[styles.checkWrap, { borderColor: corMinha }]}>
                  <Text style={[styles.check, { color: corMinha }]}>✓</Text>
                </View>
              </View>
            </View>
          </FadeIn>

          {afins.length > 0 ? (
            <FadeIn delay={400}>
              <View style={styles.grid}>
                {afins.map((a, i) => (
                  <FadeIn key={a.id} delay={500 + i * 60}>
                    <View style={styles.gridItem}>
                      <AvatarOrb
                        emoji={a.emoji}
                        nome={a.nome}
                        cor={getCor(a.hz)}
                        hz={a.hz}
                        onPress={() =>
                          router.push({ pathname: '/perfil', params: { id: a.id } })
                        }
                      />
                    </View>
                  </FadeIn>
                ))}
              </View>
            </FadeIn>
          ) : (
            <FadeIn delay={400}>
              <View style={styles.semAfins}>
                <Text style={styles.semAfinsTit}>Ainda sozinho na tua faixa</Text>
                <Text style={styles.semAfinsTexto}>
                  Não há outros arquétipos a ±50 Hz do teu campo. Estás num ponto único — pode
                  ser por isto mesmo que estás aqui.
                </Text>
              </View>
            </FadeIn>
          )}
        </ScrollView>

        <BottomNav active="alinhados" />
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
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 22 },
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
    fontSize: 32,
    textAlign: 'center',
    marginTop: 6,
  },
  subt: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 2,
  },
  centroWrap: { alignItems: 'center', marginTop: 30, marginBottom: 30 },
  centro: { position: 'relative' },
  checkWrap: {
    position: 'absolute',
    bottom: 30,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: cores.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { fontFamily: fontes.corpoBold, fontSize: 22 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 20,
  },
  gridItem: { width: '33%', alignItems: 'center', paddingVertical: 10 },
  empty: { flex: 1, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 56, color: cores.muted },
  emptyTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 24,
    marginTop: 16,
  },
  emptyTexto: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  semAfins: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
  },
  semAfinsTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 20,
  },
  semAfinsTexto: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
  },
});
