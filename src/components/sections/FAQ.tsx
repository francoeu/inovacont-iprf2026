"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <div 
        className="faq-q"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <div className="faq-icon">+</div>
      </div>
      <div className="faq-a">
        <div 
          className="faq-a-inner"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "Qual o limite de renda para declarar em 2026 (IN RFB 2.312)?",
      answer: "Conforme o Art. 2º, inciso I, da IN RFB 2.312/2026, o limite é de <strong>R$ 35.584,00</strong> de rendimentos tributáveis no ano-calendário 2025. Esse valor foi atualizado em relação ao exercício anterior (2025 tinha limite de R$ 33.888,00)."
    },
    {
      question: "Quais são as Faixas de Tributação IRPF 2026 (Tabela Progressiva)?",
      answer: `
        <p>Alíquotas e parcelas a deduzir conforme o rendimento mensal tributável.</p>
        <div class="tax-table-wrapper" style="margin-top: 14px;">
          <table class="tax-table">
            <thead>
              <tr>
                <th>Base de Cálculo Mensal</th>
                <th>Alíquota</th>
                <th>Parcela a Deduzir</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Até R$ 2.259,20</td>
                <td><span class="alq-badge b0">Isento</span></td>
                <td>-</td>
              </tr>
              <tr>
                <td>De R$ 2.259,21 até R$ 2.828,65</td>
                <td><span class="alq-badge b75">7,5%</span></td>
                <td>R$ 169,44</td>
              </tr>
              <tr>
                <td>De R$ 2.828,66 até R$ 3.751,05</td>
                <td><span class="alq-badge b15">15,0%</span></td>
                <td>R$ 381,44</td>
              </tr>
              <tr>
                <td>De R$ 3.751,06 até R$ 4.664,68</td>
                <td><span class="alq-badge b22">22,5%</span></td>
                <td>R$ 662,77</td>
              </tr>
              <tr>
                <td>Acima de R$ 4.664,68</td>
                <td><span class="alq-badge b27">27,5%</span></td>
                <td>R$ 896,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      question: "Como funciona o cálculo do INSS para quem é CLT?",
      answer: "A contribuição INSS do empregado CLT é calculada pela tabela progressiva 2025: 7,5% (até R$ 1.518,00), 9% (R$ 1.518,01–R$ 2.793,88), 12% (R$ 2.793,89–R$ 4.190,83) e 14% (R$ 4.190,84–R$ 8.157,41). O valor é deduzido integralmente da base de cálculo do IR. Exemplo: salário bruto de R$ 5.000 → INSS ~R$ 490 → base IR = R$ 4.510 → IR = R$ 4.510 × 15% − R$ 492,78 = R$ 183,72/mês."
    },
    {
      question: "Como declarar sendo PJ? O IRRF é abatido?",
      answer: "Quem recebe como PJ (pró-labore) declara esse valor como rendimento tributável. O INSS sobre o pró-labore é de 11% (contribuinte individual). A distribuição de lucros é isenta de IR na pessoa física. O IRRF (Imposto Retido na Fonte) eventualmente pago durante o ano é creditado no ajuste anual — se o total retido for maior que o IR calculado, resulta em restituição."
    },
    {
      question: "Desconto simplificado ou deduções legais — qual é mais vantajoso?",
      answer: "O desconto simplificado (Art. 3º, IN RFB 2.312/2026) corresponde a 20% dos rendimentos tributáveis, limitado a R$ 16.754,34. Use-o se suas deduções reais (saúde + educação + dependentes × R$ 2.275,08 + INSS) forem menores que 20% da sua renda. O simulador da Inovacont compara as duas opções automaticamente e indica a mais vantajosa."
    },
    {
      question: "Posso pagar o imposto parcelado? Há juros?",
      answer: "Sim. Conforme o Art. 12 da IN, o imposto pode ser pago em até 8 quotas mensais. Cada quota deve ser de no mínimo R$ 50,00; imposto menor que R$ 100,00 é pago em quota única. As quotas a partir da 2ª têm acréscimo da taxa Selic acumulada + 1% no mês do pagamento."
    },
    {
      question: "Quem tem prioridade para receber a restituição?",
      answer: "Ordem de prioridade: (1) 80 anos ou mais; (2) 60+, deficientes físicos/mentais ou portadores de moléstia grave; (3) magistério como maior fonte de renda; (4) contribuintes que usaram declaração pré-preenchida E/OU escolheram receber via Pix; (5) demais, em ordem cronológica de entrega. Entregar cedo + usar pré-preenchida + receber via Pix = máxima prioridade."
    },
    {
      question: "Como declarar a distribuição de lucros da PJ no IR?",
      answer: "A distribuição de lucros recebida de sua empresa (PJ médica) é <strong>isenta de IRPF</strong> e deve ser informada na ficha \"Rendimentos Isentos e Não Tributáveis\", código 09. Esse valor não entra na base de cálculo do IR, mas é somado para verificar o critério de obrigatoriedade (R$ 200.000/ano). Importante: o valor distribuído deve ter lastro no lucro contábil da empresa — por isso um contador é essencial para calcular o lucro real antes da distribuição."
    },
    {
      question: "O pró-labore afeta minha declaração de IR pessoal?",
      answer: "Sim. O pró-labore é rendimento tributável na pessoa física — assim como um salário CLT. Sobre ele incidem INSS (11% até o teto de R$ 908,86/mês) e IRPF pela tabela progressiva. Na declaração anual, o pró-labore entra na ficha \"Rendimentos Tributáveis Recebidos de Pessoa Jurídica\". O INSS pago é dedutível da base do IR. Por isso, manter o pró-labore no mínimo necessário (com Fator R ≥ 28% para Simples Anexo III) é uma estratégia tributária comum para médicos PJ."
    },
    {
      question: "Equipamentos e instrumentos médicos são dedutíveis no IR?",
      answer: "Depende de como você recebe. <strong>Como PF autônomo:</strong> equipamentos e instrumentos usados exclusivamente no trabalho podem ser deduzidos como \"Livro Caixa\" (despesas da atividade profissional), reduzindo a base do IR. <strong>Como PJ:</strong> os equipamentos são despesas da empresa e reduzem o lucro contábil — não entram diretamente no IR da pessoa física, mas o benefício chega indiretamente via maior distribuição de lucros isenta. Em ambos os casos, é indispensável ter nota fiscal."
    },
    {
      question: "Como deduzir previdência privada (PGBL) no Imposto de Renda?",
      answer: "O PGBL (Plano Gerador de Benefício Livre) permite deduzir até <strong>12% dos rendimentos tributáveis brutos</strong> na declaração completa. Exemplo: renda tributável de R$ 100.000/ano → pode deduzir até R$ 12.000 em PGBL → reduz a base do IR e gera economia. <strong>Atenção:</strong> funciona apenas com a declaração completa (não simplificada), e os rendimentos do PGBL são tributados no resgate. O VGBL não tem esse benefício fiscal. Para médicos PJ, o pró-labore é a base de cálculo — quanto maior o pró-labore, maior o benefício do PGBL."
    }
  ];

  return (
    <section className="faq-section py-24 bg-white" id="faq">
      <div className="faq-inner max-w-4xl mx-auto px-6">
        <div className="section-header text-center" style={{ marginBottom: "38px" }}>
          <span className="section-tag" style={{ display: "block", textAlign: "center" }}>
            Dúvidas frequentes
          </span>
          <h2>Perguntas sobre o IRPF 2026</h2>
        </div>

        {faqs.map((faq, i) => (
          <FAQItem key={i} {...faq} />
        ))}
      </div>
    </section>
  );
}
