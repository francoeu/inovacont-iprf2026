import Navbar from "@/components/layout/Navbar";
import AlertLegal from "@/components/layout/AlertLegal";
import Hero from "@/components/sections/Hero";
import StatsBar from "@/components/sections/StatsBar";
import QuemDeve from "@/components/sections/QuemDeve";
import Prazos from "@/components/sections/Prazos";
import Especialistas from "@/components/sections/Especialistas";
import Jornada from "@/components/sections/Jornada";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";
import StickyBar from "@/components/layout/StickyBar";
import Simulator from "@/components/simulator/Simulator";
import ReadProgress from "@/components/layout/ReadProgress";
import Social from "@/components/sections/Social";
import CalcPFvsPJ from "@/components/sections/CalcPFvsPJ";

export default function Home() {
  return (
    <main className="min-h-screen">
      <ReadProgress />
      <Navbar />
      <AlertLegal />
      <Hero />
      <StatsBar />

      <QuemDeve />
      <Simulator />
      <Prazos />
      <Jornada />
      <FAQ />

      <Footer />
      <StickyBar />
    </main>
  );
}
