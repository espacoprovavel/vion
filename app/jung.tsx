import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import CartaTarot from '@/components/CartaTarot';
import FadeIn from '@/components/FadeIn';
import { ARQUETIPOS_12, FUNDAMENTAIS_4, type CartaJung } from '@/constants/jung';
import { cores, fontes } from '@/constants/colors';

export default function Jung() {
  const router = useRouter();
  const [sel, setSel] = useState<CartaJung | null>(null);

  return (
    <CosmicBackground particles={26}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Arquétipos</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <FadeIn>
            <Text style={styles.titulo}>O Mapa da Alma</Text>
            <Text style={styles.sub}>
              Os arquétipos de Jung em diálogo com os Arcanos Maiores do Tarot. Cada carta é uma
              face do inconsciente. Toca para abrir.
            </Text>
          </FadeIn>

          <FadeIn delay={150}>
            <Text style={styles.secao}>OS 12 ARQUÉTIPOS</Text>
          </FadeIn>
          <View style={styles.grelha}>
            {ARQUETIPOS_12.map((c, i) => (
              <FadeIn key={c.id} delay={200 + i * 40}>
                <CartaTarot carta={c} largura={148} onPress={() => setSel(c)} />
              </FadeIn>
            ))}
          </View>

          <FadeIn delay={300}>
            <Text style={styles.secao}>OS 4 FUNDAMENTAIS</Text>
            <Text style={styles.secaoDesc}>
              A estrutura profunda da psique segundo Jung — o caminho da individuação.
            </Text>
          </FadeIn>
          <View style={styles.grelha}>
            {FUNDAMENTAIS_4.map((c, i) => (
              <FadeIn key={c.id} delay={350 + i * 40}>
                <CartaTarot carta={c} largura={148} onPress={() => setSel(c)} />
              </FadeIn>
            ))}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!sel} animationType="slide" transparent onRequestClose={() => setSel(null)}>
        {sel && <Detalhe carta={sel} onFechar={() => setSel(null)} />}
      </Modal>
    </CosmicBackground>
  );
}

function Detalhe({ carta, onFechar }: { carta: CartaJung; onFechar: () => void }) {
  return (
    <View style={styles.modalRoot}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalHeader}>
          <View style={{ width: 60 }} />
          <Text style={[styles.modalArcano, { color: carta.cor }]}>
            {carta.numeral} · {carta.arcano}
          </Text>
          <Pressable onPress={onFechar} hitSlop={12} style={{ width: 60, alignItems: 'flex-end' }}>
            <Text style={styles.fechar}>fechar</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.cartaCentro}>
            <CartaTarot carta={carta} largura={170} />
          </View>

          <Text style={styles.detNome}>{carta.nome}</Text>

          <Bloco cor={carta.cor} titulo="Essência">{carta.essencia}</Bloco>
          <Bloco cor={carta.cor} titulo="Na luz">{carta.luz}</Bloco>
          <Bloco cor={carta.cor} titulo="Na sombra">{carta.sombra}</Bloco>
          <Bloco cor={carta.cor} titulo="O inconsciente por baixo">{carta.inconsciente}</Bloco>
          <Bloco cor={carta.cor} titulo="O dom">{carta.dom}</Bloco>
          <Bloco cor={carta.cor} titulo="O desafio">{carta.desafio}</Bloco>
          <Bloco cor={carta.cor} titulo="O caminho de integração">{carta.integracao}</Bloco>

          <View style={[styles.perguntaBox, { borderColor: carta.cor + '44' }]}>
            <Text style={styles.perguntaLabel}>PERGUNTA PARA HABITAR</Text>
            <Text style={styles.pergunta}>{carta.pergunta}</Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Bloco({ titulo, children, cor }: { titulo: string; children: React.ReactNode; cor: string }) {
  return (
    <View style={styles.bloco}>
      <Text style={[styles.blocoTit, { color: cor }]}>{titulo}</Text>
      <Text style={styles.blocoTxt}>{children}</Text>
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
  headerTitulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  titulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 34, marginTop: 8 },
  sub: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  secao: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 12,
    letterSpacing: 2.5,
    marginTop: 32,
    marginBottom: 4,
  },
  secaoDesc: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, marginBottom: 12 },
  grelha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 14,
  },
  modalRoot: { flex: 1, backgroundColor: cores.bg },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.faint,
  },
  modalArcano: { fontFamily: fontes.mono, fontSize: 12, letterSpacing: 1.5 },
  fechar: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14 },
  modalContent: { paddingHorizontal: 24, paddingTop: 20 },
  cartaCentro: { alignItems: 'center', marginBottom: 8 },
  detNome: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 34,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  bloco: { marginTop: 18 },
  blocoTit: {
    fontFamily: fontes.monoMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  blocoTxt: { fontFamily: fontes.corpo, color: cores.text, fontSize: 15, lineHeight: 24, opacity: 0.92 },
  perguntaBox: {
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    backgroundColor: cores.surface,
  },
  perguntaLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  pergunta: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    fontStyle: 'italic',
    lineHeight: 30,
  },
});
