"use client";

export default function Especialistas() {
  return (
    <section className="merch-section" id="inovacont">
      <div className="merch-inner">
        <div className="merch-left">
          <div className="merch-badge">Contabilidade Digital</div>
          <h2>
            Especialistas em<br />
            <em>profissionais da saúde</em>
          </h2>
          <p>
            A Inovacont é uma contabilidade 100% digital, especializada em médicos, dentistas, psicólogos e demais profissionais liberais da área da saúde. Atendemos em todo o Brasil com agilidade, segurança e linguagem simples.
          </p>
          <ul className="merch-list">
            <li>✅ Declaração do IRPF feita por especialistas</li>
            <li>✅ Gestão contábil para PJ médica e clínicas</li>
            <li>✅ Planejamento tributário personalizado</li>
            <li>✅ Atendimento 100% digital — em todo o Brasil</li>
            <li>✅ Suporte por WhatsApp com agilidade</li>
          </ul>
          <a
            href="https://wa.me/5574999697652?text=Olá!+Quero+conhecer+os+serviços+da+Inovacont."
            target="_blank"
            className="merch-btn"
            rel="noopener noreferrer"
          >
            💬 Falar com um especialista agora
          </a>
        </div>
        <div className="merch-right">
          <div className="merch-card">
            <div className="merch-card-icon-wrap" style={{ background: 'rgba(96,165,250,0.1)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgb(96,165,250)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px' }}>
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <div className="merch-card-title">Profissionais da saúde</div>
              <p>Médicos, dentistas, psicólogos, fisioterapeutas e mais. Entendemos as particularidades tributárias da sua área.</p>
            </div>
          </div>

          <div className="merch-card">
            <div className="merch-card-icon-wrap" style={{ background: 'rgba(167,139,250,0.1)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgb(167,139,250)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px' }}>
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <div>
              <div className="merch-card-title">Pessoa Jurídica</div>
              <p>Abertura de PJ médica, gestão do pró-labore, distribuição de lucros e enquadramento tributário ideal.</p>
            </div>
          </div>

          <div className="merch-card">
            <div className="merch-card-icon-wrap" style={{ background: 'rgba(52,211,153,0.1)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="rgb(52,211,153)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px' }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <div className="merch-card-title">Todo o Brasil</div>
              <p>Atendemos de forma 100% digital, sem burocracia. Você cuida dos seus pacientes, nós cuidamos da sua contabilidade.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
