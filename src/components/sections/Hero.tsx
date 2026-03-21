import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero hero-centered">
      <div className="hero-inner-centered">
        <div className="hero-logo-wrap">
          <img
            src="/inovacont-logo.png"
            className="hero-logo-img"
            alt="Inovacont"
          />
        </div>
        
        <div className="hero-urgency-pill">
          <div className="hero-urgency-dot"></div>
          Prazo aberto — entregue até 29/05/2026
        </div>

        <h1>
          Simulador IRPF 2026<br />
          <span style={{ color: 'var(--lavender)' }}>gratuito e preciso</span>
        </h1>

        <p style={{ maxWidth: '720px', margin: '0 auto 32px', color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
          Informe seus dados e descubra em minutos se você é obrigado a declarar, quanto vai pagar de IR e como pagar menos — com cálculo automático da Inovacont.
        </p>

        <div className="hero-btns hero-btns-centered">
          <Link href="#simulator" className="btn-hero-main">
            🧮 Simular agora — é gratuito
          </Link>
        </div>

        <div className="hero-check-row">
          <span>✓ Baseado na IN RFB 2.312/2026</span>
          <span>✓ Cálculo automático de INSS</span>
          <span>✓ Sem cadastro</span>
        </div>
      </div>
    </section>
  );
}
