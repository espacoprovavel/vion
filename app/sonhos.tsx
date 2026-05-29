import React, { useEffect, useState } from 'react';
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
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import GradientButton from '@/components/GradientButton';
import BottomNav from '@/components/BottomNav';
import { cores, fontes } from '@/constants/colors';
import { analisarSonho, HUMORES, type AnaliseSonho } from '@/constants/sonhos';
import { Storage, type Sonho } from '@/lib/storage';

export default function Sonhos() {
  const router = useRouter();
  const [texto, setTexto] = useState('');
  const [humor, setHumor] = useState<string>('');
  const [analise, setAnalise] = useState<AnaliseSonho | null>(null);
  const [historico, setHistorico] = useState<Sonho[]>([]);

  useEffect(() => {
    Storage.getSonhos().then(setHistorico);
  }, []);

  const podeAnalisar = texto.trim().length >= 15 && !!humor;

  async function analisar() {
    const a = analisarSonho(texto, humor);
    setAnalise(a);
    const sonho: Sonho = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      texto: texto.trim(),
      humor,
      simbolos: a.simbolos.map((s) => s.id),
    };
    await Storage.pushSonho(sonho);
    setHistorico(await Storage.getSonhos());
  }

  function novo() {
    setTexto('');
    setHumor('');
    setAnalise(null);
  }

  return (
    <CosmicBackground particles={22}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Sonhos</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {!analise ? (
            <>
              <FadeIn>
                <Text style={styles.titulo}>O Diário dos Sonhos</Text>
                <Text style={styles.sub}>
                  Escreve o teu sonho enquanto ainda está fresco. A linguagem do inconsciente é
                  simbólica — vamos lê-la juntos.
                </Text>
              </FadeIn>

              <FadeIn delay={120}>
                <Text style={styles.label}>O QUE SONHASTE</Text>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Estava num lugar... apareceu... senti..."
                  placeholderTextColor={cores.muted}
                  value={texto}
                  onChangeText={setTexto}
                  textAlignVertical="top"
                />
              </FadeIn>

              <FadeIn delay={200}>
                <Text style={styles.label}>COMO ACORDASTE</Text>
                <View style={styles.humores}>
                  {HUMORES.map((h) => {
                    const ativo = humor === h.id;
                    return (
                      <Pressable
                        key={h.id}
                        onPress={() => setHumor(h.id)}
                        style={[styles.humor, ativo && styles.humorAtivo]}
                      >
                        <Text style={styles.humorEmoji}>{h.emoji}</Text>
                        <Text style={[styles.humorLabel, ativo && styles.humorLabelAtivo]}>
                          {h.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </FadeIn>

              <FadeIn delay={280}>
                <View style={{ marginTop: 24 }}>
                  <GradientButton
                    label="Interpretar sonho"
                    onPress={analisar}
                    disabled={!podeAnalisar}
                  />
                  {!podeAnalisar && (
                    <Text style={styles.dica}>Escreve o sonho e escolhe como acordaste.</Text>
                  )}
                </View>
              </FadeIn>

              {historico.length > 0 && (
                <FadeIn delay={340}>
                  <Text style={[styles.label, { marginTop: 36 }]}>SONHOS ANTERIORES</Text>
                  {historico.slice(0, 8).map((s) => (
                    <View key={s.id} style={styles.histItem}>
                      <Text style={styles.histData}>{formatarData(s.data)}</Text>
                      <Text style={styles.histTexto} numberOfLines={2}>
                        {s.texto}
                      </Text>
                    </View>
                  ))}
                </FadeIn>
              )}
            </>
          ) : (
            <FadeIn>
              <Text style={styles.titulo}>Leitura simbólica</Text>

              {analise.simbolos.length > 0 && (
                <View style={styles.tags}>
                  {analise.simbolos.map((s) => (
                    <View key={s.id} style={styles.tag}>
                      <Text style={styles.tagTxt}>{s.nome}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={styles.sintese}>{analise.sintese}</Text>

              <View style={styles.perguntasBox}>
                <Text style={styles.perguntasLabel}>PARA REFLETIR</Text>
                {analise.perguntas.map((p, i) => (
                  <Text key={i} style={styles.pergunta}>
                    — {p}
                  </Text>
                ))}
              </View>

              <View style={styles.aviso}>
                <Text style={styles.avisoTit}>Uma nota importante</Text>
                <Text style={styles.avisoTxt}>
                  Esta leitura é uma ferramenta de auto-reflexão inspirada na psicologia
                  junguiana. Não é diagnóstico nem substitui acompanhamento. Se os teus sonhos
                  trazem angústia recorrente, ou se atravessas um momento difícil, procura um
                  psicólogo ou psicoterapeuta — o trabalho com um profissional é o caminho mais
                  seguro e profundo.
                </Text>
              </View>

              <View style={{ marginTop: 24 }}>
                <GradientButton label="Registar outro sonho" onPress={novo} />
              </View>
            </FadeIn>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
        <BottomNav active="explorar" />
      </SafeAreaView>
    </CosmicBackground>
  );
}

function formatarData(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
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
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  titulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 32, marginTop: 8 },
  sub: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 28,
    marginBottom: 10,
  },
  input: {
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
    minHeight: 150,
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 23,
  },
  humores: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  humor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: cores.border,
    backgroundColor: cores.surface,
  },
  humorAtivo: { borderColor: cores.accent, backgroundColor: cores.accent + '14' },
  humorEmoji: { fontSize: 16 },
  humorLabel: { fontFamily: fontes.corpoMedium, color: cores.muted, fontSize: 13 },
  humorLabelAtivo: { color: cores.text },
  dica: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 12, textAlign: 'center', marginTop: 10 },
  histItem: {
    borderLeftWidth: 2,
    borderLeftColor: cores.border,
    paddingLeft: 14,
    paddingVertical: 8,
    marginBottom: 4,
  },
  histData: { fontFamily: fontes.mono, color: cores.muted, fontSize: 11, letterSpacing: 1 },
  histTexto: { fontFamily: fontes.corpo, color: cores.text, fontSize: 14, marginTop: 2, opacity: 0.85 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  tag: {
    backgroundColor: cores.accent + '14',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagTxt: { fontFamily: fontes.monoMedium, color: cores.accentSoft, fontSize: 12 },
  sintese: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 25,
    marginTop: 20,
    opacity: 0.92,
  },
  perguntasBox: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 18,
    backgroundColor: cores.surface,
  },
  perguntasLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
  },
  pergunta: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 18,
    fontStyle: 'italic',
    lineHeight: 28,
    marginBottom: 6,
  },
  aviso: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: cores.gold + '40',
    borderRadius: 14,
    padding: 16,
    backgroundColor: cores.gold + '0D',
  },
  avisoTit: { fontFamily: fontes.corpoBold, color: cores.gold, fontSize: 13, marginBottom: 6 },
  avisoTxt: { fontFamily: fontes.corpo, color: cores.text, fontSize: 13, lineHeight: 21, opacity: 0.85 },
});
