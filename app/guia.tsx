import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CosmicBackground from '@/components/CosmicBackground';
import GradientButton from '@/components/GradientButton';
import FadeIn from '@/components/FadeIn';
import { getNivelMaisProximo, getNivelAcima } from '@/constants/niveis';
import { gerarRelatorio, type Pratica } from '@/constants/relatorio';
import { cores, fontes } from '@/constants/colors';
import { Storage } from '@/lib/storage';
import { SITE_URL } from '@/lib/config';

/**
 * Relatório VION — formato leitura tipo e-book.
 *
 * Hoje livre (sem paywall). O envio do PDF por email e o pagamento real
 * via Stripe chegam no Sprint 3 (ver lib/payments.ts e api/checkout.ts
 * quando existirem).
 */
export default function Guia() {
  const router = useRouter();
  const { hz: hzParam } = useLocalSearchParams<{ hz: string }>();
  const hzInt = parseInt(hzParam ?? '200', 10);

  const [nome, setNome] = useState('tu');
  const [respostas, setRespostas] = useState<number[] | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [aEnviar, setAEnviar] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  useEffect(() => {
    Storage.getNome().then((n) => setNome(n ?? 'tu'));
    Storage.getHistorico().then(() => {
      setRespostas(undefined);
    });
  }, []);

  const enviarPdf = async () => {
    setErroEnvio(null);
    const e = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(e)) {
      setErroEnvio('Confirma o teu email.');
      return;
    }
    setAEnviar(true);
    try {
      const resp = await fetch(`${SITE_URL}/api/relatorio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hz: hzInt,
          nome: nome === 'tu' ? 'Amiga' : nome,
          email: e,
          respostas,
        }),
      });
      const data = (await resp.json().catch(() => ({}))) as { ok?: boolean; erro?: string };
      if (!resp.ok || !data.ok) {
        setErroEnvio(data.erro ?? 'Não foi possível enviar. Tenta de novo daqui a pouco.');
        return;
      }
      setEnviado(true);
    } catch (err) {
      setErroEnvio('Sem ligação. Verifica a internet e tenta de novo.');
    } finally {
      setAEnviar(false);
    }
  };

  const r = gerarRelatorio(hzInt, respostas);
  const nivel = getNivelMaisProximo(hzInt);
  const proximo = getNivelAcima(nivel.hz);
  const corAcento = nivel.cor === '#a0ffc0' ? cores.green : nivel.cor;

  return (
    <CosmicBackground particles={40} glow={nivel.cor}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={styles.back}>← voltar</Text>
          </Pressable>
          <Text style={styles.headerEdicao}>EDIÇÃO PESSOAL</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* ── Capa ── */}
          <FadeIn>
            <View style={styles.capa}>
              <Text style={styles.capaLabel}>RELATÓRIO VION</Text>
              <Text style={[styles.capaHz, { color: corAcento, textShadowColor: corAcento }]}>
                {r.hz}<Text style={styles.capaHzUnit}> Hz</Text>
              </Text>
              <Text style={styles.capaNivel}>{r.nivel}</Text>
              <Text style={styles.capaNivelEn}>{r.nivelEn}</Text>
              <View style={[styles.capaLinha, { backgroundColor: corAcento + '88' }]} />
              <Text style={styles.capaPara}>uma edição para {nome}</Text>
            </View>
          </FadeIn>

          {/* ── Índice ── */}
          <FadeIn delay={120}>
            <View style={styles.indice}>
              <Text style={styles.indiceLabel}>ÍNDICE</Text>
              {[
                ['I',   'O teu mapa actual'],
                ['II',  'Os padrões inconscientes'],
                ['III', 'A crença que te prende'],
                ['IV',  'A respiração para este nível'],
                ['V',   'A meditação para este nível'],
                ['VI',  'O contacto com o Todo'],
                ['VII', 'Práticas diárias'],
                ['VIII','Afirmações'],
                ['IX',  proximo ? `Travessia para ${proximo.nome}` : 'Permanência'],
                ...(r.leituraIndividual ? [['X', 'A tua leitura individual']] : []),
              ].map(([num, titulo], i) => (
                <View key={i} style={styles.indiceRow}>
                  <Text style={styles.indiceNum}>{num}</Text>
                  <Text style={styles.indiceTit}>{titulo}</Text>
                </View>
              ))}
            </View>
          </FadeIn>

          {/* ── Capítulos ── */}
          <Capitulo num="I" titulo="O teu mapa actual" delay={200} cor={corAcento}>
            <Text style={styles.paragrafo}>{r.diagnostico}</Text>
          </Capitulo>

          <Capitulo num="II" titulo="Os padrões inconscientes" delay={280} cor={corAcento}>
            {r.padroes.map((p, i) => (
              <View key={i} style={styles.lista}>
                <Text style={[styles.listaNum, { color: corAcento }]}>{i + 1}.</Text>
                <Text style={styles.listaTxt}>{p}</Text>
              </View>
            ))}
          </Capitulo>

          <Capitulo num="III" titulo="A crença que te prende" delay={360} cor={corAcento}>
            <Text style={[styles.crenca, { borderLeftColor: corAcento }]}>
              "{r.crencaLimitante}"
            </Text>
            <Text style={styles.paragrafo}>
              Reconhece esta crença sempre que se manifestar. Não a combatas — observa-a. A consciência dissolve o que a inconsciência sustenta.
            </Text>
          </Capitulo>

          <Capitulo num="IV" titulo="A respiração para este nível" delay={440} cor={corAcento}>
            <PraticaBloco pratica={r.respiracao} cor={corAcento} />
          </Capitulo>

          <Capitulo num="V" titulo="A meditação para este nível" delay={520} cor={corAcento}>
            <PraticaBloco pratica={r.meditacao} cor={corAcento} />
          </Capitulo>

          <Capitulo num="VI" titulo="O contacto com o Todo" delay={600} cor={corAcento}>
            {r.contactoComTodo.split('\n\n').map((p, i) => (
              <Text key={i} style={styles.paragrafoLiterario}>
                {p}
              </Text>
            ))}
          </Capitulo>

          <Capitulo num="VII" titulo="Práticas diárias" delay={680} cor={corAcento}>
            {r.praticas.map((p, i) => (
              <View key={i} style={styles.lista}>
                <Text style={[styles.listaNum, { color: corAcento }]}>{i + 1}.</Text>
                <Text style={styles.listaTxt}>{p}</Text>
              </View>
            ))}
          </Capitulo>

          <Capitulo num="VIII" titulo="Afirmações" delay={760} cor={corAcento}>
            {r.afirmacoes.map((a, i) => (
              <Text key={i} style={styles.afirmacao}>
                ✦  {a}
              </Text>
            ))}
          </Capitulo>

          <Capitulo
            num="IX"
            titulo={proximo ? `Travessia para ${proximo.nome}` : 'Permanência'}
            delay={840}
            cor={corAcento}
          >
            <Text style={styles.paragrafo}>{r.ponteProxNivel}</Text>
            {proximo && (
              <Text style={styles.paragrafo}>
                Quando chegares a {proximo.hz} Hz, relaciona-te com a tua experiência a partir de {proximo.nome.toLowerCase()} — {proximo.desc.toLowerCase()}
              </Text>
            )}
          </Capitulo>

          {r.leituraIndividual && (
            <Capitulo num="X" titulo="A tua leitura individual" delay={920} cor={corAcento}>
              {r.leituraIndividual.split('\n\n').map((p, i) => (
                <Text key={i} style={styles.paragrafo}>
                  {p}
                </Text>
              ))}
            </Capitulo>
          )}

          {/* ── Banner: versão e-book por email ── */}
          <FadeIn delay={1000}>
            <View style={styles.banner}>
              {enviado ? (
                <>
                  <Text style={styles.bannerLabel}>ENVIADO</Text>
                  <Text style={styles.bannerTit}>Verifica o teu email</Text>
                  <Text style={styles.bannerTxt}>
                    O PDF segue para <Text style={{ color: cores.text }}>{email}</Text>. Pode demorar 1-2 minutos. Se não chegar, verifica a pasta de spam.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.bannerLabel}>VERSÃO E-BOOK</Text>
                  <Text style={styles.bannerTit}>Recebe em PDF, mais aprofundado</Text>
                  <Text style={styles.bannerTxt}>
                    Geramos uma edição personalizada com 7 capítulos — escritos para o teu nível e para a tua leitura individual — e enviamos-te ao email.
                  </Text>
                  <View style={styles.emailRow}>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="tu@exemplo.com"
                      placeholderTextColor={cores.muted}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      style={styles.emailInput}
                      editable={!aEnviar}
                    />
                  </View>
                  {erroEnvio && <Text style={styles.bannerErro}>{erroEnvio}</Text>}
                  <View style={{ marginTop: 10 }}>
                    <GradientButton
                      label={aEnviar ? 'A gerar…' : 'Receber em PDF'}
                      variant="gold"
                      onPress={enviarPdf}
                      disabled={aEnviar || !email}
                    />
                  </View>
                </>
              )}
            </View>
          </FadeIn>

          <View style={{ marginTop: 28 }}>
            <GradientButton label="Praticar agora" onPress={() => router.push('/praticas')} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </CosmicBackground>
  );
}

function Capitulo({
  num,
  titulo,
  delay,
  cor,
  children,
}: {
  num: string;
  titulo: string;
  delay?: number;
  cor: string;
  children: React.ReactNode;
}) {
  return (
    <FadeIn delay={delay}>
      <View style={styles.cap}>
        <View style={styles.capCab}>
          <Text style={[styles.capNum, { color: cor }]}>{num}</Text>
          <Text style={styles.capTit}>{titulo}</Text>
        </View>
        <View style={styles.capBody}>{children}</View>
      </View>
    </FadeIn>
  );
}

function PraticaBloco({ pratica, cor }: { pratica: Pratica; cor: string }) {
  return (
    <View>
      <Text style={[styles.praticaNome, { color: cor }]}>{pratica.nome}</Text>
      <Text style={styles.paragrafoLiterario}>{pratica.porque}</Text>
      <Text style={styles.praticaSubLabel}>COMO</Text>
      {pratica.como.map((passo, i) => (
        <View key={i} style={styles.passoRow}>
          <Text style={[styles.passoNum, { color: cor }]}>{i + 1}</Text>
          <Text style={styles.passoTxt}>{passo}</Text>
        </View>
      ))}
      <View style={styles.duracaoBox}>
        <Text style={styles.duracaoLabel}>DURAÇÃO</Text>
        <Text style={styles.duracaoTxt}>{pratica.duracao}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  back: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 14 },
  headerEdicao: { fontFamily: fontes.mono, color: cores.muted, fontSize: 10, letterSpacing: 2 },
  content: { paddingHorizontal: 24, paddingBottom: 64, paddingTop: 8 },

  // ── Capa ──
  capa: { alignItems: 'center', paddingTop: 28, paddingBottom: 36 },
  capaLabel: { fontFamily: fontes.mono, color: cores.muted, fontSize: 11, letterSpacing: 4 },
  capaHz: {
    fontFamily: fontes.tituloBold,
    fontSize: 96,
    letterSpacing: -2,
    marginTop: 6,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 28,
  },
  capaHzUnit: { fontFamily: fontes.mono, fontSize: 22, opacity: 0.7 },
  capaNivel: { fontFamily: fontes.titulo, color: cores.text, fontSize: 32, marginTop: 8 },
  capaNivelEn: { fontFamily: fontes.corpo, color: cores.muted, fontStyle: 'italic', fontSize: 13, marginTop: 2 },
  capaLinha: { width: 60, height: 1, marginTop: 22, marginBottom: 18 },
  capaPara: { fontFamily: fontes.corpo, color: cores.muted, fontStyle: 'italic', fontSize: 13 },

  // ── Índice ──
  indice: {
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 14,
    padding: 20,
    marginTop: 6,
    marginBottom: 12,
  },
  indiceLabel: { fontFamily: fontes.mono, color: cores.muted, fontSize: 11, letterSpacing: 3, marginBottom: 12 },
  indiceRow: { flexDirection: 'row', alignItems: 'baseline', paddingVertical: 4 },
  indiceNum: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 12,
    width: 40,
    letterSpacing: 1,
  },
  indiceTit: { flex: 1, fontFamily: fontes.titulo, color: cores.text, fontSize: 16 },

  // ── Capítulos ──
  cap: { marginTop: 36 },
  capCab: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 },
  capNum: {
    fontFamily: fontes.tituloBold,
    fontSize: 28,
    width: 56,
    letterSpacing: 1,
  },
  capTit: { flex: 1, fontFamily: fontes.titulo, color: cores.text, fontSize: 24, lineHeight: 30 },
  capBody: {
    paddingLeft: 4,
  },

  paragrafo: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.92,
    fontSize: 15,
    lineHeight: 26,
    marginBottom: 14,
  },
  paragrafoLiterario: {
    fontFamily: fontes.corpo,
    color: cores.text,
    opacity: 0.95,
    fontSize: 16,
    lineHeight: 28,
    marginBottom: 14,
  },

  lista: { flexDirection: 'row', marginBottom: 12 },
  listaNum: { fontFamily: fontes.tituloBold, fontSize: 16, width: 26 },
  listaTxt: { flex: 1, fontFamily: fontes.corpo, color: cores.text, fontSize: 15, lineHeight: 24 },

  crenca: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 22,
    fontStyle: 'italic',
    lineHeight: 32,
    paddingLeft: 16,
    borderLeftWidth: 3,
    marginBottom: 16,
  },

  // Práticas (respiração + meditação)
  praticaNome: { fontFamily: fontes.tituloBold, fontSize: 22, marginBottom: 6 },
  praticaSubLabel: {
    fontFamily: fontes.mono,
    color: cores.muted,
    fontSize: 10,
    letterSpacing: 2.5,
    marginTop: 6,
    marginBottom: 10,
  },
  passoRow: { flexDirection: 'row', marginBottom: 10 },
  passoNum: { fontFamily: fontes.monoMedium, fontSize: 14, width: 26 },
  passoTxt: { flex: 1, fontFamily: fontes.corpo, color: cores.text, fontSize: 15, lineHeight: 24 },
  duracaoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: cores.faint,
    borderRadius: 10,
  },
  duracaoLabel: { fontFamily: fontes.mono, color: cores.muted, fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  duracaoTxt: { fontFamily: fontes.corpoMedium, color: cores.text, fontSize: 14 },

  afirmacao: {
    fontFamily: fontes.titulo,
    color: cores.text,
    fontSize: 17,
    lineHeight: 30,
    marginBottom: 4,
  },

  banner: {
    marginTop: 40,
    padding: 18,
    borderRadius: 14,
    backgroundColor: cores.surface,
    borderWidth: 1,
    borderColor: cores.gold + '44',
  },
  bannerLabel: { fontFamily: fontes.mono, color: cores.gold, fontSize: 10, letterSpacing: 2.5, marginBottom: 6 },
  bannerTit: { fontFamily: fontes.titulo, color: cores.text, fontSize: 20, marginBottom: 6 },
  bannerTxt: { fontFamily: fontes.corpo, color: cores.muted, fontSize: 13, lineHeight: 21 },
  emailRow: { marginTop: 14 },
  emailInput: {
    backgroundColor: cores.bg,
    borderWidth: 1,
    borderColor: cores.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fontes.corpo,
    color: cores.text,
    fontSize: 15,
  },
  bannerErro: {
    fontFamily: fontes.corpo,
    color: cores.red,
    fontSize: 12,
    marginTop: 8,
  },
});
