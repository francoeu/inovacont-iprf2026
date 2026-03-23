"use client";

import { useEffect, useState } from "react";

export default function Prazos() {
  const [timeLeft, setTimeLeft] = useState<{
    days: string;
    hours: string;
    mins: string;
  }>({ days: "--", hours: "--", mins: "--" });

  useEffect(() => {
    const targetDate = new Date("2026-05-29T23:59:59-03:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", mins: "00" });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeLeft({
          days: d.toString().padStart(2, "0"),
          hours: h.toString().padStart(2, "0"),
          mins: m.toString().padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="prazos" className="prazo-section">
      <div className="prazo-inner">
        <div className="section-header">
          <span className="section-tag">Cronograma IRPF 2026</span>
          <h2>Prazos e penalidades 2026</h2>
          <p>
            Fique atento às datas oficiais da Receita Federal e evite multas por atraso na entrega da sua declaração.
          </p>
        </div>

        <div className="prazo-grid">
          <div className="timeline">
            {/* Step 1 */}
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-circle v">1</div>
                <div className="tl-vline"></div>
              </div>
              <div className="tl-card">
                <div className="tl-date-pill">FEVEREIRO 2026</div>
                <div className="tl-title">Informes de Rendimento</div>
                <div className="tl-desc">
                  Empresas e bancos têm até o último dia útil de fevereiro para entregar os informes necessários para sua declaração.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-circle v">2</div>
                <div className="tl-vline"></div>
              </div>
              <div className="tl-card">
                <div className="tl-date-pill">23 DE MARÇO</div>
                <div className="tl-title">Início das entregas</div>
                <div className="tl-desc">
                  Abertura oficial do prazo para transmissão da Declaração de Ajuste Anual IRPF 2026 à Receita Federal.
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-circle g">3</div>
                <div className="tl-vline"></div>
              </div>
              <div className="tl-card">
                <div className="tl-date-pill">ABRIL / MAIO</div>
                <div className="tl-title">Restituição em consulta</div>
                <div className="tl-desc">
                  Período para acompanhar o processamento e lote de restituição. Quem entrega cedo, recebe primeiro.
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-circle v">4</div>
                <div className="tl-vline"></div>
              </div>
              <div className="tl-card">
                <div className="tl-date-pill">29 DE MAIO (23h59)</div>
                <div className="tl-title">Encerramento do prazo</div>
                <div className="tl-desc">
                  Último dia para envio sem multa. O sistema da Receita Federal costuma apresentar lentidão nas horas finais.
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="tl-item">
              <div className="tl-left">
                <div className="tl-circle d">5</div>
              </div>
              <div className="tl-card red-border">
                <div className="tl-date-pill red">APÓS 29/05/2026</div>
                <div className="tl-title">Declaração em atraso — multa aplicada</div>
                <div className="tl-desc">
                  1% ao mês sobre o imposto devido, mínimo R$ 165,74, máximo 20% do imposto total. Multa aplicada mesmo sem imposto a pagar.
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="multa-card">
              <h3>⚠️ Custo do Atraso</h3>
              <div className="multa-item">
                <div className="multa-lbl">Multa Mínima (Art. 10)</div>
                <div className="multa-val">R$ 165,74</div>
                <div className="multa-sub">Mesmo sem imposto a pagar</div>
              </div>
              <div className="multa-item">
                <div className="multa-lbl">Multa por mês de atraso</div>
                <div className="multa-val">1% ao mês</div>
                <div className="multa-sub">Sobre o imposto devido</div>
              </div>
              <div className="multa-item">
                <div className="multa-lbl">Multa Máxima</div>
                <div className="multa-val">20%</div>
                <div className="multa-sub">Sobre o imposto total devido</div>
              </div>
            </div>

            <div className="prazo-cta-card">
              <div className="prazo-cta-glow"></div>
              <div className="prazo-cta-icon">🗓️</div>
              <p className="prazo-cta-title">Não deixe para a última hora</p>
              <p className="prazo-cta-text">
                Quanto antes você enviar, mais cedo recebe sua restituição. Fale com a Inovacont e garanta sua entrega.
              </p>
              
              <div className="prazo-cta-countdown">
                <div className="countdown-block">
                  <span>{timeLeft.days}</span>
                  <small>dias</small>
                </div>
                <div className="countdown-sep">:</div>
                <div className="countdown-block">
                  <span>{timeLeft.hours}</span>
                  <small>horas</small>
                </div>
                <div className="countdown-sep">:</div>
                <div className="countdown-block">
                  <span>{timeLeft.mins}</span>
                  <small>min</small>
                </div>
              </div>
              
              <p className="prazo-cta-until">Prazo final: 29/05/2026 às 23h59</p>
              
              <a 
                href="https://wa.me/5574999697652?text=Olá!+Quero+declarar+meu+IRPF+2026+com+a+Inovacont+antes+do+prazo." 
                target="_blank" 
                className="prazo-cta-btn"
                rel="noopener noreferrer"
              >
                💬 Declarar com a Inovacont
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
