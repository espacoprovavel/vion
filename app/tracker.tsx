import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Line, Path, Stop } from 'react-native-svg';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { Storage, type TestEntry } from '@/lib/storage';
import { cores, fontes } from '@/constants/colors';
import { getNivelMaisProximo } from '@/constants/niveis';
import { agendarLembreteSemanal } from '@/lib/notifications';

const { width: W } = Dimensions.get('window');

export default function Tracker() {
  const router = useRouter();
  const [historico, setHistorico] = useState<TestEntry[]>([]);
  const [pode, setPode] = useState(false);

  useEffect(() => {
    Storage.getHistorico().then(setHistorico);
    Storage.podeFazerTeste().then(setPode);
    agendarLembreteSemanal().catch(() => {});
  }, []);

  const ultimo = historico[historico.length - 1];
  const penultimo = historico[historico.length - 2];

  const tendencia = useMemo(() => {
    if (!ultimo || !penultimo) return 'estável' as const;
    const d = ultimo.hz - penultimo.hz;
    if (d > 10) return 'a subir' as const;
    if (d < -10) return 'a descer' as const;
    return 'estável' as const;
  }, [ultimo, penultimo]);

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
            <Text style={styles.label}>TRACKER</Text>
            <Text style={styles.titulo}>A tua evolução</Text>
            <Text style={styles.subt}>1 teste por semana · últimos 12 meses</Text>
          </FadeIn>

          {historico.length === 0 ? (
            <FadeIn delay={200}>
              <View style={styles.empty}>
                <Text style={styles.emptyTit}>Ainda sem registos</Text>
                <Text style={styles.emptyTexto}>
                  Faz o teu primeiro teste para iniciar o tracker.
                </Text>
                <View style={{ height: 20 }} />
                <GradientButton label="Iniciar Mapeamento" onPress={() => router.push('/teste')} />
              </View>
            </FadeIn>
          ) : (
            <>
              <FadeIn delay={150}>
                <View style={styles.statsRow}>
                  <KV label="Última leitura" valor={`${ultimo!.hz} Hz`} />
                  <KV
                    label="Tendência"
                    valor={tendencia}
                    cor={
                      tendencia === 'a subir'
                        ? cores.green
                        : tendencia === 'a descer'
                          ? cores.red
                          : cores.muted
                    }
                  />
                  <KV label="Total" valor={String(historico.length)} />
                </View>
              </FadeIn>

              <FadeIn delay={300}>
                <Grafico data={historico} />
              </FadeIn>

              <FadeIn delay={400}>
                <View style={{ marginTop: 24 }}>
                  <Text style={styles.histTit}>Histórico</Text>
                  {[...historico].reverse().slice(0, 12).map((h, i) => {
                    const n = getNivelMaisProximo(h.nivelHz);
                    const d = new Date(h.data);
                    return (
                      <View key={i} style={styles.histItem}>
                        <View style={[styles.histDot, { backgroundColor: n.cor }]} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.histNivel}>
                            {n.emoji} {n.nome}
                          </Text>
                          <Text style={styles.histData}>
                            {d.toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Text>
                        </View>
                        <Text style={styles.histHz}>{h.hz} Hz</Text>
                      </View>
                    );
                  })}
                </View>
              </FadeIn>

              <FadeIn delay={500}>
                <View style={{ marginTop: 28 }}>
                  <GradientButton
                    label={pode ? 'Refazer o teste' : 'Próximo teste disponível em breve'}
                    onPress={() => pode && router.push('/teste')}
                    disabled={!pode}
                  />
                  {!pode && (
                    <Text style={styles.lembrete}>
                      Lembrete: 1 teste por semana mantém a leitura fiel ao teu padrão.
                    </Text>
                  )}
                </View>
              </FadeIn>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function KV({ label, valor, cor }: { label: string; valor: string; cor?: string }) {
  return (
    <View style={styles.kv}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValor, cor && { color: cor }]}>{valor}</Text>
    </View>
  );
}

function Grafico({ data }: { data: TestEntry[] }) {
  const w = W - 48;
  const h = 200;
  const pad = 24;
  const maxHz = 700;
  const minHz = 0;

  const pts = data.map((d, i) => {
    const x = pad + (i / Math.max(1, data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (d.hz - minHz) / (maxHz - minHz)) * (h - pad * 2);
    return { x, y, hz: d.hz };
  });

  const path = pts
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const limiarY = pad + (1 - 200 / 700) * (h - pad * 2);

  return (
    <View style={styles.chartWrap}>
      <Svg width={w} height={h}>
        <Defs>
          <SvgGradient id="line" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor={cores.accent} />
            <Stop offset="100%" stopColor={cores.accentSoft} />
          </SvgGradient>
        </Defs>
        <Line
          x1={pad}
          x2={w - pad}
          y1={limiarY}
          y2={limiarY}
          stroke={cores.green}
          strokeOpacity={0.5}
          strokeDasharray="4 4"
        />
        {pts.length > 1 && (
          <Path d={path} stroke="url(#line)" strokeWidth={2} fill="none" />
        )}
        {pts.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={cores.accentSoft} />
        ))}
      </Svg>
      <View style={styles.chartLabels}>
        <Text style={styles.chartLab}>700</Text>
        <Text style={[styles.chartLab, { color: cores.green }]}>200</Text>
        <Text style={styles.chartLab}>0</Text>
      </View>
    </View>
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
  empty: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 24,
  },
  emptyTexto: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 10,
  },
  kv: {
    flex: 1,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    padding: 12,
    borderRadius: 12,
  },
  kvLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  kvValor: {
    fontFamily: fontes.monoMedium,
    color: cores.text,
    fontSize: 18,
    marginTop: 4,
  },
  chartWrap: {
    marginTop: 22,
    backgroundColor: cores.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
    padding: 12,
    paddingRight: 36,
    position: 'relative',
  },
  chartLabels: {
    position: 'absolute',
    right: 8,
    top: 12,
    bottom: 12,
    justifyContent: 'space-between',
  },
  chartLab: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
  },
  histTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    marginBottom: 12,
  },
  histItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.faint,
  },
  histDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  histNivel: {
    fontFamily: fontes.corpoMedium,
    color: cores.text,
    fontSize: 14,
  },
  histData: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    marginTop: 2,
  },
  histHz: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 14,
  },
  lembrete: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
});
