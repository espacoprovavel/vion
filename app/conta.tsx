import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { useSession } from '@/hooks/useSession';
import { Auth } from '@/lib/auth';
import { Storage, type TestEntry, type Libertacao } from '@/lib/storage';
import { isAdmin } from '@/lib/admin';
import { cores, fontes } from '@/constants/colors';

export default function Conta() {
  const router = useRouter();
  const { user, autenticado, nome: nomeSessao } = useSession();
  const [hist, setHist] = useState<TestEntry[]>([]);
  const [libs, setLibs] = useState<Libertacao[]>([]);
  const [nomeLocal, setNomeLocal] = useState<string>('');

  useEffect(() => {
    Storage.getHistorico().then(setHist);
    Storage.getLibertacoes().then(setLibs);
    Storage.getNome().then((n) => setNomeLocal(n ?? ''));
  }, []);

  const sair = () => {
    Alert.alert('Sair da conta?', 'Os teus dados continuam guardados na nuvem.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await Auth.sair();
          router.replace('/');
        },
      },
    ]);
  };

  const limparLocal = () => {
    Alert.alert(
      'Apagar dados locais?',
      'Perdes histórico, libertações e protocolo neste dispositivo. Não afecta a nuvem.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await Storage.clearAll();
            router.replace('/');
          },
        },
      ],
    );
  };

  const nome = nomeSessao ?? nomeLocal ?? 'sem nome';
  const email = user?.email ?? null;

  return (
    <CosmicBackground particles={40}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Conta</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <FadeIn>
            <View style={styles.heroBox}>
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>
                  {(nome || 'V')[0].toUpperCase()}
                </Text>
              </View>
              <Text style={styles.nome}>{nome || 'Anónimo'}</Text>
              {email ? (
                <Text style={styles.email}>{email}</Text>
              ) : (
                <Text style={styles.email}>Modo anónimo · sem conta</Text>
              )}
            </View>
          </FadeIn>

          <FadeIn delay={200}>
            <View style={styles.stats}>
              <Stat valor={String(hist.length)} label="Testes" />
              <Div />
              <Stat valor={String(libs.length)} label="Libertações" />
              <Div />
              <Stat
                valor={hist[hist.length - 1] ? `${hist[hist.length - 1].hz}` : '—'}
                label="Hz actual"
              />
            </View>
          </FadeIn>

          {!autenticado ? (
            <FadeIn delay={350}>
              <View style={styles.ctaBox}>
                <Text style={styles.ctaTit}>Cria conta para guardar o teu caminho</Text>
                <Text style={styles.ctaDesc}>
                  Sem conta, os teus dados ficam apenas neste dispositivo. Com conta, podes
                  retomar em qualquer telemóvel.
                </Text>
                <View style={{ height: 16 }} />
                <GradientButton
                  label="Criar conta"
                  variant="gold"
                  onPress={() => router.push('/auth/signup')}
                />
                <View style={{ height: 10 }} />
                <GradientButton
                  label="Já tenho conta · Entrar"
                  variant="secondary"
                  onPress={() => router.push('/auth/login')}
                />
              </View>
            </FadeIn>
          ) : (
            <FadeIn delay={350}>
              <View style={styles.linhaBox}>
                <Linha label="Email" valor={email ?? '—'} />
                <Linha label="ID" valor={user!.id.slice(0, 8) + '…'} />
                <Linha
                  label="Conta criada em"
                  valor={user!.created_at ? new Date(user!.created_at).toLocaleDateString('pt-PT') : '—'}
                />
              </View>
            </FadeIn>
          )}

          <FadeIn delay={500}>
            <View style={{ marginTop: 28, gap: 10 }}>
              <Botao
                titulo="Tracker vibracional"
                desc="Histórico e tendência"
                onPress={() => router.push('/tracker')}
              />
              <Botao
                titulo="Refazer mapeamento"
                desc="Nova leitura do campo"
                onPress={() => router.push('/teste')}
              />
              {isAdmin(email) && (
                <Botao
                  titulo="Painel de administração"
                  desc="Editar o conteúdo da app"
                  onPress={() => router.push('/admin')}
                />
              )}
              <Botao
                titulo="Apagar dados locais"
                desc="Limpa este dispositivo"
                vermelho
                onPress={limparLocal}
              />
              {autenticado && (
                <Botao titulo="Sair da conta" desc="Logout" vermelho onPress={sair} />
              )}
            </View>
          </FadeIn>

          <FadeIn delay={650}>
            <Text style={styles.legal}>
              VION · Para reflexão pessoal · Não substitui apoio clínico.
            </Text>
          </FadeIn>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Div() {
  return <View style={styles.div} />;
}

function Linha({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.linha}>
      <Text style={styles.linhaLabel}>{label}</Text>
      <Text style={styles.linhaValor}>{valor}</Text>
    </View>
  );
}

function Botao({
  titulo,
  desc,
  onPress,
  vermelho,
}: {
  titulo: string;
  desc: string;
  onPress: () => void;
  vermelho?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        pressed && { opacity: 0.85 },
        vermelho && { borderColor: cores.red + '55' },
      ]}
    >
      <View>
        <Text style={[styles.botaoTit, vermelho && { color: cores.red }]}>{titulo}</Text>
        <Text style={styles.botaoDesc}>{desc}</Text>
      </View>
      <Text style={[styles.botaoSeta, vermelho && { color: cores.red }]}>→</Text>
    </Pressable>
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
  content: { paddingHorizontal: 24, paddingBottom: 60 },
  heroBox: { alignItems: 'center', marginTop: 16 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: cores.accent + '88',
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontFamily: fontes.titulo,
    color: cores.accentSoft,
    fontSize: 40,
  },
  nome: { fontFamily: fontes.titulo, color: cores.text, fontSize: 28, marginTop: 12 },
  email: { fontFamily: fontes.mono, color: cores.muted, fontSize: 12, marginTop: 4, letterSpacing: 0.5 },
  stats: {
    flexDirection: 'row',
    backgroundColor: cores.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.border,
    padding: 14,
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValor: { fontFamily: fontes.monoMedium, color: cores.text, fontSize: 22 },
  statLabel: { fontFamily: fontes.mono, color: cores.muted, fontSize: 9, letterSpacing: 1.5, marginTop: 4 },
  div: { width: 1, height: 32, backgroundColor: cores.border },
  ctaBox: {
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.gold + '55',
  },
  ctaTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 22, lineHeight: 28 },
  ctaDesc: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  linhaBox: {
    marginTop: 24,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.faint,
  },
  linhaLabel: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13 },
  linhaValor: { fontFamily: fontes.mono, color: cores.text, fontSize: 12, letterSpacing: 0.5 },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  botaoTit: { fontFamily: fontes.corpoMedium, color: cores.text, fontSize: 15 },
  botaoDesc: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 12, marginTop: 2 },
  botaoSeta: { color: cores.muted, fontSize: 20 },
  legal: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
  },
});
