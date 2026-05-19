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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { Auth } from '@/lib/auth';
import { cores, fontes } from '@/constants/colors';

export default function Recuperar() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const [aProcessar, setAProcessar] = useState(false);

  const enviar = async () => {
    setErro(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro('Email inválido.');
      return;
    }
    setAProcessar(true);
    const r = await Auth.recuperar(email);
    setAProcessar(false);
    if (!r.ok) {
      setErro(r.erro ?? 'Não foi possível enviar.');
      return;
    }
    setEnviado(true);
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
          <ScrollView contentContainerStyle={styles.content}>
            {!enviado ? (
              <>
                <FadeIn>
                  <Text style={styles.label}>RECUPERAR ACESSO</Text>
                  <Text style={styles.titulo}>Sem stress.</Text>
                  <Text style={styles.subt}>
                    Diz-me o email da tua conta — envio-te um link para definires nova
                    palavra-passe.
                  </Text>
                </FadeIn>

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
                      returnKeyType="send"
                      onSubmitEditing={enviar}
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
                      label={aProcessar ? 'A enviar…' : 'Enviar link'}
                      onPress={enviar}
                      disabled={aProcessar}
                    />
                  </View>
                </FadeIn>
              </>
            ) : (
              <FadeIn>
                <View style={{ marginTop: 60, alignItems: 'center' }}>
                  <Text style={styles.bigEmoji}>✉</Text>
                  <Text style={styles.titulo}>Verifica o teu email</Text>
                  <Text style={styles.subt}>
                    Enviámos um link para <Text style={{ color: cores.text }}>{email}</Text>.
                    Pode demorar 1-2 minutos.
                  </Text>
                  <View style={{ height: 28 }} />
                  <GradientButton label="Voltar" onPress={() => router.replace('/auth/login')} />
                </View>
              </FadeIn>
            )}
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
  titulo: { fontFamily: fontes.titulo, color: cores.text, fontSize: 42, marginTop: 6, lineHeight: 48 },
  subt: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  campo: { marginTop: 22 },
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
  bigEmoji: { fontSize: 56, color: cores.accentSoft },
});
