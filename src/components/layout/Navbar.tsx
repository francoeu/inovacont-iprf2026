import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <div className="nav-badge-pill">IRPF 2026</div>
      <ul className="nav-links hidden md:flex">
        <li>
          <Link href="#quem-deve">Quem deve declarar</Link>
        </li>
        <li>
          <Link href="#prazos">Prazos e Multas</Link>
        </li>
        <li>
          <Link href="#faq">Dúvidas</Link>
        </li>
        <li>
          <Link
            href="https://wa.me/5574999697652"
            target="_blank"
            className="nav-cta"
          >
            Falar com Contador
          </Link>
        </li>
      </ul>
    </nav>
  );
}
