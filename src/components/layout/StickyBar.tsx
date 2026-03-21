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
    <div id="sticky-bar" className={`flex flex-col md:flex-row items-center justify-between gap-3 md:gap-16 px-4 md:px-8 py-3 md:py-3.5 ${isVisible ? "visible" : ""}`}>
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto overflow-hidden">
        {/* Logo - Hidden on very small screens to save space */}
        <div className="sticky-logo hidden sm:flex items-center justify-center p-1 bg-black rounded-full w-9 h-9 overflow-hidden flex-shrink-0">
          <img src="/inovacont-logo.png" alt="Inovacont" className="h-full w-auto object-contain" />
        </div>

        {/* Countdown - Now shown on mobile in a simplified way */}
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-gold-lt font-mono font-bold text-base leading-none">{timeLeft.days}</span>
            <span className="text-[10px] uppercase font-bold text-white/30">d</span>
          </div>
          <div className="text-white/20 font-bold">:</div>
          <div className="flex items-center gap-1">
            <span className="text-gold-lt font-mono font-bold text-base leading-none">{timeLeft.hrs}</span>
            <span className="text-[10px] uppercase font-bold text-white/30">h</span>
          </div>
          <div className="text-white/20 font-bold">:</div>
          <div className="flex items-center gap-1">
            <span className="text-gold-lt font-mono font-bold text-base leading-none">{timeLeft.min}</span>
            <span className="text-[10px] uppercase font-bold text-white/30">m</span>
          </div>
        </div>

        <div className="sticky-text text-white text-xs md:text-sm truncate">
          <strong className="inline">Prazo Aberto!</strong>{" "}
          <span className="hidden lg:inline text-white/60">
            Garanta sua restituição e evite multas.
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
