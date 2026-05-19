import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { getNivelMaisProximo, getNivelAcima } from '@/constants/niveis';
import { getGuia } from '@/constants/guias';
import { cores, fontes } from '@/constants/colors';
import { Storage } from '@/lib/storage';
import { comprarGuia, restaurarCompras } from '@/lib/payments';

export default function Guia() {
  const router = useRouter();
  const { hz: hzParam } = useLocalSearchParams<{ hz: string }>();
  const hz = parseInt(hzParam ?? '200', 10);
  const nivel = getNivelMaisProximo(hz);
  const proximo = getNivelAcima(nivel.hz);
  const guia = getGuia(nivel.hz);

  const [nome, setNome] = useState('tu');
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [aComprar, setAComprar] = useState(false);

  useEffect(() => {
    Storage.getNome().then((n) => setNome(n ?? 'tu'));
    Storage.getGuiaUnlocked().then(setUnlocked);
  }, []);

  const handleComprar = async () => {
    setAComprar(true);
    const ok = await comprarGuia();
    setAComprar(false);
    if (ok) setUnlocked(true);
  };

  const handleRestaurar = async () => {
    setAComprar(true);
    const ok = await restaurarCompras();
    setAComprar(false);
    if (ok) setUnlocked(true);
  };

  if (unlocked === null) {
    return (
      <CosmicBackground>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={cores.accent} />
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  if (!unlocked) {
    return (
      <CosmicBackground particles={60} glow={nivel.cor}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Text style={styles.back}>← voltar</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.lockWrap}>
            <FadeIn>
              <Text style={styles.lockEmoji}>🔒</Text>
              <Text style={styles.lockTit}>Guia de Elevação</Text>
              <Text style={styles.lockNivel}>
                {nivel.emoji} {nivel.nome} · {nivel.hz} Hz
              </Text>
            </FadeIn>
            <FadeIn delay={300}>
              <View style={styles.bullets}>
                {[
                  'Diagnóstico profundo do teu nível actual',
                  '3 padrões inconscientes que te mantêm aqui',
                  'A crença limitante central a soltar',
                  '5 práticas diárias específicas',
                  '7 afirmações vibracionais personalizadas',
                  'Ponte para o próximo nível',
                ].map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>✦</Text>
                    <Text style={styles.bulletTexto}>{b}</Text>
                  </View>
                ))}
              </View>
            </FadeIn>
            <FadeIn delay={600}>
              <View style={{ marginTop: 32 }}>
                <GradientButton
                  label={aComprar ? 'A processar…' : 'Desbloquear por €4,99'}
                  variant="gold"
                  onPress={handleComprar}
                  disabled={aComprar}
                />
                <Pressable onPress={handleRestaurar} style={{ marginTop: 14 }}>
                  <Text style={styles.restaurar}>Restaurar compra</Text>
                </Pressable>
              </View>
            </FadeIn>
          </ScrollView>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground particles={40} glow={nivel.cor}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>← voltar</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>GUIA DE ELEVAÇÃO</Text>
            <Text style={styles.titulo}>
              {nivel.emoji} {nivel.nome}
            </Text>
            <Text style={styles.subt}>
              {nivel.hz} Hz · personalizado para {nome}
            </Text>
          </FadeIn>

          <Seccao label="A" titulo="Diagnóstico profundo" delay={200}>
            <Text style={styles.paragrafo}>{guia.diagnostico}</Text>
          </Seccao>

          <Seccao label="B" titulo="3 padrões inconscientes" delay={350}>
            {guia.padroes.map((p, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={styles.itemNum}>{i + 1}</Text>
                <Text style={styles.itemTexto}>{p}</Text>
              </View>
            ))}
          </Seccao>

          <Seccao label="C" titulo="Crença limitante central" delay={500}>
            <Text style={styles.crenca}>"{guia.crencaLimitante}"</Text>
            <Text style={styles.paragrafo}>
              Reconhece esta crença sempre que se manifestar. Não a combatas — observa-a. A
              consciência dissolve o que a inconsciência sustenta.
            </Text>
          </Seccao>

          <Seccao label="D" titulo="5 práticas diárias" delay={650}>
            {guia.praticas.map((p, i) => (
              <View key={i} style={styles.itemRow}>
                <Text style={styles.itemNum}>{i + 1}</Text>
                <Text style={styles.itemTexto}>{p}</Text>
              </View>
            ))}
          </Seccao>

          <Seccao label="E" titulo="7 afirmações vibracionais" delay={800}>
            {guia.afirmacoes.map((a, i) => (
              <Text key={i} style={styles.afirmacao}>
                ✦ {a}
              </Text>
            ))}
          </Seccao>

          <Seccao
            label="F"
            titulo={proximo ? `O próximo nível — ${proximo.nome}` : 'Permanência'}
            delay={950}
          >
            <Text style={styles.paragrafo}>{guia.ponteProxNivel}</Text>
            {proximo && (
              <Text style={styles.paragrafo}>
                Quando subires para {proximo.hz} Hz, o que muda: relacionas-te com a tua experiência
                a partir de {proximo.nome.toLowerCase()} — {proximo.desc.toLowerCase()}
              </Text>
            )}
          </Seccao>

          <View style={{ marginTop: 32 }}>
            <GradientButton
              label="Praticar agora"
              onPress={() => router.push('/praticas')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Seccao({
  label,
  titulo,
  delay,
  children,
}: {
  label: string;
  titulo: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <FadeIn delay={delay}>
      <View style={styles.seccao}>
        <View style={styles.seccaoCab}>
          <Text style={styles.seccaoLabel}>{label}</Text>
          <Text style={styles.seccaoTit}>{titulo}</Text>
        </View>
        <View style={styles.seccaoBody}>{children}</View>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8 },
  back: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
  },
  lockWrap: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    flexGrow: 1,
    justifyContent: 'center',
  },
  lockEmoji: { fontSize: 48, textAlign: 'center' },
  lockTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 40,
    textAlign: 'center',
    marginTop: 12,
  },
  lockNivel: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  bullets: { marginTop: 32 },
  bullet: { flexDirection: 'row', marginBottom: 14 },
  bulletDot: { color: cores.gold, fontSize: 16, marginRight: 12, marginTop: 2 },
  bulletTexto: {
    flex: 1,
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 22,
  },
  restaurar: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
  },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 64 },
  label: {
    fontFamily: fontes.mono,
    color: cores.gold,
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
  seccao: { marginTop: 28 },
  seccaoCab: { flexDirection: 'row', alignItems: 'baseline' },
  seccaoLabel: {
    fontFamily: fontes.mono,
    color: cores.gold,
    fontSize: 18,
    marginRight: 10,
  },
  seccaoTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    flex: 1,
  },
  seccaoBody: {
    marginTop: 10,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 16,
  },
  paragrafo: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.92,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 6,
  },
  itemRow: { flexDirection: 'row', marginBottom: 10 },
  itemNum: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 14,
    width: 22,
  },
  itemTexto: {
    flex: 1,
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 14,
    lineHeight: 22,
  },
  crenca: {
    fontFamily: fontes.titulo,
    color: cores.accentSoft,
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  afirmacao: {
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 4,
  },
});
