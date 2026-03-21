import type { Metadata } from "next";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Simulador IRPF 2026 Gratuito — Inovacont",
  description: "Descubra se você é obrigado a declarar o IR 2026 e quanto vai pagar de forma imediata e gratuita.",
  openGraph: {
    type: "website",
    title: "Simulador IRPF 2026 Gratuito — Inovacont",
    description: "Descubra se você é obrigado a declarar o IR 2026 e quanto vai pagar. Cálculo automático de INSS, comparativo simplificado vs. deduções legais.",
    url: "https://inovacont.com.br/irpf2026",
    images: [{ url: "https://inovacont.com.br/og-irpf2026.png" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://inovacont.com.br/irpf2026",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
