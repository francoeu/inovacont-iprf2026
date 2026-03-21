"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: "00", hrs: "00", min: "00" });

  useEffect(() => {
    // Scroll trigger
    const handleScroll = () => {
      if (window.scrollY > 400 && !isClosed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Countdown logic
    const deadline = new Date("2026-05-30T23:59:59-03:00").getTime();
    
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) return;
      
      const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
      
      setTimeLeft({
        days: pad(diff / 86400000),
        hrs: pad((diff % 86400000) / 3600000),
        min: pad((diff % 3600000) / 60000),
      });
    };

    tick();
    const timer = setInterval(tick, 60000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, [isClosed]);

  if (isClosed) return null;

  return (
    <div id="sticky-bar" className={isVisible ? "visible" : ""}>
      <div className="flex items-center gap-6">
        <div className="sticky-logo hidden md:flex items-center justify-center p-1 bg-black rounded-full w-10 h-10 overflow-hidden">
          <img src="/inovacont-logo.png" alt="Inovacont" className="h-full w-auto object-contain" />
        </div>
        <div className="sticky-countdown hidden md:flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="sticky-cd-num">{timeLeft.days}</span>
            <span className="text-[9px] uppercase font-bold text-white/40">Dias</span>
          </div>
          <div className="text-white/20 font-bold mb-4">:</div>
          <div className="flex flex-col items-center">
            <span className="sticky-cd-num">{timeLeft.hrs}</span>
            <span className="text-[9px] uppercase font-bold text-white/40">Hrs</span>
          </div>
          <div className="text-white/20 font-bold mb-4">:</div>
          <div className="flex flex-col items-center">
            <span className="sticky-cd-num">{timeLeft.min}</span>
            <span className="text-[9px] uppercase font-bold text-white/40">Min</span>
          </div>
        </div>
        <div className="sticky-text text-white text-sm">
          <strong className="block md:inline">O prazo encerra em breve!</strong>{" "}
          <span className="hidden lg:inline text-white/60">
            Evite multas e garanta sua restituição antecipada.
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Link href="#simula" className="btn-primary py-2 px-4 text-xs">
          Simular Agora
        </Link>
        <Link
          href="https://wa.me/5511999999999"
          target="_blank"
          className="hidden sm:flex btn-outline py-2 px-4 text-xs border-green hover:bg-green/10"
        >
          Falar com Expert
        </Link>
        <button
          className="text-white/40 hover:text-white text-2xl px-2"
          onClick={() => {
            setIsClosed(true);
            setIsVisible(false);
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
