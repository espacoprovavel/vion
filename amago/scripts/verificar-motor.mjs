/**
 * Verificação do motor de interpretação através de /api/mergulho.
 *
 *   npm run build && npm start        (noutro terminal)
 *   npm run verificar
 *
 * Corre em modo demonstração (sem Supabase) e não guarda nada.
 */
const BASE = process.env.AMAGO_URL ?? 'http://localhost:3000';

const RESPOSTAS_BASE = {
  q1: 'q1a', q2: 'q2a', q3: 'q3a', q4: 'q4a',
  q5: 'q5a', q6: 'q6a', q7: 'q7a',
  q8: 'q8b', q9: 'q9a', q10: 'q10a',
  q11: 'q11c', q12: 'q12c',
};

const letra = { controlador: 'a', provador: 'b', invisivel: 'c', guardiao: 'd', leal: 'e', indigno: 'f' };

/** Todas as respostas de arquétipo apontadas ao mesmo padrão. */
function comArquetipo(codigo, extra = {}) {
  const l = letra[codigo];
  return {
    ...RESPOSTAS_BASE,
    q1: `q1${l}`, q2: `q2${l}`, q3: `q3${l}`, q4: `q4${l}`,
    q5: `q5${l}`, q7: `q7${l}`,
    ...extra,
  };
}

const CASOS = [
  ...Object.keys(letra).map((codigo) => ({
    nome: `padrão dominante: ${codigo}`,
    respostas: comArquetipo(codigo),
    espera: (r) => r.arquetipoSombra.codigo === codigo,
  })),
  {
    nome: 'q8 "não faço ideia" marca o Véu no Terreno',
    respostas: comArquetipo('controlador', { q8: 'q8e', q9: 'q9a', q10: 'q10a' }),
    espera: (r) => r.camadaVeu === 'terreno',
  },
  {
    nome: 'q10 pesa mais do que q9 na escolha do Véu',
    respostas: comArquetipo('controlador', { q8: 'q8b', q9: 'q9c', q10: 'q10e' }),
    espera: (r) => r.camadaVeu === 'comando',
  },
  {
    nome: 'fosso: padrão que recua + "avanço sempre" => Véu na Função',
    respostas: comArquetipo('leal', { q11: 'q11a', q12: 'q12a', q9: 'q9c', q10: 'q10c' }),
    espera: (r) => r.fosso.detetado && r.camadaVeu === 'funcao',
  },
  {
    nome: 'sem fosso: padrão que recua mas auto-declaração moderada',
    respostas: comArquetipo('indigno', { q11: 'q11c', q12: 'q12d' }),
    espera: (r) => !r.fosso.detetado,
  },
  {
    nome: 'sem fosso: padrão que avança, mesmo com auto-declaração forte',
    respostas: comArquetipo('controlador', { q11: 'q11a', q12: 'q12a' }),
    espera: (r) => !r.fosso.detetado,
  },
  {
    nome: 'a resposta somática entra na leitura',
    respostas: comArquetipo('provador', { q6: 'q6c' }),
    espera: (r) => r.somatica === 'Garganta' && r.texto.agradece.includes('garganta'),
  },
  {
    nome: 'a linha das lentes é sempre composta',
    respostas: comArquetipo('guardiao'),
    espera: (r) => r.lentesUsadas.includes('🟢') && r.lentesUsadas.includes('🟡'),
  },
  {
    nome: 'a leitura nunca acusa: aparece sempre a forma integrada',
    respostas: comArquetipo('invisivel'),
    espera: (r) => Boolean(r.arquetipoIntegrado) && r.texto.ponte.includes(r.arquetipoIntegrado),
  },
];

async function pede(respostas) {
  const resposta = await fetch(`${BASE}/api/mergulho`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ porta: 'dificuldade', consentimento: true, respostas }),
  });
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.erro ?? `HTTP ${resposta.status}`);
  return corpo.leitura;
}

let falhas = 0;
for (const caso of CASOS) {
  try {
    const leitura = await pede(caso.respostas);
    const ok = caso.espera(leitura);
    if (!ok) falhas++;
    console.log(`${ok ? '  ok  ' : ' FALHA'}  ${caso.nome}`);
    if (!ok) {
      console.log(
        `        sombra=${leitura.arquetipoSombra.codigo} véu=${leitura.camadaVeu} fosso=${leitura.fosso.detetado}`,
      );
    }
  } catch (erro) {
    falhas++;
    console.log(` ERRO   ${caso.nome}: ${erro.message}`);
  }
}

// O consentimento é obrigatório: sem ele, o pedido tem de ser recusado.
const semConsentimento = await fetch(`${BASE}/api/mergulho`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ porta: 'duvida', respostas: RESPOSTAS_BASE }),
});
const recusou = semConsentimento.status === 400;
if (!recusou) falhas++;
console.log(`${recusou ? '  ok  ' : ' FALHA'}  sem consentimento o pedido é recusado`);

// Mergulho incompleto também não passa.
const incompleto = await fetch(`${BASE}/api/mergulho`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ porta: 'duvida', consentimento: true, respostas: { q1: 'q1a' } }),
});
const bloqueou = incompleto.status === 400;
if (!bloqueou) falhas++;
console.log(`${bloqueou ? '  ok  ' : ' FALHA'}  mergulho incompleto é recusado`);

console.log(`\n${falhas === 0 ? 'Tudo certo.' : `${falhas} verificação(ões) a falhar.`}`);
process.exit(falhas === 0 ? 0 : 1);
