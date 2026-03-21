export default function Footer() {
  return (
    <footer className="footer bg-[#121445] text-white/50 py-12 px-6 text-center text-xs md:text-sm">
      <div className="max-w-4xl mx-auto space-y-3">
        <p className="text-white">
          <strong className="font-extrabold uppercase tracking-wider">INOVACONT</strong> — Portal IRPF 2026
        </p>
        <p>
          Informações baseadas na <strong>Instrução Normativa RFB nº 2.312, de 13/03/2026</strong> (DOU 16/03/2026). 
          Consulte a <a href="https://www.gov.br/receitafederal" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">Receita Federal do Brasil</a> para orientações oficiais.
        </p>

      </div>
    </footer>
  );
}
