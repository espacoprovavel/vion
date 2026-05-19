export const calcularFrequencia = (
  respostasB1: number[],
  respostasB2: number[],
): number => {
  const mediaB1 = respostasB1.reduce((a, b) => a + b, 0) / 12;
  const mediaB2 = respostasB2.reduce((a, b) => a + b, 0) / 12;
  return Math.round(mediaB1 * 0.4 + mediaB2 * 0.6);
};
