import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import FadeIn from '@/components/FadeIn';
import GradientButton from '@/components/GradientButton';
import { cores, fontes } from '@/constants/colors';
import { Sync } from '@/lib/sync';

type Passo = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const TIPOS = [
  { id: 'pessoa', label: 'Uma pessoa' },
  { id: 'situacao', label: 'Uma situação' },
  { id: 'memoria', label: 'Uma memória' },
  { id: 'desejo', label: 'Um desejo / expectativa' },
] as const;

const ZONAS = [
  'Peito',
  'Garganta',
  'Estômago',
  'Cabeça',
  'Costas',
  'Pélvis',
  'Outro / Todo o corpo',
];

const SENSACAO_FINAL = [
  'Mais leve',
  'Mais espaço',
  'Mais tristeza, mas limpa',
  'Ainda igual — preciso de repetir',
  'Algo abriu',
];

export default function Libertacao() {
  const router = useRouter();
  const [passo, setPasso] = useState<Passo>(0);
  const [tipo, setTipo] = useState<string | null>(null);
  const [alvo, setAlvo] = useState('');
  const [zona, setZona] = useState<string | null>(null);
  const [intensidade, setIntensidade] = useState(7);
  const [carta, setCarta] = useState('');
  const [respirou, setRespirou] = useState(0);
  const [intensidadeFinal, setIntensidadeFinal] = useState(5);
  const [sensacao, setSensacao] = useState<string | null>(null);

  const avancar = () => {
    Haptics.selectionAsync().catch(() => {});
    setPasso((p) => (p + 1) as Passo);
  };

  const finalizar = async () => {
    await Sync.pushLibertacao({
      data: new Date().toISOString(),
      alvo: `${tipo}: ${alvo}`,
      intensidadeAntes: intensidade,
      intensidadeDepois: intensidadeFinal,
      sensacao: sensacao ?? '',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPasso(6);
  };

  return (
    <CosmicBackground particles={60} glow={cores.accent}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Libertação</Text>
          <Text style={styles.passoMeta}>{Math.min(passo + 1, 6)}/6</Text>
        </View>

        <View style={styles.progBg}>
          <View style={[styles.progFill, { width: `${(Math.min(passo, 6) / 6) * 100}%` }]} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {passo === 0 && (
              <FadeIn key="0">
                <Text style={styles.passoLabel}>PASSO 1 · NOMEAR</Text>
                <Text style={styles.passoTitulo}>O que queres soltar?</Text>
                <Text style={styles.passoDesc}>
                  Identifica o tipo de ligação. Esta clareza inicial é metade do trabalho.
                </Text>

                <View style={styles.opcoes}>
                  {TIPOS.map((t) => (
                    <Pressable
                      key={t.id}
                      onPress={() => setTipo(t.id)}
                      style={[
                        styles.opcao,
                        tipo === t.id && {
                          borderColor: cores.accent,
                          backgroundColor: '#EDE9FE',
                        },
                      ]}
                    >
                      <Text style={styles.opcaoTexto}>{t.label}</Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.inputLabel}>Em poucas palavras, descreve.</Text>
                <TextInput
                  value={alvo}
                  onChangeText={setAlvo}
                  placeholder="Ex.: A relação com o meu pai · A demissão · O medo de ficar só"
                  placeholderTextColor={cores.muted}
                  style={styles.input}
                  multiline
                />

                <View style={{ marginTop: 24 }}>
                  <GradientButton
                    label="Continuar"
                    onPress={avancar}
                    disabled={!tipo || alvo.trim().length < 3}
                  />
                </View>
              </FadeIn>
            )}

            {passo === 1 && (
              <FadeIn key="1">
                <Text style={styles.passoLabel}>PASSO 2 · MAPEAR</Text>
                <Text style={styles.passoTitulo}>Onde isto vive em ti?</Text>
                <Text style={styles.passoDesc}>
                  Fecha os olhos por 10 segundos. Pensa no que escreveste. Pergunta ao corpo:
                  onde sinto isto?
                </Text>

                <View style={styles.zonas}>
                  {ZONAS.map((z) => (
                    <Pressable
                      key={z}
                      onPress={() => setZona(z)}
                      style={[
                        styles.zona,
                        zona === z && {
                          borderColor: cores.accentSoft,
                          backgroundColor: '#EDE9FE',
                        },
                      ]}
                    >
                      <Text style={styles.zonaTexto}>{z}</Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.inputLabel}>
                  Intensidade da sensação (1 leve · 10 esmagadora)
                </Text>
                <Slider value={intensidade} onChange={setIntensidade} />

                <View style={{ marginTop: 24 }}>
                  <GradientButton label="Continuar" onPress={avancar} disabled={!zona} />
                </View>
              </FadeIn>
            )}

            {passo === 2 && (
              <FadeIn key="2">
                <Text style={styles.passoLabel}>PASSO 3 · CARTA QUE NÃO ENVIAS</Text>
                <Text style={styles.passoTitulo}>Diz o que nunca disseste.</Text>
                <Text style={styles.passoDesc}>
                  Esta carta não é para enviar. É para libertar o que ficou preso por dentro.
                  Sem editar. Sem formatar. Apenas escrever.
                </Text>

                <TextInput
                  value={carta}
                  onChangeText={setCarta}
                  placeholder={`Querido(a) ___,\n\nO que nunca te disse é...`}
                  placeholderTextColor={cores.muted}
                  style={styles.cartaInput}
                  multiline
                />

                <Text style={styles.dica}>
                  Dica: começa por "Querido(a)..." mesmo que seja para uma situação ou parte de
                  ti.
                </Text>

                <View style={{ marginTop: 16 }}>
                  <GradientButton
                    label="Continuar"
                    onPress={avancar}
                    disabled={carta.trim().length < 20}
                  />
                </View>
              </FadeIn>
            )}

            {passo === 3 && (
              <FadeIn key="3">
                <Text style={styles.passoLabel}>PASSO 4 · TÉCNICA DE LIBERTAÇÃO</Text>
                <Text style={styles.passoTitulo}>Sentir · Permitir · Soltar</Text>
                <Text style={styles.passoDesc}>
                  Técnica de Hawkins. Em vez de combater a emoção, atravessa-a. Faz 3 ciclos.
                </Text>

                <View style={styles.tecnicaSteps}>
                  <Step n={1} txt="Senta-te direito. Coloca a mão na zona que identificaste." />
                  <Step n={2} txt="Sente totalmente o que está lá. Sem nome. Sem história. Só sensação." />
                  <Step n={3} txt='Pergunta-te: "Posso permitir esta sensação estar?" Espera o sim interno.' />
                  <Step n={4} txt='Pergunta-te: "Posso soltá-la?" Não tentes — apenas pergunta.' />
                  <Step n={5} txt='Pergunta: "Quando?" Sente o "agora" ou "ainda não". Respeita.' />
                  <Step n={6} txt="Inspira fundo · expira longo. Repete o ciclo." />
                </View>

                <View style={styles.contadorBox}>
                  <Text style={styles.contadorLabel}>CICLOS COMPLETADOS</Text>
                  <View style={styles.contadorRow}>
                    {[1, 2, 3].map((c) => (
                      <Pressable
                        key={c}
                        onPress={() => setRespirou(c)}
                        style={[
                          styles.contadorPonto,
                          respirou >= c && {
                            backgroundColor: cores.accent,
                            borderColor: cores.accentSoft,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={{ marginTop: 24 }}>
                  <GradientButton
                    label={respirou >= 3 ? 'Continuar' : `${respirou}/3 ciclos`}
                    onPress={avancar}
                    disabled={respirou < 3}
                  />
                </View>
              </FadeIn>
            )}

            {passo === 4 && (
              <FadeIn key="4">
                <Text style={styles.passoLabel}>PASSO 5 · RE-LEITURA</Text>
                <Text style={styles.passoTitulo}>Como está agora?</Text>
                <Text style={styles.passoDesc}>
                  Volta a "{alvo}". Sente a mesma zona ({zona?.toLowerCase()}). Qual a
                  intensidade agora?
                </Text>

                <View style={{ marginTop: 20 }}>
                  <Text style={styles.inputLabel}>
                    Antes: {intensidade}/10 · Agora:
                  </Text>
                  <Slider value={intensidadeFinal} onChange={setIntensidadeFinal} />
                </View>

                <Text style={styles.inputLabel}>O que mudou?</Text>
                <View style={styles.opcoes}>
                  {SENSACAO_FINAL.map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setSensacao(s)}
                      style={[
                        styles.opcao,
                        sensacao === s && {
                          borderColor: cores.green,
                          backgroundColor: '#10D98A11',
                        },
                      ]}
                    >
                      <Text style={styles.opcaoTexto}>{s}</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={{ marginTop: 24 }}>
                  <GradientButton
                    label="Fechar o ritual"
                    variant="gold"
                    onPress={finalizar}
                    disabled={!sensacao}
                  />
                </View>
              </FadeIn>
            )}

            {passo === 5 && null}

            {passo === 6 && (
              <FadeIn key="6">
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                  <Text style={styles.bigEmoji}>✦</Text>
                  <Text style={styles.fimTit}>Ritual fechado</Text>
                  <Text style={styles.fimDesc}>
                    A libertação raramente é total numa sessão. Repete amanhã, e no dia
                    seguinte. Anos de apego podem soltar-se em ciclos curtos — desde que
                    consistentes.
                  </Text>

                  <View style={styles.resumo}>
                    <Linha label="Antes" valor={`${intensidade}/10`} />
                    <Linha label="Depois" valor={`${intensidadeFinal}/10`} cor={cores.green} />
                    <Linha label="Diferença" valor={`${intensidade - intensidadeFinal} pontos`} />
                  </View>

                  <View style={{ height: 24 }} />
                  <GradientButton
                    label="Voltar"
                    variant="secondary"
                    onPress={() => router.replace('/evolucao')}
                  />
                  <Pressable onPress={() => setPasso(0)} style={{ marginTop: 14 }}>
                    <Text style={styles.repetir}>Fazer outra libertação</Text>
                  </Pressable>
                </View>
              </FadeIn>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.sliderWrap}>
      {Array.from({ length: 10 }).map((_, i) => {
        const n = i + 1;
        const on = n <= value;
        return (
          <Pressable
            key={n}
            onPress={() => onChange(n)}
            style={[
              styles.sliderDot,
              on && { backgroundColor: cores.accent, borderColor: cores.accentSoft },
            ]}
          >
            <Text style={[styles.sliderNum, on && { color: cores.text }]}>{n}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Step({ n, txt }: { n: number; txt: string }) {
  return (
    <View style={styles.step}>
      <Text style={styles.stepNum}>{n}</Text>
      <Text style={styles.stepTxt}>{txt}</Text>
    </View>
  );
}

function Linha({ label, valor, cor }: { label: string; valor: string; cor?: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={[styles.linhaValor, cor ? { color: cor } : null]}>{valor}</Text>
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
  },
  back: { color: cores.muted, fontSize: 22 },
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  passoMeta: { fontFamily: fontes.mono, color: cores.muted, fontSize: 11, letterSpacing: 2 },
  progBg: {
    height: 2,
    backgroundColor: cores.faint,
    marginTop: 12,
  },
  progFill: { height: 2, backgroundColor: cores.accent },
  content: { paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 80 },
  passoLabel: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 3,
  },
  passoTitulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 32,
    marginTop: 6,
    lineHeight: 38,
  },
  passoDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  opcoes: { marginTop: 20 },
  opcao: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  opcaoTexto: { fontFamily: fontes.corpo, color: cores.text, fontSize: 14 },
  inputLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 22,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: cores.text,
    fontFamily: fontes.corpo,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  zonas: { marginTop: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  zona: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.border,
    backgroundColor: cores.card,
  },
  zonaTexto: { fontFamily: fontes.corpo, color: cores.text, fontSize: 13 },
  sliderWrap: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderDot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.border,
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderNum: { fontFamily: fontes.mono, color: cores.muted, fontSize: 11 },
  cartaInput: {
    marginTop: 16,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    padding: 14,
    color: cores.text,
    fontFamily: fontes.corpo,
    fontSize: 15,
    minHeight: 220,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  dica: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    marginTop: 10,
    fontStyle: 'italic',
  },
  tecnicaSteps: { marginTop: 20 },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.faint,
  },
  stepNum: {
    fontFamily: fontes.monoMedium,
    color: cores.accentSoft,
    fontSize: 14,
    width: 24,
  },
  stepTxt: {
    flex: 1,
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
    lineHeight: 22,
  },
  contadorBox: {
    marginTop: 28,
    padding: 16,
    backgroundColor: cores.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
    alignItems: 'center',
  },
  contadorLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
  },
  contadorRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  contadorPonto: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: cores.border,
    backgroundColor: 'transparent',
  },
  bigEmoji: { fontSize: 64, color: cores.gold },
  fimTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 32,
    marginTop: 12,
  },
  fimDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  resumo: {
    marginTop: 24,
    width: '100%',
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.faint,
  },
  linhaLabel: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13 },
  linhaValor: { fontFamily: fontes.monoMedium, color: cores.text, fontSize: 14 },
  repetir: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
  },
});
