"use client";

import { useState, useMemo } from "react";
import { formatBRL, calculatePF, calculatePJ } from "@/lib/irpf-calculator";

export default function CalcPFvsPJ() {
  const [income, setIncome] = useState(15000);
  const [regime, setRegime] = useState<"simples" | "lucropres">("simples");
  const [proLabore, setProLabore] = useState(4200);

  const pf = useMemo(() => calculatePF(income), [income]);
  const pj = useMemo(() => calculatePJ(income, proLabore, regime), [income, proLabore, regime]);

  // Hybrid scenario (Simplified logic based on 1:1 migration)
  const hib = useMemo(() => {
    const fatPF = Math.min(3530, income);
    const fatPJ = Math.max(0, income - fatPF);
    const pfPart = calculatePF(fatPF);
    const pjPart = calculatePJ(fatPJ, proLabore * (fatPJ / income || 0), regime);
    
    return {
      total: pfPart.total + pjPart.total,
      liquido: income - (pfPart.total + pjPart.total)
    };
  }, [income, proLabore, regime]);

  const economy = pf.total - pj.total;

  return (
    <section id="comparativo" className="calc-section">
      <div className="calc-section-inner">
        <div className="calc-section-header">
          <span className="section-tag">Análise Estratégica</span>
          <h2>PF x PJ x Híbrido</h2>
          <p>
            Entenda por que empresários e freelancers economizam até 70% em
            impostos ao sair da Pessoa Física.
          </p>
        </div>

        <div className="calc-wrapper">
          <aside className="calc-inputs">
            <div className="calc-inputs-title">Sua Renda Bruta</div>
            <div className="calc-field">
              <label>
                Renda Mensal <span>{formatBRL(income)}</span>
              </label>
              <input
                type="range"
                className="calc-range"
                min="3000"
                max="80000"
                step="500"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
            </div>

            <div className="calc-field">
              <label>
                Pró-labore <span>{formatBRL(proLabore)}</span>
              </label>
              <input
                type="range"
                className="calc-range"
                min="1412"
                max={income}
                step="100"
                value={proLabore}
                onChange={(e) => setProLabore(Number(e.target.value))}
              />
            </div>

            <div className="calc-divider"></div>

            <div className="calc-regime">
              <button
                className={`calc-regime-btn ${regime === "simples" ? "active" : ""}`}
                onClick={() => setRegime("simples")}
              >
                Simples Nac.
                <span className="calc-regime-sub">Anexo III/V</span>
              </button>
              <button
                className={`calc-regime-btn ${regime === "lucropres" ? "active" : ""}`}
                onClick={() => setRegime("lucropres")}
              >
                Lucro Pres.
                <span className="calc-regime-sub">16,3% médio</span>
              </button>
            </div>
          </aside>

          <div className="calc-results">
            <div className="calc-cards-triple">
              {/* PF Card */}
              <div className="calc-card-t pf-card">
                <div className="calc-card-t-header">
                  <span className="calc-card-t-badge">Pessoa Física</span>
                  <span className="calc-card-t-tag pf-tag">Autônomo</span>
                </div>
                <div className="calc-card-t-row">
                  <span>Imposto (IRPF)</span>
                  <span>{formatBRL(pf.ir)}</span>
                </div>
                <div className="calc-card-t-row">
                  <span>INSS (20%)</span>
                  <span>{formatBRL(pf.inss)}</span>
                </div>
                <div className="calc-card-t-row">
                  <span>ISS (5%)</span>
                  <span>{formatBRL(pf.iss)}</span>
                </div>
                <div className="calc-card-t-net">
                  <div className="net-label">Líquido Final</div>
                  <div className="net-val">{formatBRL(pf.liquido)}</div>
                  <div className="net-pct">Carga: {((pf.total / income) * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* PJ Card */}
              <div className="calc-card-t pj-card">
                {pj.liquido > pf.liquido && pj.liquido > hib.liquido && (
                  <div className="calc-winner-badge">🏆 MELHOR OPÇÃO</div>
                )}
                <div className="calc-card-t-header">
                  <span className="calc-card-t-badge">Pessoa Jurídica</span>
                  <span className="calc-card-t-tag pj-tag">Empresa</span>
                </div>
                <div className="calc-card-t-row">
                  <span>Imposto DAS/LP</span>
                  <span>{formatBRL(pj.impEmp)}</span>
                </div>
                <div className="calc-card-t-row">
                  <span>INSS Pró-labore</span>
                  <span>{formatBRL(pj.inssProL)}</span>
                </div>
                <div className="calc-card-t-row">
                  <span>IRPF Pró-labore</span>
                  <span>{formatBRL(pj.irProL)}</span>
                </div>
                <div className="calc-card-t-net">
                  <div className="net-label">Líquido Final</div>
                  <div className="net-val">{formatBRL(pj.liquido)}</div>
                  <div className="net-pct">Carga: {((pj.total / income) * 100).toFixed(1)}%</div>
                </div>
                {economy > 0 && (
                  <div className="calc-card-t-note">
                    Economia de <strong>{formatBRL(economy)}</strong>/mês
                  </div>
                )}
              </div>

              {/* Hybrid Card */}
              <div className="calc-card-t hib-card">
                <div className="calc-card-t-header">
                  <span className="calc-card-t-badge">Cenário Híbrido</span>
                  <span className="calc-card-t-tag hib-tag">PJ + PF</span>
                </div>
                <div className="calc-card-t-row">
                  <span>Total Impostos</span>
                  <span>{formatBRL(hib.total)}</span>
                </div>
                <div className="calc-card-t-net">
                  <div className="net-label">Líquido Final</div>
                  <div className="net-val">{formatBRL(hib.liquido)}</div>
                  <div className="net-pct">Carga: {((hib.total / income) * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
