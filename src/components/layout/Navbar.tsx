"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-10 h-[72px] sticky top-0 z-[1001] bg-[rgba(26,20,96,0.95)] backdrop-blur-md border-b border-white/10">
        <div className="flex items-center">
          <div className="nav-badge-pill">IRPF 2026</div>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Links - Hidden on Mobile */}
          <ul className="hidden md:flex list-none gap-8 m-0 p-0">
            <li>
              <Link href="#quem-deve" className="text-white/70 hover:text-white font-semibold text-sm">Quem deve declarar</Link>
            </li>
            <li>
              <Link href="#prazos" className="text-white/70 hover:text-white font-semibold text-sm">Prazos e Multas</Link>
            </li>
            <li>
              <Link href="#faq" className="text-white/70 hover:text-white font-semibold text-sm">Dúvidas</Link>
            </li>
          </ul>
          
          <Link
            href="https://wa.me/5574999697652"
            target="_blank"
            className="bg-violet hover:bg-lavender text-white px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all shadow-lg shadow-violet/20"
          >
            <span className="hidden sm:inline">Falar com Contador</span>
            <span className="sm:hidden">WhatsApp</span>
          </Link>

          {/* Hamburger Toggle */}
          <button 
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 border border-white/10 rounded-lg bg-white/5 active:bg-white/10"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </nav>


      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[1000] bg-[#1A1060]/95 backdrop-blur-xl md:hidden transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <ul className="flex flex-col items-center justify-center h-full gap-8 text-xl font-bold text-white list-none">
          <li>
            <Link href="#quem-deve" onClick={() => setIsOpen(false)}>Quem deve declarar</Link>
          </li>
          <li>
            <Link href="#prazos" onClick={() => setIsOpen(false)}>Prazos e Multas</Link>
          </li>
          <li>
            <Link href="#faq" onClick={() => setIsOpen(false)}>Dúvidas Frequentes</Link>
          </li>
          <li>
            <Link 
              href="https://wa.me/5574999697652" 
              className="text-gold-lt"
              onClick={() => setIsOpen(false)}
            >
              Falar com Contador
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}


