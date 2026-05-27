import React, { useMemo, useState } from 'react';
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
import FadeIn from '@/components/FadeIn';
import { useSession } from '@/hooks/useSession';
import { isAdmin } from '@/lib/admin';
import {
  TEXTOS,
  type CampoTexto,
  tConteudo,
  guardarConteudo,
  reporConteudo,
} from '@/lib/conteudo';
import { cores, fontes } from '@/constants/colors';

export default function AdminTextos() {
  const router = useRouter();
  const { user, loading } = useSession();
  const admin = isAdmin(user?.email);

  const grupos = useMemo(() => {
    const map = new Map<string, CampoTexto[]>();
    for (const campo of TEXTOS) {
      if (!map.has(campo.grupo)) map.set(campo.grupo, []);
      map.get(campo.grupo)!.push(campo);
    }
    return Array.from(map.entries());
  }, []);

  if (loading) return <CosmicBackground particles={20} />;

  if (!admin) {
    return (
      <CosmicBackground particles={30}>
        <SafeAreaView style={styles.safeCenter}>
          <Text style={styles.lockTit}>Acesso restrito</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.lockBtn}>
            <Text style={styles.lockBtnTxt}>Voltar</Text>
          </Pressable>
        </SafeAreaView>
      </CosmicBackground>
    );
  }

  return (
    <CosmicBackground particles={24}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>←</Text>
          </Pressable>
          <Text style={styles.headerTitulo}>Textos</Text>
          <View style={{ width: 24 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {grupos.map(([grupo, campos], gi) => (
              <FadeIn key={grupo} delay={gi * 120}>
                <Text style={styles.grupoTit}>{grupo}</Text>
                {campos.map((campo) => (
                  <Campo key={campo.chave} campo={campo} />
                ))}
              </FadeIn>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Campo({ campo }: { campo: CampoTexto }) {
  const [valor, setValor] = useState(tConteudo(campo.chave));
  const [estado, setEstado] = useState<'idle' | 'a-guardar' | 'guardado' | 'erro'>('idle');
  const [erro, setErro] = useState<string | null>(null);

  const alterado = valor !== tConteudo(campo.chave);

  const guardar = async () => {
    setEstado('a-guardar');
    setErro(null);
    const r = await guardarConteudo(campo.chave, valor);
    if (r.ok) {
      setEstado('guardado');
      setTimeout(() => setEstado('idle'), 1800);
    } else {
      setEstado('erro');
      setErro(r.erro ?? 'Não consegui guardar.');
    }
  };

  const repor = async () => {
    await reporConteudo(campo.chave);
    setValor(tConteudo(campo.chave));
    setEstado('idle');
  };

  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{campo.label}</Text>
      <TextInput
        value={valor}
        onChangeText={(t) => {
          setValor(t);
          if (estado !== 'idle') setEstado('idle');
        }}
        multiline={campo.multiline}
        style={[styles.input, campo.multiline && styles.inputMulti]}
        placeholderTextColor={cores.muted}
      />
      <View style={styles.acoes}>
        <Pressable
          onPress={guardar}
          disabled={!alterado || estado === 'a-guardar'}
          style={[styles.btn, (!alterado || estado === 'a-guardar') && { opacity: 0.4 }]}
        >
          <Text style={styles.btnTxt}>
            {estado === 'a-guardar' ? 'A guardar…' : estado === 'guardado' ? '✓ Guardado' : 'Guardar'}
          </Text>
        </Pressable>
        <Pressable onPress={repor} hitSlop={8}>
          <Text style={styles.repor}>repor original</Text>
        </Pressable>
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  lockTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 28 },
  lockBtn: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: cores.accent },
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
  content: { paddingHorizontal: 24, paddingTop: 8 },
  grupoTit: {
    fontFamily: fontes.mono,
    color: cores.accentSoft,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 12,
  },
  campo: {
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  campoLabel: {
    fontFamily: fontes.corpoMedium,
    color: cores.text,
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: cores.bg,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: cores.text,
    fontFamily: fontes.corpo,
    fontSize: 15,
  },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btn: {
    backgroundColor: cores.accent,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  btnTxt: { fontFamily: fontes.corpoMedium, color: '#fff', fontSize: 13 },
  repor: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 12, textDecorationLine: 'underline' },
  erro: { fontFamily: fontes.corpo, color: cores.red, fontSize: 12, marginTop: 8 },
});
