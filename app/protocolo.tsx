import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import GradientButton from '@/components/GradientButton';
import { PROTOCOLO_21, getProgressoDia } from '@/constants/protocolo';
import { cores, fontes } from '@/constants/colors';
import { Storage } from '@/lib/storage';

export default function Protocolo() {
  const router = useRouter();
  const [inicio, setInicio] = useState<string | null>(null);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  const carregar = async () => {
    const i = await Storage.getProtocoloInicio();
    setInicio(i);
    const d = await Storage.getDiasFeitos();
    setFeitos(d);
    const actual = getProgressoDia(i);
    setDiaSelecionado(actual);
  };

  useEffect(() => {
    carregar();
  }, []);

  const diaActual = getProgressoDia(inicio);

  const iniciar = async () => {
    await Storage.iniciarProtocolo();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    carregar();
  };

  const reset = () => {
    Alert.alert(
      'Reiniciar protocolo?',
      'Vais perder o registo dos dias feitos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            await Storage.resetProtocolo();
            carregar();
          },
        },
      ],
    );
  };

  const marcar = async (n: number) => {
    Haptics.selectionAsync().catch(() => {});
    await Storage.marcarDia(n);
    carregar();
  };

  if (!inicio) {
    return (
      <CosmicBackground particles={50} glow={cores.accent}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text style={styles.back}>←</Text>
            </Pressable>
            <Text style={styles.headerTitulo}>Protocolo 21 dias</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView contentContainerStyle={styles.introWrap}>
            <FadeIn>
              <Text style={styles.bigEmoji}>◐</Text>
              <Text style={styles.introTit}>21 dias{'\n'}para comprimir anos</Text>
              <Text style={styles.introDesc}>
                Não é um curso. É um caminho. Cada dia tem uma intenção, uma prática curta e uma
                pergunta para habitar.{'\n\n'}Faz com consistência. A profundidade está na
                repetição honesta, não na novidade.
              </Text>
            </FadeIn>
            <FadeIn delay={300}>
              <View style={styles.estruturaBox}>
                <Linha n="1—7" tit="Reconhecer" desc="Ver, nomear, mapear apegos." />
                <Linha n="8—14" tit="Soltar" desc="Sombra, crenças, energia, perdão." />
                <Linha n="15—21" tit="Integrar" desc="Propósito, acção, permanência." />
              </View>
            </FadeIn>
            <FadeIn delay={500}>
              <View style={{ marginTop: 28 }}>
                <GradientButton label="Iniciar agora" variant="gold" onPress={iniciar} />
              </View>
            </FadeIn>
          </ScrollView>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  const dia = diaSelecionado
    ? PROTOCOLO_21.find((d) => d.dia === diaSelecionado)!
    : PROTOCOLO_21[0];

  const feito = feitos.includes(dia.dia);
  const podeMarcar = diaActual !== null && dia.dia <= diaActual;

  return (
    <CosmicBackground particles={50} glow={cores.accent}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Protocolo</Text>
          <Pressable onPress={reset} hitSlop={12}>
            <Text style={styles.reset}>↻</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>PROGRESSO</Text>
            <Text style={styles.titulo}>
              Dia {diaActual ?? 1} de 21
            </Text>
            <Text style={styles.subt}>{feitos.length} práticas concluídas</Text>
          </FadeIn>

          <FadeIn delay={150}>
            <View style={styles.calendario}>
              {PROTOCOLO_21.map((d) => {
                const disponivel = diaActual !== null && d.dia <= diaActual;
                const concluido = feitos.includes(d.dia);
                const sel = diaSelecionado === d.dia;
                return (
                  <Pressable
                    key={d.dia}
                    onPress={() => disponivel && setDiaSelecionado(d.dia)}
                    style={[
                      styles.diaQuad,
                      disponivel && styles.diaQuadDisp,
                      concluido && {
                        backgroundColor: cores.accent + '44',
                        borderColor: cores.accentSoft,
                      },
                      sel && {
                        borderColor: cores.gold,
                        borderWidth: 2,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diaNum,
                        !disponivel && { color: cores.muted },
                        concluido && { color: cores.accentSoft },
                      ]}
                    >
                      {d.dia}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeIn>

          <FadeIn delay={250}>
            <View style={styles.diaCard}>
              <Text style={styles.diaCardLabel}>DIA {dia.dia} · {dia.tema.toUpperCase()}</Text>
              <Text style={styles.diaTit}>Intenção</Text>
              <Text style={styles.diaIntencao}>"{dia.intencao}"</Text>

              <Text style={styles.diaTit}>Prática</Text>
              <Text style={styles.diaTexto}>{dia.pratica}</Text>

              <Text style={styles.diaTit}>Pergunta para habitar</Text>
              <Text style={styles.diaPerg}>{dia.pergunta}</Text>

              {podeMarcar && !feito && (
                <View style={{ marginTop: 18 }}>
                  <GradientButton label="Marcar como feito" onPress={() => marcar(dia.dia)} />
                </View>
              )}
              {feito && (
                <View style={styles.feitoBadge}>
                  <Text style={styles.feitoTxt}>✓ Concluído</Text>
                </View>
              )}
              {!podeMarcar && (
                <Text style={styles.bloqueado}>
                  Este dia abre-se naturalmente no calendário — não acelerar.
                </Text>
              )}
            </View>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Linha({ n, tit, desc }: { n: string; tit: string; desc: string }) {
  return (
    <View style={styles.lin}>
      <Text style={styles.linN}>Dias {n}</Text>
      <Text style={styles.linTit}>{tit}</Text>
      <Text style={styles.linDesc}>{desc}</Text>
    </View>
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
  reset: { color: cores.muted, fontSize: 22 },
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  introWrap: { paddingHorizontal: 28, paddingVertical: 24, paddingBottom: 60 },
  bigEmoji: { fontSize: 54, textAlign: 'center', color: cores.gold, marginTop: 20 },
  introTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 36,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 42,
  },
  introDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 16,
  },
  estruturaBox: {
    marginTop: 32,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
  },
  lin: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: cores.faint },
  linN: { fontFamily: fontes.mono, color: cores.accentSoft, fontSize: 11, letterSpacing: 2 },
  linTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 18, marginTop: 4 },
  linDesc: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, marginTop: 2 },
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
  calendario: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 20,
  },
  diaQuad: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cores.faint,
    backgroundColor: cores.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diaQuadDisp: { backgroundColor: cores.card, borderColor: cores.border },
  diaNum: {
    fontFamily: fontes.mono,
    color: cores.text,
    fontSize: 13,
  },
  diaCard: {
    marginTop: 24,
    padding: 18,
    backgroundColor: cores.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
  },
  diaCardLabel: {
    fontFamily: fontes.mono,
    color: cores.gold,
    fontSize: 10,
    letterSpacing: 2,
  },
  diaTit: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  diaIntencao: {
    fontFamily: fontes.titulo,
    color: cores.accentSoft,
    fontStyle: 'italic',
    fontSize: 20,
    marginTop: 6,
    lineHeight: 28,
  },
  diaTexto: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
  },
  diaPerg: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 18,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 26,
  },
  feitoBadge: {
    marginTop: 18,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.green,
    borderRadius: 10,
    backgroundColor: cores.green + '11',
  },
  feitoTxt: {
    fontFamily: fontes.corpoMedium,
    color: cores.green,
    fontSize: 13,
    letterSpacing: 1,
  },
  bloqueado: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 14,
    textAlign: 'center',
  },
});
