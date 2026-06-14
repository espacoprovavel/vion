/**
 * Template do Relatório VION em PDF (React-PDF).
 *
 * Gera um e-book A4 com capa + índice + 7 capítulos.
 * Devolve um Buffer pronto a anexar ao email.
 */
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { CapitulosClaude } from './claude';

const cores = {
  bg: '#FFFFFF',
  surface: '#F8F7FC',
  text: '#1B1830',
  muted: '#8A879E',
  accent: '#7C5CFC',
  gold: '#B0822E',
  border: '#E7E5F1',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 56,
    backgroundColor: cores.bg,
    color: cores.text,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.7,
  },

  // Capa
  capa: {
    backgroundColor: cores.bg,
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 56,
    alignItems: 'center',
    height: '100%',
  },
  capaLabel: {
    fontFamily: 'Courier',
    fontSize: 10,
    letterSpacing: 4,
    color: cores.muted,
    marginBottom: 24,
  },
  capaHz: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 140,
    letterSpacing: -4,
    marginBottom: -10,
  },
  capaHzUnit: {
    fontSize: 28,
    color: cores.muted,
  },
  capaNivel: {
    fontFamily: 'Times-Roman',
    fontSize: 44,
    marginTop: 20,
  },
  capaNivelEn: {
    fontFamily: 'Times-Italic',
    fontSize: 14,
    color: cores.muted,
    marginTop: 4,
  },
  capaLinha: {
    width: 60,
    height: 1,
    backgroundColor: cores.gold,
    marginTop: 36,
    marginBottom: 24,
  },
  capaPara: {
    fontFamily: 'Times-Italic',
    fontSize: 13,
    color: cores.muted,
  },
  capaRodape: {
    position: 'absolute',
    bottom: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  capaRodapeTxt: {
    fontFamily: 'Courier',
    fontSize: 9,
    letterSpacing: 3,
    color: cores.muted,
  },

  // Índice
  indiceTit: {
    fontFamily: 'Times-Roman',
    fontSize: 32,
    marginBottom: 40,
  },
  indiceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: cores.border,
  },
  indiceNum: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: cores.muted,
    width: 50,
  },
  indiceTituloCap: {
    flex: 1,
    fontFamily: 'Times-Roman',
    fontSize: 13,
  },
  indicePag: {
    fontFamily: 'Courier',
    fontSize: 10,
    color: cores.muted,
  },

  // Capítulo
  capLabel: {
    fontFamily: 'Courier',
    fontSize: 10,
    letterSpacing: 3,
    color: cores.gold,
    marginBottom: 6,
  },
  capNum: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 48,
    marginBottom: -8,
  },
  capTit: {
    fontFamily: 'Times-Roman',
    fontSize: 26,
    marginTop: 8,
    marginBottom: 28,
  },
  capTexto: {
    fontFamily: 'Times-Roman',
    fontSize: 11.5,
    lineHeight: 1.75,
    textAlign: 'justify',
    marginBottom: 12,
  },

  // Rodapé
  rodape: {
    position: 'absolute',
    bottom: 30,
    left: 56,
    right: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rodapeTxt: {
    fontFamily: 'Courier',
    fontSize: 8,
    color: cores.muted,
    letterSpacing: 2,
  },
});

const CAPITULOS_META = [
  { num: 'I',   chave: 'feridaCentral' as const, titulo: 'A ferida central' },
  { num: 'II',  chave: 'domEscondido'  as const, titulo: 'O dom escondido' },
  { num: 'III', chave: 'corpo'         as const, titulo: 'A prática do corpo' },
  { num: 'IV',  chave: 'mente'         as const, titulo: 'A prática da mente' },
  { num: 'V',   chave: 'relacoes'      as const, titulo: 'A prática nas relações' },
  { num: 'VI',  chave: 'todo'          as const, titulo: 'O encontro com o Todo' },
  { num: 'VII', chave: 'travessia'     as const, titulo: 'A travessia' },
];

function partirParagrafos(texto: string): string[] {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export type DadosPdf = {
  nome: string;
  hz: number;
  nivelNome: string;
  nivelEn: string;
  capitulos: CapitulosClaude;
};

function Relatorio({ dados }: { dados: DadosPdf }) {
  return (
    <Document
      title={`Relatório VION · ${dados.nome} · ${dados.hz} Hz`}
      author="VION Vibracional"
      subject="Relatório de elevação de consciência"
      language="pt-PT"
    >
      {/* Capa */}
      <Page size="A4" style={{ backgroundColor: cores.bg }}>
        <View style={styles.capa}>
          <Text style={styles.capaLabel}>RELATÓRIO VION</Text>
          <Text style={styles.capaHz}>
            {dados.hz}
            <Text style={styles.capaHzUnit}>  Hz</Text>
          </Text>
          <Text style={styles.capaNivel}>{dados.nivelNome}</Text>
          <Text style={styles.capaNivelEn}>{dados.nivelEn}</Text>
          <View style={styles.capaLinha} />
          <Text style={styles.capaPara}>uma edição para {dados.nome}</Text>
          <View style={styles.capaRodape}>
            <Text style={styles.capaRodapeTxt}>VION VIBRACIONAL</Text>
          </View>
        </View>
      </Page>

      {/* Índice */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.indiceTit}>Índice</Text>
        {CAPITULOS_META.map((c, i) => (
          <View key={c.num} style={styles.indiceRow}>
            <Text style={styles.indiceNum}>{c.num}</Text>
            <Text style={styles.indiceTituloCap}>{c.titulo}</Text>
            <Text style={styles.indicePag}>{(i + 1) * 4 + 2}</Text>
          </View>
        ))}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTxt}>VION · {dados.hz} Hz</Text>
          <Text style={styles.rodapeTxt}>2</Text>
        </View>
      </Page>

      {/* 7 capítulos */}
      {CAPITULOS_META.map((c) => {
        const paragrafos = partirParagrafos(dados.capitulos[c.chave]);
        return (
          <Page key={c.num} size="A4" style={styles.page}>
            <Text style={styles.capLabel}>CAPÍTULO {c.num}</Text>
            <Text style={styles.capNum}>{c.num}</Text>
            <Text style={styles.capTit}>{c.titulo}</Text>
            {paragrafos.map((p, i) => (
              <Text key={i} style={styles.capTexto}>
                {p}
              </Text>
            ))}
            <View style={styles.rodape}>
              <Text style={styles.rodapeTxt}>VION · {dados.hz} Hz · {dados.nivelNome.toUpperCase()}</Text>
              <Text
                style={styles.rodapeTxt}
                render={({ pageNumber }) => `${pageNumber}`}
                fixed
              />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export async function gerarPdf(dados: DadosPdf): Promise<Buffer> {
  return renderToBuffer(<Relatorio dados={dados} />);
}
