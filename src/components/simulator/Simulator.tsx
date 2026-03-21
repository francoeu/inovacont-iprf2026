"use client";

import { useState } from "react";
import { IRPF_RULES, formatBRL, calculateAnnual2026, calculateMonthlyCLT } from "@/lib/irpf-calculator";
import { saveLead } from "@/app/actions";

type Step = 0 | 1 | 2 | 3 | 4;

interface FormData {
  vinculos: string[];
  // CLT
  salarioMensal: number;
  mesesTrabalhados: number;
  recebeu13: "completo" | "proporcional" | "nao";
  // Liberal
  rendimentoLiberal: number;
  // PJ / MEI / Outros
  rendimentoIsento: number;
  // Patrimonio
  patrimonio: number;
  operouBolsa: "sim" | "nao";
  vendeuBem: "sim" | "nao";
  // Deducoes
  dependentes: number;
  gastosSaude: number;
  gastosEducacao: number;
  tipoCalculo: "simplificado" | "completo" | "automatico";
  // Situacoes Especiais
  situacoes: string[];

  email: string;
  whatsapp: string;
}

export default function Simulator() {
  const [step, setStep] = useState<Step>(0);
  const [formData, setFormData] = useState<FormData>({
    vinculos: [],
    salarioMensal: 0,
    mesesTrabalhados: 12,
    recebeu13: "completo",
    rendimentoLiberal: 0,
    rendimentoIsento: 0,
    patrimonio: 0,
    operouBolsa: "nao",
    vendeuBem: "nao",
    dependentes: 0,
    gastosSaude: 0,
    gastosEducacao: 0,
    tipoCalculo: "automatico",
    situacoes: [],
    email: "",
    whatsapp: "",
  });

  const next = () => {
    setStep((s) => (s + 1) as Step);
    const top = document.getElementById('simulator')?.offsetTop ? document.getElementById('simulator')!.offsetTop - 80 : 0;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  const prev = () => setStep((s) => (s - 1) as Step);

  const stepsLabels = ["Vínculo", "Rendimentos", "Patrimônio", "Deduções", "Resultado"];

  return (
    <section id="simulator" className="simulator-section py-24 relative overflow-hidden" style={{ background: 'var(--deep)' }}>
      {/* Decorative Glow */}
      <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-violet/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="simulator-inner max-w-[1100px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag" style={{ color: 'var(--soft)', fontSize: '11px', letterSpacing: '0.15em' }}>
            ■ SIMULADOR PASSO A PASSO
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-4 leading-tight">
            Preencha e descubra<br />
            <span style={{ color: 'var(--gold-lt)' }}>seu resultado em segundos</span>
          </h2>
          <p className="text-white/50 text-base max-w-[640px] mx-auto leading-relaxed">
            Responda as perguntas abaixo. O simulador calcula automaticamente o INSS, compara as formas de tributação e mostra se você precisa declarar.
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="progress-wrap mb-10 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <div className="progress-steps relative flex justify-between items-start">
            {/* V-Line Connection */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10 z-0"></div>
            <div 
              className="absolute top-5 left-0 h-[2px] bg-violet transition-all duration-500 z-0"
              style={{ width: `${(step / (stepsLabels.length - 1)) * 100}%` }}
            ></div>
            
            {stepsLabels.map((label, i) => (
              <div key={i} className="flex flex-col items-center gap-3 z-10 w-20">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    i <= step ? "bg-violet text-white shadow-lg shadow-violet/30" : "bg-white/10 text-white/40"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${
                  i <= step ? "text-white" : "text-white/30"
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="sim-card bg-white rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)] border border-white/10">
          {/* Card Header (Dynamic per step) */}
          <div className="sim-card-header bg-[#120A45] px-8 py-5 text-white flex items-center gap-4 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-violet flex items-center justify-center font-bold text-sm">
              {step + 1}
            </div>
            <h3 className="text-sm font-bold tracking-wider uppercase">
            {step === 0 && "1. Qual seu vínculo profissional em 2025?"}
            {step === 1 && "2. Rendimentos: CLT + Profissional Liberal"}
            {step === 2 && "3. Seu patrimônio e outros rendimentos"}
            {step === 3 && "4. Suas deduções e situações especiais"}
            {step === 4 && "5. Confira seu resultado IRPF 2026"}
            </h3>
          </div>

          <div className="sim-card-body p-8 md:p-10">
            {step === 0 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h4 className="text-xl font-extrabold text-deep mb-2">De onde vieram seus rendimentos em 2025?</h4>
                  <p className="text-sub text-sm">Selecione todas que se aplicam. MEI e PJ não podem ser escolhidos juntos.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <VinculoOption
                    icon="💼"
                    title="CLT"
                    desc="Empregado com carteira assinada. INSS retido pelo empregador."
                    active={formData.vinculos.includes("clt")}
                    onClick={() => toggleVinculo("clt")}
                  />
                  <VinculoOption
                    icon="👨‍⚕️"
                    title="Profissional Liberal / Autônomo"
                    desc="Emite RPA, recibo ou NFS-e no CPF. INSS como contribuinte individual (20%)."
                    active={formData.vinculos.includes("liberal")}
                    onClick={() => toggleVinculo("liberal")}
                  />
                  <VinculoOption
                    icon="🏢"
                    title="PJ — Pessoa Jurídica"
                    desc="Recebe pró-labore como sócio de empresa. Distribui lucros isentos. Incompatível com MEI."
                    active={formData.vinculos.includes("pj")}
                    onClick={() => toggleVinculo("pj")}
                  />
                  <VinculoOption
                    icon="🏅"
                    title="Aposentado / Pensionista"
                    desc="Benefício INSS, previdência privada ou pensão alimentícia."
                    active={formData.vinculos.includes("apo")}
                    onClick={() => toggleVinculo("apo")}
                  />
                  <VinculoOption
                    icon="🌕"
                    title="MEI — Microempreendedor"
                    desc="Lucro presumido isento (32% serviços ou 8% comércio). DAS fixo mensal. Incompatível com PJ."
                    active={formData.vinculos.includes("mei")}
                    onClick={() => toggleVinculo("mei")}
                  />
                </div>

                <div className="flex justify-end pt-6 border-top border-gray-100">
                  <button 
                    onClick={next} 
                    disabled={formData.vinculos.length === 0}
                    className="bg-[#120A45] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-deep transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo →
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in">
                {/* CLT Section */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-lg">🏙️</span>
                    <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua renda como CLT</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[13px] font-bold text-deep mb-3">Qual era o seu salário bruto mensal em 2025?</label>
                      <div className="relative max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                        <input
                          type="number"
                          value={formData.salarioMensal || ""}
                          onChange={(e) => setFormData({...formData, salarioMensal: parseFloat(e.target.value) || 0})}
                          className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-deep mb-3">Recebeu 13º salário em 2025?</label>
                      <div className="space-y-2">
                        <RadioOption 
                          label="Sim — recebi o 13º completo"
                          sub="Tributação exclusiva na fonte (Art. 700 RIR/2018). Não altera o IR do ajuste anual."
                          active={formData.recebeu13 === "completo"}
                          onClick={() => setFormData({...formData, recebeu13: "completo"})}
                        />
                        <RadioOption 
                          label="Sim — proporcional (demissão ou admissão no ano)"
                          sub="Tributação exclusiva na fonte. Informe o valor para fins de declaração."
                          active={formData.recebeu13 === "proporcional"}
                          onClick={() => setFormData({...formData, recebeu13: "proporcional"})}
                        />
                        <RadioOption 
                          label="Não recebi 13º em 2025"
                          active={formData.recebeu13 === "nao"}
                          onClick={() => setFormData({...formData, recebeu13: "nao"})}
                        />
                      </div>
                    </div>

                    {formData.salarioMensal > 0 && (
                      <CLTMonthlyEstimate salario={formData.salarioMensal} />
                    )}
                  </div>
                </div>

                {/* Liberal Section */}
                <div className="pt-8 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-lg">🩺</span>
                    <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua renda como profissional liberal / autônomo</h4>
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Total recebido como autônomo ou profissional liberal em 2025</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <input
                        type="number"
                        value={formData.rendimentoLiberal || ""}
                        onChange={(e) => setFormData({...formData, rendimentoLiberal: parseFloat(e.target.value) || 0})}
                        className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
                        placeholder="0,00"
                      />
                    </div>
                    <p className="mt-3 text-[11px] text-gray-400">Some todos os honorários, RPA e notas fiscais emitidas no CPF. O INSS será calculado como contribuinte individual (20%).</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-10 mt-10 border-t border-gray-100">
                  <button onClick={prev} className="text-gray-500 font-bold hover:text-deep transition-colors">← Voltar</button>
                  <button onClick={next} className="bg-[#120A45] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-deep transition-all shadow-lg">Próximo →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-deep mb-2">O que você tinha e recebeu em 2025?</h4>
                  <p className="text-sub text-sm">Preencha o que se aplica. Deixe em branco o que não tiver.</p>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Qual era o valor total dos seus bens e direitos em 31/12/2025?</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <input
                        type="number"
                        value={formData.patrimonio || ""}
                        onChange={(e) => setFormData({...formData, patrimonio: parseFloat(e.target.value) || 0})}
                        className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
                        placeholder="0,00"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400">Some imóveis (pelo custo de aquisição), veículos, investimentos, saldos e participações societárias.</p>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Recebeu rendimentos isentos ou tributados na fonte em 2025?</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <input
                        type="number"
                        value={formData.rendimentoIsento || ""}
                        onChange={(e) => setFormData({...formData, rendimentoIsento: parseFloat(e.target.value) || 0})}
                        className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
                        placeholder="0,00"
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400 italic">Ex.: PLR, FGTS sacado, poupança, LCI/LCA, dividendos, heranças, indenizações, distribuição de lucros da PJ. O 13º salário já é informado no bloco CLT.</p>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Operou em bolsa de valores em 2025?</label>
                    <div className="space-y-2">
                      <RadioOption 
                        label="Sim — operações acima de R$ 40.000 ou com ganho líquido tributável"
                        active={formData.operouBolsa === "sim"}
                        onClick={() => setFormData({...formData, operouBolsa: "sim"})}
                      />
                      <RadioOption 
                        label="Não operou em bolsa"
                        active={formData.operouBolsa === "nao"}
                        onClick={() => setFormData({...formData, operouBolsa: "nao"})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Vendeu algum imóvel, veículo ou bem em 2025?</label>
                    <div className="space-y-2">
                      <RadioOption 
                        label="Sim — houve alienação de bens ou direitos"
                        active={formData.vendeuBem === "sim"}
                        onClick={() => setFormData({...formData, vendeuBem: "sim"})}
                      />
                      <RadioOption 
                        label="Não"
                        active={formData.vendeuBem === "nao"}
                        onClick={() => setFormData({...formData, vendeuBem: "nao"})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-10 mt-10 border-t border-gray-100">
                  <button onClick={prev} className="text-gray-500 font-bold hover:text-deep transition-colors">← Voltar</button>
                  <button onClick={next} className="bg-[#120A45] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-deep transition-all shadow-lg">Próximo →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-deep mb-2">O que pode ser deduzido do seu IR?</h4>
                  <p className="text-sub text-sm">Quanto mais preencher, mais precisa será a estimativa.</p>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Quantos dependentes você tem? (filhos, cônjuge, pais etc.)</label>
                    <input
                      type="number"
                      value={formData.dependentes}
                      onChange={(e) => setFormData({...formData, dependentes: parseInt(e.target.value) || 0})}
                      className="w-32 bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 px-4 font-bold text-deep transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Quanto gastou com saúde em 2025? (médicos, plano de saúde, exames — sem limite de dedução)</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <input
                        type="number"
                        value={formData.gastosSaude || ""}
                        onChange={(e) => setFormData({...formData, gastosSaude: parseFloat(e.target.value) || 0})}
                        className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Quanto gastou com educação em 2025? (limite de R$ 3.561,50 por pessoa)</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <input
                        type="number"
                        value={formData.gastosEducacao || ""}
                        onChange={(e) => setFormData({...formData, gastosEducacao: parseFloat(e.target.value) || 0})}
                        className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Como deseja calcular o imposto?</label>
                    <div className="space-y-2">
                      <RadioOption 
                        label="📑 Desconto simplificado — 20% da renda bruta"
                        sub="Substitui todas as deduções. Mais simples, ideal para quem tem poucas despesas dedutíveis."
                        active={formData.tipoCalculo === "simplificado"}
                        onClick={() => setFormData({...formData, tipoCalculo: "simplificado"})}
                      />
                      <RadioOption 
                        label="📂 Deduzir despesas reais — INSS, dependentes, saúde e educação"
                        sub="Pode ser mais vantajoso para quem tem muitas despesas dedutíveis."
                        active={formData.tipoCalculo === "completo"}
                        onClick={() => setFormData({...formData, tipoCalculo: "completo"})}
                      />
                      <RadioOption 
                        label="🔄 Calcular as duas opções e mostrar a mais vantajosa"
                        sub="O simulador compara e indica automaticamente a melhor opção."
                        active={formData.tipoCalculo === "automatico"}
                        onClick={() => setFormData({...formData, tipoCalculo: "automatico"})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Possui alguma situação especial?</label>
                    <div className="space-y-2">
                      <CheckOption 
                        label="Possui ativos, trust ou aplicações financeiras no exterior (Lei 14.754/2023)"
                        active={formData.situacoes.includes("exterior")}
                        onClick={() => toggleSituacao("exterior")}
                      />
                      <CheckOption 
                        label="Passou à condição de residente no Brasil em algum mês de 2025"
                        active={formData.situacoes.includes("residente")}
                        onClick={() => toggleSituacao("residente")}
                      />
                      <CheckOption 
                        label="Teve receita de atividade rural em 2025"
                        active={formData.situacoes.includes("rural")}
                        onClick={() => toggleSituacao("rural")}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-10 mt-10 border-t border-gray-100">
                  <button onClick={prev} className="text-gray-500 font-bold hover:text-deep transition-colors">← Voltar</button>
                  <button onClick={next} className="bg-[#120A45] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-deep transition-all shadow-lg">Ver resultado →</button>
                </div>
              </div>
            )}

            {step === 4 && <Result data={formData} reset={() => setStep(0)} />}
          </div>
        </div>
      </div>
    </section>
  );

  function toggleSituacao(val: string) {
    const list = formData.situacoes.includes(val)
      ? formData.situacoes.filter((v) => v !== val)
      : [...formData.situacoes, val];
    setFormData({ ...formData, situacoes: list });
  }

  function toggleVinculo(val: string) {
    if (val === 'mei' && formData.vinculos.includes('pj')) return;
    if (val === 'pj' && formData.vinculos.includes('mei')) return;

    const list = formData.vinculos.includes(val)
      ? formData.vinculos.filter((v) => v !== val)
      : [...formData.vinculos, val];
    setFormData({ ...formData, vinculos: list });
  }
}

function RadioOption({ label, sub, active, onClick }: { label: string; sub?: string; active: boolean; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex gap-4 items-start ${
        active ? "bg-bg border-violet" : "bg-bg/50 border-transparent hover:border-gray-200"
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
        active ? "border-violet" : "border-gray-300"
      }`}>
        {active && <div className="w-2.5 h-2.5 rounded-full bg-violet"></div>}
      </div>
      <div>
        <div className={`text-[13px] font-bold ${active ? "text-deep" : "text-sub"}`}>{label}</div>
        {sub && <div className="text-[11px] text-gray-400 mt-1 leading-snug">{sub}</div>}
      </div>
    </div>
  );
}

function CLTMonthlyEstimate({ salario }: { salario: number }) {
  const { inss, baseIR, ir, liquido } = calculateMonthlyCLT(salario);

  return (
    <div className="bg-bg/50 border border-violet/20 rounded-2xl p-6 animate-fade-in my-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm">🗳️</span>
        <h5 className="text-[11px] font-bold text-violet uppercase tracking-widest">Estimativa Mensal CLT</h5>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-sub">Salário bruto</span>
          <span className="font-bold text-deep">{formatBRL(salario)}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-sub">(-) INSS progressivo 2025</span>
          <span className="font-bold text-red-500">- {formatBRL(inss)}</span>
        </div>
        <div className="border-t border-violet/5 my-2"></div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-sub font-bold">= Base IR</span>
          <span className="font-bold text-deep">{formatBRL(baseIR)}</span>
        </div>
        <div className="flex justify-between items-center text-[13px]">
          <span className="text-sub">(-) IR mensal estimado</span>
          <span className="font-bold text-red-500">- {formatBRL(ir)}</span>
        </div>
        
        <div className="mt-4 pt-4 border-t border-violet/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-base">💵</span>
            <span className="text-sm font-bold text-deep">Líquido estimado</span>
          </div>
          <span className="text-lg font-extrabold text-violet">{formatBRL(liquido)}</span>
        </div>
      </div>
    </div>
  );
}

function CheckOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex gap-4 items-center ${
        active ? "bg-bg border-violet" : "bg-bg/50 border-transparent hover:border-gray-200"
      }`}
    >
      <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${
        active ? "bg-violet border-violet text-white" : "bg-white border-gray-300"
      }`}>
        {active && <span className="text-[10px] font-bold">✓</span>}
      </div>
      <div className={`text-[13px] font-bold ${active ? "text-deep" : "text-sub"}`}>{label}</div>
    </div>
  );
}

function VinculoOption({
  icon,
  title,
  desc,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 select-none group min-h-[140px] ${
        active 
          ? "bg-[#F4F2FF] border-violet shadow-lg shadow-violet/10" 
          : "bg-white border-gray-100 hover:border-soft"
      }`}
    >
      <div 
        className={`absolute top-4 right-4 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
          active ? "bg-violet border-violet text-white" : "bg-white border-gray-300"
        }`}
      >
        {active && <span className="text-[10px] font-bold">✓</span>}
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="text-3xl filter group-hover:scale-110 transition-transform">{icon}</div>
        <div>
          <h4 className="font-extrabold text-deep text-[15px] mb-1">{title}</h4>
          <p className="text-sub text-[12px] leading-snug">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Result({ data, reset }: { data: FormData; reset: () => void }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const calc = calculateAnnual2026({
    salarioMensal: data.salarioMensal,
    mesesTrabalhados: data.mesesTrabalhados,
    recebeu13: data.recebeu13,
    rendimentoLiberal: data.rendimentoLiberal,
    dependentes: data.dependentes,
    gastosSaude: data.gastosSaude,
    gastosEducacao: data.gastosEducacao,
    tipoCalculo: data.tipoCalculo,
  });

  const isObrigadoRenda = calc.totalRendimentos > IRPF_RULES.ANNUAL_EXEMPTION_LIMIT;
  const isObrigadoPatrimonio = data.patrimonio > IRPF_RULES.ANNUAL_ASSETS_LIMIT;
  const isObrigadoExterior = data.situacoes.includes("exterior");
  const isObrigadoBolsa = data.operouBolsa === "sim";
  
  const isObrigado = isObrigadoRenda || isObrigadoPatrimonio || isObrigadoExterior || isObrigadoBolsa;

  const handleSendLead = async () => {
    if (!email || !phone) return;
    setLoading(true);

    try {
      await saveLead({
        email,
        whatsapp: phone,
        rendimentos: calc.totalRendimentos,
        patrimonio: data.patrimonio,
        vinculos: data.vinculos.join(","),
        situacoes: data.situacoes.join(","),
      });

      setSent(true);

      const text = encodeURIComponent(
        `Olá! Fiz a simulação do IRPF 2026 e o resultado foi ${
          isObrigado ? "Obrigado" : "Isento"
        }. Gostaria de receber o checklist e falar com um contador.`
      );
      window.open(`https://wa.me/5574999697652?text=${text}`, "_blank");
    } catch (err: any) {
      console.error("Erro ao salvar lead:", err);
      alert("Erro ao enviar seus dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div
        className={`result-box p-8 rounded-2xl flex gap-6 items-start border-2 mb-8 ${
          isObrigado ? "bg-[#FFF8EC] border-gold" : "bg-[#EAFAF1] border-green"
        }`}
      >
        <div className="text-4xl">{isObrigado ? "⚠️" : "✅"}</div>
        <div>
          <h3 className="text-xl font-extrabold text-deep mb-2">
            {isObrigado ? "Sua declaração é OBRIGATÓRIA!" : "Você está ISENTO de declarar!"}
          </h3>
          <p className="text-sub text-sm leading-relaxed">
            {isObrigado 
              ? `De acordo com os dados informados, você atingiu critérios de obrigatoriedade da IN RFB 2.312/2026 (Limite: ${formatBRL(35584)} em rendas ou ${formatBRL(800000)} em bens).` 
              : "Parabéns! Seus rendimentos e patrimônio informados estão dentro do limite de isenção da Receita Federal para 2026."}
          </p>
        </div>
      </div>

      <div className="bg-[#120A45] rounded-2xl p-8 text-white mb-10">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8B78EF] mb-6">Resumo da Simulação</h4>
        <div className="space-y-3">
          <div className="flex justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-white/60 text-sm">Renda Tributável 2025</span>
            <span className="font-bold text-base">{formatBRL(calc.totalRendimentos)}</span>
          </div>
          <div className="flex justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-white/60 text-sm">Imposto Estimado</span>
            <span className="font-bold text-base text-violet">{formatBRL(calc.impostoDevido)}</span>
          </div>
          <div className="flex justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-white/60 text-sm">Modelo Sugerido</span>
            <span className="font-bold text-sm uppercase tracking-wider text-green-400">{calc.modeloMaisVantajoso}</span>
          </div>
          <div className="flex justify-between p-4 bg-white/5 rounded-xl">
            <span className="text-white/60 text-sm">Patrimônio Declarado</span>
            <span className="font-bold text-base">{formatBRL(data.patrimonio)}</span>
          </div>
          <div className="flex justify-between p-4 bg-white/10 rounded-xl border border-white/10">
            <span className="text-white font-bold text-sm">Obrigatoriedade</span>
            <span className={`font-extrabold text-base ${isObrigado ? "text-[#FFC84A]" : "text-[#2ECC71]"}`}>
              {isObrigado ? "SIM" : "NÃO"}
            </span>
          </div>
        </div>
      </div>

      <div className="merch-inline-card overflow-hidden relative bg-[#F4F2FF] p-10 rounded-3xl border border-violet/20 flex flex-col items-center text-center">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet/10 rounded-full blur-3xl"></div>
        <span className="bg-violet text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">Presente Exclusivo</span>
        <h4 className="text-2xl font-extrabold text-deep mb-4 max-w-sm">
          Receba o <strong>Checklist Completo</strong> para não cair na Malha Fina
        </h4>
        <p className="text-sub text-sm mb-8 max-w-md">
          {sent 
            ? "Tudo pronto! Seus dados foram enviados e um especialista entrará em contato em breve."
            : "Deixe seu WhatsApp e enviaremos imediatamente a lista de documentos necessários para garantir sua restituição máxima em 2026."}
        </p>

        {!sent && (
          <div className="w-full max-w-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-white border border-gray-200 outline-none focus:border-violet p-4 rounded-xl font-medium text-deep transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="WhatsApp (com DDD)"
                className="bg-white border border-gray-200 outline-none focus:border-violet p-4 rounded-xl font-medium text-deep transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button
              onClick={handleSendLead}
              disabled={loading || !email || !phone}
              className="w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white py-4 rounded-xl font-extrabold shadow-lg shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Processando..." : "Receber Checklist no WhatsApp 🚀"}
            </button>
          </div>
        )}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={reset}
          className="w-full mt-4 py-3 text-white/40 font-bold hover:text-white transition-colors"
        >
          ← Refazer Simulação
        </button>
      </div>
    </div>
  );
}
