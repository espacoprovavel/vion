import React, { useState } from 'react';
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
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { Auth } from '@/lib/auth';
import { Storage } from '@/lib/storage';
import { cores, fontes } from '@/constants/colors';

export default function Signup() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [aProcessar, setAProcessar] = useState(false);

  const criar = async () => {
    setErro(null);
    if (nome.trim().length < 2) {
      setErro('Diz-me o teu nome.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro('Email inválido.');
      return;
    }
    if (password.length < 6) {
      setErro('Palavra-passe com pelo menos 6 caracteres.');
      return;
    }
    setAProcessar(true);
    const r = await Auth.criarConta(nome, email, password);
    setAProcessar(false);
    if (!r.ok) {
      setErro(r.erro ?? 'Não foi possível criar a conta.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    await Storage.setNome(nome.trim());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSucesso(true);
  };

  if (sucesso) {
    return (
      <CosmicBackground particles={70} glow={cores.gold}>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <FadeIn>
            <Text style={styles.bigEmoji}>✦</Text>
            <Text style={styles.sucessoTit}>Conta criada</Text>
            <Text style={styles.sucessoTxt}>
              Enviámos um email para <Text style={{ color: cores.text }}>{email}</Text>. Confirma
              para activares o acesso. Depois volta a entrar.
            </Text>
            <View style={{ height: 28 }} />
            <GradientButton label="Voltar ao login" onPress={() => router.replace('/auth/login')} />
          </FadeIn>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground particles={50}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <FadeIn>
              <Text style={styles.label}>CRIAR CONTA</Text>
              <Text style={styles.titulo}>Começa o teu{'\n'}caminho.</Text>
              <Text style={styles.subt}>
                Guarda o teu progresso e acede em qualquer dispositivo.
              </Text>
            </FadeIn>

            <FadeIn delay={300}>
              <View style={styles.campo}>
                <Text style={styles.campoLabel}>NOME</Text>
                <TextInput
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Como te chamas?"
                  placeholderTextColor={cores.muted}
                  style={styles.input}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.campoLabel}>EMAIL</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu@exemplo.com"
                  placeholderTextColor={cores.muted}
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.campoLabel}>PALAVRA-PASSE</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Pelo menos 6 caracteres"
                  placeholderTextColor={cores.muted}
                  style={styles.input}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={criar}
                />
              </View>
            </FadeIn>

            {erro && (
              <FadeIn>
                <View style={styles.erro}>
                  <Text style={styles.erroTxt}>{erro}</Text>
                </View>
              </FadeIn>
            )}

            <FadeIn delay={500}>
              <View style={{ marginTop: 28 }}>
                <GradientButton
                  label={aProcessar ? 'A criar conta…' : 'Criar conta'}
                  onPress={criar}
                  disabled={aProcessar}
                />
                <View style={{ height: 12 }} />
                <Link href="/auth/login" asChild>
                  <Pressable>
                    <Text style={styles.criarConta}>
                      Já tens conta? <Text style={{ color: cores.accentSoft }}>Entrar</Text>
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </FadeIn>

            <FadeIn delay={650}>
              <Text style={styles.legal}>
                Ao criar conta aceitas que os teus dados (email, nome, testes, progresso)
                fiquem guardados no Supabase. Para reflexão pessoal — não substitui apoio
                clínico.
              </Text>
            </FadeIn>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8 },
  back: { color: cores.muted, fontSize: 22 },
  content: { paddingHorizontal: 28, paddingTop: 8, paddingBottom: 60 },
  label: { fontFamily: fontes.mono, color: cores.accentSoft, fontSize: 11, letterSpacing: 3 },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 42,
    marginTop: 6,
    lineHeight: 48,
  },
  subt: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  campo: { marginTop: 18 },
  campoLabel: { fontFamily: fontes.mono, color: cores.muted, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
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
  erro: { marginTop: 16, padding: 12, borderRadius: 10, backgroundColor: '#EF444411', borderWidth: 1, borderColor: cores.red + '55' },
  erroTxt: { fontFamily: fontes.corpo, color: cores.red, fontSize: 13, lineHeight: 19 },
  criarConta: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, textAlign: 'center' },
  legal: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 11, lineHeight: 18, textAlign: 'center', marginTop: 22, paddingHorizontal: 12 },
  bigEmoji: { fontSize: 64, color: cores.gold, textAlign: 'center' },
  sucessoTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 36, textAlign: 'center', marginTop: 12 },
  sucessoTxt: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 12 },
});
