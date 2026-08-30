/**
 * As lentes que compõem o motor. O utilizador não escolhe métodos nem vê abas:
 * recebe UMA leitura fundida. Esta linha discreta declara a origem e o grau.
 *
 *   🟢 ciência — corpo de evidência consolidado
 *   🟡 modelo  — enquadramento clínico/teórico útil, sem o mesmo grau de evidência
 */
export interface Lente {
  nome: string;
  grau: '🟢' | '🟡';
}

export const LENTES: Lente[] = [
  { nome: 'análise da função do comportamento', grau: '🟢' },
  { nome: 'psicologia cognitivo-comportamental', grau: '🟢' },
  { nome: 'neurociência do hábito', grau: '🟢' },
  { nome: 'esquemas e padrões aprendidos na família', grau: '🟢' },
  { nome: 'marcadores somáticos', grau: '🟡' },
  { nome: 'teoria dos eus (partes internas)', grau: '🟡' },
  { nome: 'linguagem permissiva de raiz ericksoniana', grau: '🟡' },
];

export function linhaDasLentes(lentes: Lente[] = LENTES): string {
  return lentes.map((l) => `${l.nome} ${l.grau}`).join(' · ');
}
