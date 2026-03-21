"use client";

export default function Jornada() {
  const steps = [
    {
      num: 1,
      title: "Fale com a gente",
      desc: "Entre em contato pelo WhatsApp. Um especialista em IRPF identifica sua situação — CLT, PJ, MEI, aposentado ou combinações — e informa o que você precisa reunir.",
      icon: "📲",
    },
    {
      num: 2,
      title: "Envie os documentos",
      desc: "Você encaminha os informes de rendimento, recibos de saúde e demais comprovantes pelo WhatsApp ou e-mail. Sem visitas, sem papelada — de qualquer lugar do Brasil.",
      icon: "📄",
    },
    {
      num: 3,
      title: "Revisão e otimização",
      desc: "Nossa equipe analisa todas as deduções legais — INSS, dependentes, saúde, educação — e escolhe a forma de tributação mais vantajosa para você pagar menos IR.",
      icon: "🧮",
    },
    {
      num: 4,
      title: "Declaração enviada",
      desc: "Transmitimos sua declaração à Receita Federal dentro do prazo e enviamos o recibo de entrega. Você acompanha os lotes de restituição com nossa orientação.",
      icon: "✅",
    },
  ];

  return (
    <section className="jornada-section py-24 bg-white overflow-hidden">
      <div className="jornada-inner max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <span className="text-[10px] font-bold text-violet uppercase tracking-[0.2em] mb-4 block">
            DECLARAÇÃO IRPF 2026 — PASSO A PASSO
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#121445] mb-6 leading-tight">
            Como declarar o seu IR<br />com a Inovacont
          </h2>
          <p className="text-sub text-base max-w-2xl mx-auto leading-relaxed opacity-80">
            100% digital, sem burocracia e com prazo garantido. Você envia os documentos e nós cuidamos do resto.
          </p>
        </div>

        {/* Steps Timeline Area */}
        <div className="relative mb-24">
          {/* Horizontal Connection Line */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] h-[2px] bg-violet/10 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                {/* Step Circle */}
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-violet/30 mb-8 transition-all duration-500 bg-white text-violet group-hover:border-violet group-hover:shadow-[0_10px_30px_rgba(139,120,239,0.1)]"
                >
                  <span className="text-2xl font-black">{step.num}</span>
                </div>
                
                {/* Icon */}
                <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-extrabold text-[#121445] mb-3">{step.title}</h3>
                <p className="text-[13px] text-sub leading-relaxed px-4">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Area */}
        <div className="flex flex-col items-center gap-6 pt-12 animate-slide-up">
          <a
            href="https://wa.me/5574999697652?text=Olá!+Quero+declarar+meu+IRPF+2026+com+a+Inovacont.+Como+funciona?"
            target="_blank"
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-10 py-5 rounded-full font-extrabold text-lg shadow-[0_15px_35px_rgba(37,211,102,0.3)] active:scale-95 transition-all"
            rel="noopener noreferrer"
          >
            <span className="text-2xl">💬</span>
            Quero declarar com a Inovacont
          </a>
          <span className="text-[11px] font-bold text-gray-400 border-t border-gray-100 pt-6 w-full max-w-md text-center">
            Prazo até 29/05/2026 · Atendimento via WhatsApp · Todo o Brasil
          </span>
        </div>
      </div>
    </section>
  );
}
