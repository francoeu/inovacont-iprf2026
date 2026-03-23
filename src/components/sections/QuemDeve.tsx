"use client";

import { useState } from "react";

interface ExampleItem {
  type: "inclui" | "nao-inclui" | "atencao" | "isento";
  text: string;
}

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
  examples?: ExampleItem[];
  tip?: string;
  variant?: "default" | "gold" | "deep";
}

function InfoCard({ icon, title, description, examples, tip, variant = "default" }: InfoCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`info-card expandable ${variant === "gold" ? "gold" : variant === "deep" ? "deep" : ""} ${isOpen ? "open" : ""}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="info-icon">{icon}</div>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: description }} />
      
      {examples && (
        <>
          <div className="info-expand-btn">
            {isOpen ? "Fechar" : "Ver exemplos"} <span className="expand-arrow">↓</span>
          </div>

          <div className="info-examples">
            <div className="info-ex-title">📋 Exemplos práticos</div>
            <ul>
              {examples.map((ex, i) => (
                <li key={i}>
                  {ex.type === "inclui" && <span className="ex-badge ex-yes">✓ Inclui</span>}
                  {ex.type === "nao-inclui" && <span className="ex-badge ex-no">✕ Não inclui</span>}
                  {ex.type === "atencao" && <span className="ex-badge ex-no">✕ Atenção</span>}
                  {ex.type === "isento" && <span className="ex-badge ex-no">✕ Isento</span>}
                  <span>{ex.text}</span>
                </li>
              ))}
            </ul>
            {tip && (
              <div className="info-ex-tip" dangerouslySetInnerHTML={{ __html: `💡 ${tip}` }} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function QuemDeve() {
  return (
    <section id="quem-deve" className="section">
      <div className="section-header">
        <span className="section-tag">
          Art. 2º — IN RFB 2.312/2026
        </span>
        <h2>Quem é obrigado a declarar?</h2>
        <p>
          Você deve declarar o IRPF 2026 se se enquadrar em <em>qualquer um</em> dos critérios abaixo no ano-calendário 2025.
        </p>
      </div>

      <div className="info-grid">
        <InfoCard
          icon="💰"
          variant="default"
          title="Rendimentos Tributáveis"
          description="Recebeu rendimentos tributáveis cuja soma foi superior a <strong>R$ 35.584,00</strong> em 2025 (R$ 2.965,33 por mês). Inclui salários, aluguéis, pró-labore, aposentadorias acima do limite."
          examples={[
            { type: "inclui", text: "Salário CLT de R$ 3.500,00 por mês — ultrapassa o limite anual" },
            { type: "inclui", text: "Pró-labore de sócio de R$ 4.000,00 por mês" },
            { type: "inclui", text: "Aluguel de imóvel recebido diretamente no CPF" },
            { type: "inclui", text: "Honorários de autônomo sem nota PJ" },
            { type: "inclui", text: "Aposentadoria INSS acima de R$ 2.824,00 por mês (para 65+)" },
            { type: "nao-inclui", text: "Distribuição de lucros de PJ (isenta)" },
            { type: "nao-inclui", text: "FGTS e PLR (tributados na fonte separadamente)" }
          ]}
          tip="Médico com pró-labore de R$ 3.000,00 por mês = R$ 36.000,00 por ano → <strong>obrigado a declarar</strong>"
        />

        <InfoCard
          icon="📈"
          variant="gold"
          title="Rendimentos Isentos"
          description="Recebeu rendimentos isentos, não tributáveis ou tributados na fonte cuja soma foi superior a <strong>R$ 200.000,00</strong> em 2025. Ex.: PLR, FGTS, dividendos, poupança, indenizações."
          examples={[
            { type: "inclui", text: "Distribuição de lucros de PJ: R$ 20.000,00 por mês = R$ 240.000,00 por ano → declarar" },
            { type: "inclui", text: "FGTS sacado + PLR recebido no ano" },
            { type: "inclui", text: "Rendimentos de poupança e LCI/LCA" },
            { type: "inclui", text: "Indenização trabalhista ou rescisão" },
            { type: "inclui", text: "Dividendos de ações (isentos para PF)" },
            { type: "inclui", text: "Pensão alimentícia recebida (isenta para dependente)" }
          ]}
          tip="Médico PJ que distribui R$ 17.000,00 por mês em lucros = R$ 204.000,00 por ano → <strong>obrigado a declarar</strong>"
        />

        <InfoCard
          icon="🏠"
          variant="deep"
          title="Patrimônio Elevado"
          description="Possuía bens ou direitos com valor total superior a <strong>R$ 800.000,00</strong> em 31/12/2025 — imóveis (custo de aquisição), veículos, investimentos, terra nua etc."
          examples={[
            { type: "inclui", text: "Apartamento de R$ 650.000,00 + carro R$ 200.000,00 = R$ 850.000,00 → declarar" },
            { type: "inclui", text: "Investimentos em renda fixa e ações somados" },
            { type: "inclui", text: "Imóvel herdado registrado em seu nome" },
            { type: "inclui", text: "Participação societária (cotas de empresa)" },
            { type: "atencao", text: "Usa-se o custo de aquisição, não o valor de mercado" }
          ]}
          tip="Imóvel comprado por R$ 500.000,00 em 2010 (mesmo valendo R$ 1.000.000,00 hoje) entra como R$ 500.000,00 na declaração"
        />

        <InfoCard
          icon="📊"
          variant="default"
          title="Ganho de Capital / Bolsa"
          description="Obteve ganho de capital na alienação de bens; ou realizou operações em bolsa com soma superior a <strong>R$ 40.000,00</strong> ou com apuração de ganhos líquidos tributáveis."
          examples={[
            { type: "inclui", text: "Vendeu R$ 50.000,00 em ações em 2025 (independente de lucro ou prejuízo)" },
            { type: "inclui", text: "Vendeu imóvel com lucro → ganho de capital sujeito a IR" },
            { type: "inclui", text: "Operações de day trade (sempre tributadas)" },
            { type: "inclui", text: "Vendeu veículo por valor acima do custo de aquisição" },
            { type: "isento", text: "Venda de único imóvel residencial até R$ 440.000,00" },
            { type: "isento", text: "Venda de ações até R$ 20.000,00 por mês (swing trade)" }
          ]}
          tip="Basta ter realizado R$ 40.000,01 em vendas na bolsa — mesmo sem lucro já é obrigado"
        />

        <InfoCard
          icon="🌾"
          variant="gold"
          title="Atividade Rural"
          description="Obteve receita bruta rural superior a <strong>R$ 177.920,00</strong>, ou deseja compensar prejuízos rurais de anos anteriores ou do próprio ano-calendário 2025."
          examples={[
            { type: "inclui", text: "Produtor rural pessoa física com receita bruta acima do limite" },
            { type: "inclui", text: "Médico que também tem fazenda/sítio produtivo em seu nome" },
            { type: "inclui", text: "Arrendamento de terra com exploração agropecuária" },
            { type: "inclui", text: "Quem quer compensar prejuízo rural de anos anteriores" },
            { type: "nao-inclui", text: "Arrendamento simples de terra (vai para 'Rendimentos Tributáveis')" }
          ]}
          tip="Limite é 50% do teto do IRPF (R$ 35.584,00 × 5 = R$ 177.920,00). Abaixo disso, ainda pode ser obrigado por outro critério"
        />

        <InfoCard
          icon="🌍"
          variant="deep"
          title="Situações Especiais"
          description="Tornou-se residente no Brasil em 2025; possui trust ou contratos no exterior; tem aplicações financeiras no exterior; auferiu lucros/dividendos de entidades no exterior (Lei 14.754/2023)."
          examples={[
            { type: "inclui", text: "Médico com conta bancária no exterior (mesmo sem movimentação em 2025)" },
            { type: "inclui", text: "Aplicações financeiras fora do Brasil: ETFs, bonds, conta no Wise/Nomad" },
            { type: "inclui", text: "Participação em empresa no exterior (mesmo que minoritária)" },
            { type: "inclui", text: "Trust ou fundos no exterior em nome do contribuinte" },
            { type: "inclui", text: "Retornou ao Brasil em 2025 após residir no exterior" },
            { type: "inclui", text: "Dividendos recebidos de empresa estrangeira (tributados pela Lei 14.754/2023)" }
          ]}
          tip="A Lei 14.754/2023 mudou a tributação de offshores e fundos no exterior — quem tem ativos lá fora deve atenção redobrada"
        />
      </div>
    </section>
  );
}

