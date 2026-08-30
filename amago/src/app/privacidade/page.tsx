import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidade e dados — Âmago',
};

const SECCOES: { titulo: string; paragrafos: string[] }[] = [
  {
    titulo: 'Quem trata os teus dados',
    paragrafos: [
      'O responsável pelo tratamento é a entidade que opera o Âmago. Para qualquer questão sobre os teus dados, ou para exerceres os direitos descritos em baixo, podes contactar-nos pelo endereço indicado no site.',
    ],
  },
  {
    titulo: 'Que dados recolhemos',
    paragrafos: [
      'Dados de conta: o teu endereço de email e a palavra-passe (guardada cifrada pelo fornecedor de autenticação, nunca em texto simples).',
      'Dados do Mergulho: a porta de entrada que escolheste (dúvida, curiosidade ou dificuldade), o texto livre que escreveres à entrada — se escreveres —, as respostas que deres às perguntas e a leitura gerada a partir delas.',
      'Não usamos publicidade, não fazemos perfis comerciais e não vendemos dados a ninguém.',
    ],
  },
  {
    titulo: 'Porque é que isto são dados sensíveis',
    paragrafos: [
      'As respostas do Mergulho dizem respeito ao teu estado psicológico e à tua vida pessoal. O Regulamento Geral sobre a Proteção de Dados trata este tipo de informação como categoria especial de dados (artigo 9.º), o que exige uma proteção mais alta.',
      'Por isso, a base legal do tratamento é o teu consentimento explícito, dado antes de começares. Sem esse consentimento não guardamos nada.',
    ],
  },
  {
    titulo: 'Para que servem',
    paragrafos: [
      'Para te devolver a leitura no fim do Mergulho e para manteres o teu histórico acessível quando voltares.',
      'Para melhorar o Âmago, olhamos apenas para números agregados e anónimos: quantas pessoas escolheram cada resposta, com que frequência aparece cada padrão. Estes agregados não permitem identificar-te e o texto livre nunca entra neles.',
    ],
  },
  {
    titulo: 'Quem lhes acede',
    paragrafos: [
      'Só tu vês os teus mergulhos. O acesso é imposto pela própria base de dados, através de regras que limitam cada linha ao utilizador que a criou.',
      'A administração do Âmago vê apenas os agregados anónimos, nunca as respostas de uma pessoa concreta nem o texto que escreveste.',
    ],
  },
  {
    titulo: 'Onde ficam guardados',
    paragrafos: [
      'Os dados são guardados em infraestrutura alojada na União Europeia, sem transferências para países terceiros no funcionamento normal do serviço.',
    ],
  },
  {
    titulo: 'Durante quanto tempo',
    paragrafos: [
      'Os teus mergulhos ficam guardados enquanto tiveres conta. Se apagares a conta, os mergulhos, as respostas e as leituras são apagados com ela.',
    ],
  },
  {
    titulo: 'Os teus direitos',
    paragrafos: [
      'Tens direito a aceder aos teus dados, a corrigi-los, a apagá-los, a limitar ou opor-te ao tratamento e a recebê-los num formato portável. Podes também retirar o consentimento a qualquer momento — isso não afeta o tratamento feito antes de o retirares.',
      'Se entenderes que os teus dados não estão a ser bem tratados, podes apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).',
    ],
  },
  {
    titulo: 'Aviso importante',
    paragrafos: [
      'O Âmago é uma ferramenta de autoconhecimento. Não é um instrumento clínico, não produz diagnósticos, não avalia risco e não substitui acompanhamento psicológico ou médico.',
      'Se estiveres a passar por um período difícil, o SNS 24 atende a qualquer hora, todos os dias, no 808 24 24 24. Em emergência, liga 112.',
    ],
  },
];

export default function Privacidade() {
  return (
    <article className="mx-auto w-full max-w-2xl px-6 py-16 surge">
      <h1 className="display text-3xl mb-3">Privacidade e dados</h1>
      <p className="text-sm text-tinta-tenue mb-12">
        Versão 1 · em vigor desde o lançamento do Âmago
      </p>
      <div className="space-y-10">
        {SECCOES.map((s) => (
          <section key={s.titulo}>
            <h2 className="display text-xl mb-3">{s.titulo}</h2>
            <div className="space-y-3">
              {s.paragrafos.map((p, i) => (
                <p key={i} className="text-tinta-suave leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
