import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import BottomNav from '@/components/BottomNav';
import GradientButton from '@/components/GradientButton';
import { Storage, type TestEntry, type Libertacao } from '@/lib/storage';
import { getNivelMaisProximo } from '@/constants/niveis';
import { getArquetipoPorHz } from '@/constants/arquetipos';
import { getChakraPorHz } from '@/constants/chakras';
import { getProgressoDia } from '@/constants/protocolo';
import { cores, fontes } from '@/constants/colors';

export default function Evolucao() {
  const router = useRouter();
  const [hist, setHist] = useState<TestEntry[]>([]);
  const [libs, setLibs] = useState<Libertacao[]>([]);
  const [protoInicio, setProtoInicio] = useState<string | null>(null);
  const [diasFeitos, setDiasFeitos] = useState<number[]>([]);
  const [nome, setNome] = useState('');

  useEffect(() => {
    Storage.getHistorico().then(setHist);
    Storage.getLibertacoes().then(setLibs);
    Storage.getProtocoloInicio().then(setProtoInicio);
    Storage.getDiasFeitos().then(setDiasFeitos);
    Storage.getNome().then((n) => setNome(n ?? ''));
  }, []);

  const ultimo = hist[hist.length - 1];
  const nivel = ultimo ? getNivelMaisProximo(ultimo.nivelHz) : null;
  const arquetipo = ultimo ? getArquetipoPorHz(ultimo.nivelHz) : null;
  const chakra = ultimo ? getChakraPorHz(ultimo.nivelHz) : null;
  const diaActual = getProgressoDia(protoInicio);

  if (!ultimo) {
    return (
      <CosmicBackground particles={50}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>✦</Text>
            <Text style={styles.emptyTit}>Antes da elevação,{'\n'}a leitura.</Text>
            <Text style={styles.emptyTexto}>
              Para personalizar o trabalho de elevação precisamos de saber em que campo vibras
              agora.
            </Text>
            <View style={{ height: 20 }} />
            <GradientButton label="Fazer o Mapeamento" onPress={() => router.push('/teste')} />
          </View>
          <BottomNav active="eu" />
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  const corNivel = nivel!.cor === '#a0ffc0' ? cores.green : nivel!.cor;

  return (
    <CosmicBackground particles={50} glow={corNivel}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>EVOLUÇÃO</Text>
            <Text style={styles.titulo}>
              {nome ? `Olá, ${nome}` : 'O teu trabalho'}
            </Text>
            <Text style={styles.subt}>
              Estás em <Text style={{ color: corNivel }}>{nivel!.nome}</Text> · {ultimo.hz} Hz
            </Text>
          </FadeIn>

          <FadeIn delay={200}>
            <View style={styles.heroCard}>
              <LinearGradient
                colors={[corNivel + '33', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.heroLabel}>FOCO ACTUAL</Text>
              <Text style={styles.heroFoco}>
                Soltar o que ainda te prende em {nivel!.nome.toLowerCase()}.
              </Text>
              <Text style={styles.heroDesc}>
                Anos de trabalho comprimidos em ciclos curtos e profundos.{'\n'}A elevação não
                é um destino — é o resultado de soltar.
              </Text>
            </View>
          </FadeIn>

          <FadeIn delay={350}>
            <Card
              icon="🜂"
              tag="LIBERTAÇÃO EMOCIONAL"
              titulo="Soltar uma dependência"
              desc="Um flow guiado em 5 passos para libertar um apego, ressentimento, ou ligação que pesa. Baseado na técnica de Hawkins + EFT."
              cta={`${libs.length} libertações feitas`}
              cor={cores.accent}
              onPress={() => router.push('/libertacao')}
            />
          </FadeIn>

          <FadeIn delay={450}>
            <Card
              icon="🜃"
              tag="TRABALHO DE SOMBRA"
              titulo={`A sombra de "${arquetipo!.nome}"`}
              desc="A parte de ti que rejeitas é a chave da próxima elevação. Olha-a sem combater."
              cta="Integrar"
              cor={cores.gold}
              onPress={() => router.push('/sombra')}
            />
          </FadeIn>

          <FadeIn delay={550}>
            <Card
              icon={chakra!.emoji}
              tag="ENERGIA"
              titulo={`Chakra ${chakra!.nome} activo`}
              desc={chakra!.bloqueio}
              cta="Práticas + respiração"
              cor={chakra!.cor}
              onPress={() => router.push('/energia')}
            />
          </FadeIn>

          <FadeIn delay={650}>
            <Card
              icon="◐"
              tag="PROTOCOLO 21 DIAS"
              titulo={
                diaActual
                  ? `Dia ${diaActual} de 21`
                  : 'Iniciar o protocolo de elevação'
              }
              desc={
                diaActual
                  ? `${diasFeitos.length}/21 práticas concluídas. Continua o caminho.`
                  : 'Um percurso diário guiado para comprimir transformação real em 3 semanas.'
              }
              cta={diaActual ? 'Continuar' : 'Começar agora'}
              cor={cores.accentSoft}
              onPress={() => router.push('/protocolo')}
            />
          </FadeIn>

          <FadeIn delay={750}>
            <Card
              icon="✧"
              tag="GUIA COMPLETO"
              titulo="O teu Guia de Elevação"
              desc="6 secções: diagnóstico, padrões, crença central, práticas, afirmações, ponte para o próximo nível."
              cta="Abrir guia"
              cor={cores.goldLight}
              onPress={() =>
                router.push({ pathname: '/guia', params: { hz: String(nivel!.hz) } })
              }
            />
          </FadeIn>

          <FadeIn delay={850}>
            <Card
              icon="◯"
              tag="TRACKER"
              titulo="A tua evolução vibracional"
              desc="Gráfico, tendência, histórico dos últimos 12 meses."
              cta="Ver progresso"
              cor={cores.muted}
              onPress={() => router.push('/tracker')}
            />
          </FadeIn>
        </ScrollView>
        <BottomNav active="eu" />
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Card({
  icon,
  tag,
  titulo,
  desc,
  cta,
  cor,
  onPress,
}: {
  icon: string;
  tag: string;
  titulo: string;
  desc: string;
  cta: string;
  cor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.cardRow}>
        <View style={[styles.iconBox, { borderColor: cor + '66' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.tag, { color: cor }]}>{tag}</Text>
          <Text style={styles.cardTitulo}>{titulo}</Text>
        </View>
      </View>
      <Text style={styles.cardDesc}>{desc}</Text>
      <View style={styles.ctaRow}>
        <Text style={[styles.cta, { color: cor }]}>{cta} →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 3,
  },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 36,
    marginTop: 4,
  },
  subt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    marginTop: 4,
  },
  heroCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    overflow: 'hidden',
  },
  heroLabel: {
    fontFamily: fontes.mono,
    color: cores.gold,
    fontSize: 10,
    letterSpacing: 3,
  },
  heroFoco: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    marginTop: 6,
    lineHeight: 30,
  },
  heroDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },
  card: {
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22 },
  tag: {
    fontFamily: fontes.mono,
    fontSize: 10,
    letterSpacing: 2,
  },
  cardTitulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 20,
    marginTop: 2,
  },
  cardDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  ctaRow: { marginTop: 10 },
  cta: {
    fontFamily: fontes.corpoMedium,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  empty: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyEmoji: { color: cores.accentSoft, fontSize: 48 },
  emptyTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 32,
    textAlign: 'center',
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
});
