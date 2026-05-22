import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import { cores, fontes } from '@/constants/colors';

export default function Privacidade() {
  const router = useRouter();
  return (
    <CosmicBackground particles={30}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>← voltar</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.label}>POLÍTICA DE PRIVACIDADE</Text>
            <Text style={styles.titulo}>Os teus dados{'\n'}são teus.</Text>
            <Text style={styles.actualizado}>Actualizado: Maio 2026</Text>
          </FadeIn>

          <FadeIn delay={200}>
            <Seccao titulo="O que guardamos">
              <Bullet>
                <Bold>Por defeito, nada sai do teu dispositivo.</Bold> Resultados do teste,
                práticas, libertações e progresso ficam no armazenamento local do teu
                navegador.
              </Bullet>
              <Bullet>
                <Bold>Se criares conta</Bold> (opcional), os mesmos dados sincronizam-se com
                a nossa base de dados Supabase para os poderes acompanhar entre
                dispositivos.
              </Bullet>
              <Bullet>
                Guardamos: nome (o que escolheres usar), email, respostas do teste,
                libertações e progresso do protocolo 21 dias.
              </Bullet>
            </Seccao>
          </FadeIn>

          <FadeIn delay={300}>
            <Seccao titulo="O que NÃO fazemos">
              <Bullet>Não vendemos dados a terceiros.</Bullet>
              <Bullet>Não usamos rastreio publicitário, pixéis ou cookies de terceiros.</Bullet>
              <Bullet>Não partilhamos respostas individuais com ninguém.</Bullet>
              <Bullet>Não enviamos email promocional sem consentimento explícito.</Bullet>
            </Seccao>
          </FadeIn>

          <FadeIn delay={400}>
            <Seccao titulo="Os teus direitos (RGPD)">
              <Bullet>
                Podes pedir acesso, correcção ou eliminação dos teus dados a qualquer
                momento via{' '}
                <Text style={styles.link}>michellerodriguesudi@gmail.com</Text>.
              </Bullet>
              <Bullet>
                Podes apagar a conta directamente no ecrã "Conta" — isto remove todos os
                teus dados da nossa base.
              </Bullet>
              <Bullet>
                Tens direito a portabilidade: podemos exportar todo o teu histórico em
                JSON.
              </Bullet>
            </Seccao>
          </FadeIn>

          <FadeIn delay={500}>
            <Seccao titulo="Importante">
              <Bullet>
                A VION não substitui acompanhamento psicológico, médico ou psiquiátrico.
                Se atravessas crise emocional grave, procura ajuda profissional. SOS Voz
                Amiga: <Text style={styles.link}>213 544 545</Text>.
              </Bullet>
              <Bullet>
                Os conteúdos baseiam-se na escala de David R. Hawkins e são oferecidos
                para reflexão pessoal — não como diagnóstico clínico.
              </Bullet>
            </Seccao>
          </FadeIn>

          <FadeIn delay={600}>
            <Text style={styles.assinatura}>
              Responsável pelo tratamento{'\n'}
              <Text style={{ color: cores.text }}>Espaço Provável Lda · Portugal</Text>
            </Text>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Seccao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.seccao}>
      <Text style={styles.seccaoTit}>{titulo}</Text>
      <View>{children}</View>
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>✦</Text>
      <Text style={styles.bulletTxt}>{children}</Text>
    </View>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: cores.text, fontFamily: fontes.corpoMedium }}>{children}</Text>;
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8 },
  back: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 64 },
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
    marginTop: 6,
    lineHeight: 44,
  },
  actualizado: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 8,
  },
  seccao: { marginTop: 32 },
  seccaoTit: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    marginBottom: 14,
  },
  bullet: { flexDirection: 'row', marginBottom: 12 },
  bulletDot: {
    color: cores.accentSoft,
    fontSize: 12,
    width: 18,
    marginTop: 4,
  },
  bulletTxt: {
    flex: 1,
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    lineHeight: 22,
  },
  link: { color: cores.accentSoft },
  assinatura: {
    marginTop: 40,
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
});
