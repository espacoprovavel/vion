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
import { cores, fontes } from '@/constants/colors';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [aProcessar, setAProcessar] = useState(false);

  const entrar = async () => {
    setErro(null);
    if (!email.trim() || password.length < 6) {
      setErro('Preenche email e palavra-passe (mínimo 6 caracteres).');
      return;
    }
    setAProcessar(true);
    const r = await Auth.entrar(email, password);
    setAProcessar(false);
    if (!r.ok) {
      setErro(r.erro ?? 'Não foi possível entrar.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace('/evolucao');
  };

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
              <Text style={styles.label}>ENTRAR</Text>
              <Text style={styles.titulo}>Bem-vindo{'\n'}de volta.</Text>
              <Text style={styles.subt}>
                Continua o teu caminho de elevação onde paraste.
              </Text>
            </FadeIn>

            {!Auth.enabled && (
              <FadeIn delay={200}>
                <View style={styles.aviso}>
                  <Text style={styles.avisoTxt}>
                    Auth ainda não está ligada. Preenche as variáveis EXPO_PUBLIC_SUPABASE_URL
                    e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env para activar.
                  </Text>
                </View>
              </FadeIn>
            )}

            <FadeIn delay={300}>
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
                  placeholder="••••••••"
                  placeholderTextColor={cores.muted}
                  style={styles.input}
                  secureTextEntry
                  autoComplete="current-password"
                  returnKeyType="done"
                  onSubmitEditing={entrar}
                />
              </View>

              <Link href="/auth/recuperar" asChild>
                <Pressable hitSlop={8}>
                  <Text style={styles.link}>Esqueci-me da palavra-passe</Text>
                </Pressable>
              </Link>
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
                  label={aProcessar ? 'A entrar…' : 'Entrar'}
                  onPress={entrar}
                  disabled={aProcessar}
                />
                <View style={{ height: 12 }} />
                <Link href="/auth/signup" asChild>
                  <Pressable>
                    <Text style={styles.criarConta}>
                      Ainda sem conta? <Text style={{ color: cores.accentSoft }}>Criar conta</Text>
                    </Text>
                  </Pressable>
                </Link>
              </View>
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
  label: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 11,
    letterSpacing: 3,
  },
  titulo: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 44,
    marginTop: 6,
    lineHeight: 50,
  },
  subt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
  },
  campo: { marginTop: 22 },
  campoLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
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
  link: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    marginTop: 14,
    textAlign: 'right',
  },
  erro: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EF444411',
    borderWidth: 1,
    borderColor: cores.red + '55',
  },
  erroTxt: { fontFamily: fontes.corpo, color: cores.red, fontSize: 13, lineHeight: 19 },
  aviso: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.gold + '44',
  },
  avisoTxt: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 12,
    lineHeight: 19,
  },
  criarConta: {
    fontFamily: fontes.corpo,
    color: cores.muted,
    fontSize: 13,
    textAlign: 'center',
  },
});
