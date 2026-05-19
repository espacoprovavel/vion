import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { PERGUNTAS } from '@/constants/perguntas';
import { cores, fontes } from '@/constants/colors';
import { calcularFrequencia } from '@/lib/scoring';
import { getNivelMaisProximo } from '@/constants/niveis';
import { Storage } from '@/lib/storage';

type Fase = 'intro' | 'quiz' | 'transicao';

export default function Teste() {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>('intro');
  const [nome, setNome] = useState('');
  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);

  const total = PERGUNTAS.length;
  const pergunta = PERGUNTAS[idx];
  const progresso = idx / total;
  const noBloco2 = pergunta?.bloco === 2;

  const handleResposta = async (hz: number) => {
    Haptics.selectionAsync().catch(() => {});
    const novas = [...respostas, hz];
    setRespostas(novas);
    if (idx === 11) {
      setFase('transicao');
      return;
    }
    if (idx + 1 >= total) {
      await finalizar(novas);
      return;
    }
    setIdx(idx + 1);
  };

  const continuarDepoisTransicao = () => {
    setFase('quiz');
    setIdx(12);
  };

  const finalizar = async (todas: number[]) => {
    const b1 = todas.slice(0, 12);
    const b2 = todas.slice(12, 24);
    const hz = calcularFrequencia(b1, b2);
    const nivel = getNivelMaisProximo(hz);
    const nomeLimpo = (nome.trim() || 'tu');
    await Storage.setNome(nomeLimpo);
    await Storage.pushHistorico({
      hz,
      data: new Date().toISOString(),
      nivelHz: nivel.hz,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace({ pathname: '/resultado', params: { hz: String(hz) } });
  };

  if (fase === 'intro') {
    return (
      <CosmicBackground particles={50}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.introWrap}>
            <FadeIn delay={100}>
              <Text style={styles.introTit}>Antes de começar</Text>
              <Text style={styles.introDesc}>
                Não há respostas certas. Escolhe a opção que mais se aproxima de como{' '}
                <Text style={{ fontStyle: 'italic' }}>realmente</Text> reages — não como
                gostarias de reagir.{'\n\n'}24 situações. Cerca de 5 minutos.
              </Text>
            </FadeIn>
            <FadeIn delay={400}>
              <View style={{ marginTop: 36 }}>
                <Text style={styles.label}>O teu nome (ou como preferes ser chamado)</Text>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Ex.: Mariana"
                  placeholderTextColor={cores.muted}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>
            </FadeIn>
            <FadeIn delay={700}>
              <View style={{ marginTop: 40 }}>
                <GradientButton label="Começar" onPress={() => setFase('quiz')} />
                <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
                  <Text style={styles.voltar}>cancelar</Text>
                </Pressable>
              </View>
            </FadeIn>
          </ScrollView>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  if (fase === 'transicao') {
    return (
      <CosmicBackground particles={70} glow={cores.accent}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.transWrap}>
            <FadeIn delay={100}>
              <Text style={styles.transLabel}>BLOCO 2</Text>
              <Text style={styles.transTit}>Camada Profunda</Text>
              <Text style={styles.transDesc}>
                Acabaste de mapear a superfície. Agora{' '}
                <Text style={{ color: cores.accentSoft }}>desce um nível</Text>.{'\n\n'}As próximas
                12 perguntas tocam o teu padrão central. Respira. Sente. Responde sem editar.
              </Text>
            </FadeIn>
            <FadeIn delay={600}>
              <View style={{ marginTop: 40, width: '100%' }}>
                <GradientButton label="Continuar" onPress={continuarDepoisTransicao} />
              </View>
            </FadeIn>
          </View>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground particles={36} glow={noBloco2 ? cores.accent : undefined}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topo}>
          <View style={styles.progBg}>
            <View style={[styles.progFill, { width: `${progresso * 100}%` }]} />
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {idx + 1} / {total}
            </Text>
            <Text style={styles.meta}>
              {noBloco2 ? 'CAMADA PROFUNDA' : 'CAMADA SUPERFICIAL'}
            </Text>
          </View>
        </View>

        <ScrollView
          key={pergunta.id}
          contentContainerStyle={styles.quizBody}
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={50}>
            <Text style={styles.scene}>{pergunta.scene}</Text>
          </FadeIn>

          <View style={{ marginTop: 32 }}>
            {pergunta.opcoes.map((o, i) => (
              <FadeIn key={`${pergunta.id}-${i}`} delay={150 + i * 80}>
                <Pressable
                  onPress={() => handleResposta(o.hz)}
                  style={({ pressed }) => [
                    styles.opcao,
                    pressed && {
                      borderColor: cores.accent,
                      backgroundColor: '#1a1832',
                    },
                  ]}
                >
                  <Text style={styles.opcaoTexto}>{o.texto}</Text>
                </Pressable>
              </FadeIn>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  introWrap: {
    paddingHorizontal: 32,
    paddingVertical: 40,
    flexGrow: 1,
    justifyContent: 'center',
  },
  introTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 36,
    textAlign: 'center',
  },
  introDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 16,
  },
  label: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: cores.text,
    fontFamily: fontes.corpo,
    fontSize: 16,
  },
  voltar: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  topo: { paddingHorizontal: 24, paddingTop: 12 },
  progBg: {
    height: 2,
    backgroundColor: cores.faint,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progFill: { height: 2, backgroundColor: cores.accent },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  meta: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 2,
  },
  quizBody: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 64,
  },
  scene: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 28,
    lineHeight: 36,
  },
  opcao: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 12,
  },
  opcaoTexto: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 22,
  },
  transWrap: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transLabel: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 12,
    letterSpacing: 4,
    textAlign: 'center',
  },
  transTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 44,
    textAlign: 'center',
    marginTop: 8,
  },
  transDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 20,
  },
});
