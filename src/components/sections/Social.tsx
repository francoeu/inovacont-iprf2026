"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(end: number, duration: number = 2000, startAtZero = false) {
  const [count, setCount] = useState(startAtZero ? 0 : end);
  const ref = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(progress * end);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

export default function Social() {
  const stats = [
    { target: 250, suffix: "+", label: "Clientes Atendidos", id: "cnt-clientes" },
    { target: 10, suffix: "", label: "Estados em Atendimento", id: "cnt-estados" },
    { target: 4.9, suffix: "/5", label: "Avaliação Google Business", id: "cnt-nota", decimals: 1 },
    { target: 3, suffix: "+", label: "Anos de Mercado Digital", id: "cnt-anos" },
  ];

  const testimonials = [
    {
      name: "Mariana Silva",
      role: "Designer Freelancer",
      text: "Eu sempre tinha dúvidas se precisava declarar. O simulador é muito prático e me ajudou a entender o meu cenário.",
    },
    {
      name: "João Pereira",
      role: "Engenheiro CLT",
      text: "Ficou muito fácil ver a economia com as deduções fiscais. Usei o resultado para me planejar com o contador.",
    },
    {
      name: "Ricardo Mendes",
      role: "Proprietário MEI",
      text: "Excelente ferramenta. Rápida e com as regras mais atuais. Recomendo para todos os meus parceiros.",
    },
  ];

  return (
    <section className="social-section bg-white">
      <div className="social-inner max-w-7xl mx-auto px-6">
        <div className="social-header text-center mb-16">
          <span className="section-tag">Depoimentos & Números</span>
          <h2 className="text-4xl font-extrabold text-deep">
            Milhares de <em>Brasileiros</em> Protegidos
          </h2>
          <p className="text-sub mt-4 max-w-2xl mx-auto">
            A Inovacont já ajudou freelancers, empresários e profissionais liberais a economizarem
            tempo e dinheiro na hora da declaração.
          </p>
        </div>

        <div className="social-numbers grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        <div className="depo-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((depo, i) => (
            <div key={i} className="depo-card bg-bg border-none shadow-sm hover:shadow-md transition-shadow">
              <div className="depo-stars text-gold mb-4">★★★★★</div>
              <p className="depo-text italic text-sub mb-8 leading-relaxed">
                &ldquo;{depo.text}&rdquo;
              </p>
              <div className="depo-author flex items-center gap-3">
                <div className="depo-avatar w-10 h-10 rounded-full bg-violet text-white flex items-center justify-center font-bold">
                  {depo.name.charAt(0)}
                </div>
                <div>
                  <div className="depo-name font-bold text-deep text-sm">{depo.name}</div>
                  <div className="depo-role text-[10px] text-muted uppercase font-bold tracking-wider">
                    {depo.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ target, suffix, label, decimals = 0 }: any) {
  const { count, ref } = useCountUp(target, 2000, true);
  
  return (
    <div ref={ref} className="social-num-card hover:border-violet/30 transition-colors">
      <div className="social-num text-3xl font-extrabold text-violet">
        {decimals ? count.toFixed(decimals) : Math.floor(count)}{suffix}
      </div>
      <div className="text-[10px] font-bold text-sub uppercase tracking-widest mt-2">{label}</div>
    </div>
  );
}
