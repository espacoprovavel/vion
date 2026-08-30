/**
 * Rede de segurança.
 *
 * A app NÃO interpreta sofrimento, NÃO avalia risco e NÃO faz triagem.
 * Perante sinais de sofrimento grave no texto que a pessoa escreve à entrada,
 * mostra apoio profissional e deixa a pessoa decidir se continua.
 */

export const SNS24 = {
  nome: 'SNS 24',
  telefone: '808 24 24 24',
  nota: 'linha de saúde 24 horas, todos os dias',
};

export const EMERGENCIA = { nome: 'Emergência médica', telefone: '112' };

/**
 * Sinais que acionam a rede de segurança. Deliberadamente amplos: um falso
 * positivo custa um cartão de apoio, um falso negativo custa muito mais.
 */
const SINAIS: RegExp[] = [
  /\bsuic[íi]d/i,
  /\bmatar[- ]?me\b/i,
  /\bmatar a mim\b/i,
  /\btirar a (minha )?vida\b/i,
  /\bp[ôo]r fim [àa] (minha )?vida\b/i,
  /\bacabar com (tudo|isto|a minha vida)\b/i,
  /\bdesaparecer de vez\b/i,
  /\bn[ãa]o quero (mais )?viver\b/i,
  /\bqueria (morrer|desaparecer)\b/i,
  /\bapetece[- ]me morrer\b/i,
  /\bmelhor (se eu )?morrer\b/i,
  /\bn[ãa]o aguento mais\b/i,
  /\bj[áa] n[ãa]o aguento\b/i,
  /\bsem sa[íi]da\b/i,
  /\bautomutila|\bcortar[- ]me\b|\bfazer mal a mim\b/i,
  /\bmagoar[- ]me a s[ée]rio\b/i,
  /\bfazer mal a algu[ée]m\b/i,
];

export function detetaSinaisDeSofrimento(texto: string | undefined | null): boolean {
  if (!texto) return false;
  return SINAIS.some((re) => re.test(texto));
}

export const TEXTO_REDE_DE_SEGURANCA = {
  titulo: 'Antes de continuarmos',
  corpo:
    'Pelo que escreveste, isto pode estar a pesar mais do que uma ferramenta de autoconhecimento consegue acompanhar. Não vamos interpretar o que disseste — não é para isso que o Âmago serve, e não seria justo contigo.',
  apoio:
    'Se quiseres falar com alguém agora, o SNS 24 atende a qualquer hora, todos os dias, no 808 24 24 24. Em situação de emergência, o número é o 112.',
  continuar:
    'Podes continuar o Mergulho se te fizer sentido. Fica só a saber que isto não substitui acompanhamento psicológico.',
};

export const DISCLAIMER =
  'O Âmago é uma ferramenta de autoconhecimento. Não é um instrumento clínico, não faz diagnósticos e não substitui acompanhamento psicológico ou médico.';
