import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import FadeIn from '@/components/FadeIn';
import { useSession } from '@/hooks/useSession';
import { isAdmin } from '@/lib/admin';
import { cores, fontes } from '@/constants/colors';

export default function AdminHome() {
  const router = useRouter();
  const { user, loading } = useSession();
  const admin = isAdmin(user?.email);

  if (loading) {
    return <CosmicBackground particles={20} />;
  }

  if (!admin) {
    return (
      <CosmicBackground particles={30}>
        <SafeAreaView style={styles.safeCenter}>
          <Text style={styles.lockGlyph}>🔒</Text>
          <Text style={styles.lockTit}>Acesso restrito</Text>
          <Text style={styles.lockDesc}>
            Este painel é só para a administradora. Entra com a tua conta de administradora
            para gerir o conteúdo.
          </Text>
          <Pressable onPress={() => router.replace('/')} style={styles.lockBtn}>
            <Text style={styles.lockBtnTxt}>Voltar ao início</Text>
          </Pressable>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground particles={30}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Administração</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <Text style={styles.intro}>
              Edita o conteúdo da app. As mudanças aparecem para todos os utilizadores assim
              que guardas.
            </Text>
          </FadeIn>

          <FadeIn delay={150}>
            <Card
              ativo
              titulo="Textos das páginas"
              desc="Título, frases e descrições da app"
              onPress={() => router.push('/admin/textos')}
            />
          </FadeIn>

          <FadeIn delay={250}>
            <Card titulo="Perguntas do teste" desc="Em breve — a preparar com cuidado" />
            <Card titulo="Níveis de consciência" desc="Em breve" />
            <Card titulo="Guias e práticas" desc="Em breve" />
          </FadeIn>

          <FadeIn delay={400}>
            <Text style={styles.nota}>
              Estás a editar como administradora. Mudanças aos textos são imediatas e
              reversíveis (há um botão "repor original" em cada campo).
            </Text>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Card({
  titulo,
  desc,
  onPress,
  ativo,
}: {
  titulo: string;
  desc: string;
  onPress?: () => void;
  ativo?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!ativo}
      style={({ pressed }) => [
        styles.card,
        ativo && styles.cardAtivo,
        pressed && ativo && { opacity: 0.85 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTit, !ativo && { color: cores.muted }]}>{titulo}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
      {ativo ? <Text style={styles.cardSeta}>→</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  lockGlyph: { fontSize: 44, marginBottom: 12 },
  lockTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 30, textAlign: 'center' },
  lockDesc: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  lockBtn: {
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.accent,
  },
  lockBtnTxt: { fontFamily: fontes.corpoMedium, color: cores.accent, fontSize: 14 },
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
  content: { paddingHorizontal: 24, paddingBottom: 60 },
  intro: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 10,
  },
  cardAtivo: { borderColor: cores.accent + '88' },
  cardTit: { fontFamily: fontes.corpoMedium, color: cores.text, fontSize: 15 },
  cardDesc: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 12, marginTop: 2 },
  cardSeta: { color: cores.accent, fontSize: 20 },
  nota: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 24,
    fontStyle: 'italic',
  },
});
