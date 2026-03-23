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
  valor13: number;
  // Liberal
  rendimentoLiberal: number;
  // PJ
  proLaborePJ: number;
  lucrosPJ: number;
  irRetidoPJ: number;
  // MEI
  rendimentoMEI: number;
  meiAtiv: "serv" | "com" | "misto";
  // Aposentado
  rendimentoAposentado: number;
  idade65: boolean;
  // Outros
  rendimentoOutros: number;
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
    valor13: 0,
    rendimentoLiberal: 0,
    proLaborePJ: 0,
    lucrosPJ: 0,
    irRetidoPJ: 0,
    rendimentoMEI: 0,
    meiAtiv: "serv",
    rendimentoAposentado: 0,
    idade65: false,
    rendimentoOutros: 0,
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
    // If moving from Rendimentos (Step 1) to Patrimonio (Step 2)
    if (step === 1 && formData.vinculos.includes("mei")) {
      const pct = formData.meiAtiv === "serv" ? 0.32 : formData.meiAtiv === "com" ? 0.08 : 0.20;
      const profit = formData.rendimentoMEI * pct;
      
      // We set rendimentoOutros with the profit, but only if it was 0 or just help the user see it
      setFormData(prev => ({
        ...prev,
        rendimentoOutros: prev.rendimentoOutros === 0 ? profit : prev.rendimentoOutros
      }));
    }

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
             {step === 1 && `2. Rendimentos: ${formData.vinculos.map(v => v === 'clt' ? 'CLT' : v === 'liberal' ? 'Autônomo' : v === 'pj' ? 'PJ' : v === 'mei' ? 'MEI' : 'Aposentado').join(' + ')}`}
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
                    icon="👔"
                    title="CLT"
                    desc="Trabalha com carteira assinada. INSS retido na fonte."
                    active={formData.vinculos.includes("clt")}
                    onClick={() => toggleVinculo("clt")}
                  />
                  <VinculoOption
                    icon="🩺"
                    title="Profissional Liberal / Autônomo"
                    desc="Recebe honorários ou é autônomo. Emite recibo no CPF."
                    active={formData.vinculos.includes("liberal")}
                    onClick={() => toggleVinculo("liberal")}
                  />
                  <VinculoOption
                    icon="🏢"
                    title="Sócios de Empresa (PJ)"
                    desc="Recebe pró-labore ou dividendos. Incompatível com MEI."
                    active={formData.vinculos.includes("pj")}
                    disabled={formData.vinculos.includes("mei")}
                    onClick={() => toggleVinculo("pj")}
                  />
                  <VinculoOption
                    icon="🏅"
                    title="Aposentado ou Pensionista"
                    desc="Recebe benefício do INSS ou Previdência privada."
                    active={formData.vinculos.includes("apo")}
                    onClick={() => toggleVinculo("apo")}
                  />
                  <VinculoOption
                    icon="🟡"
                    title="MEI"
                    desc="Microempreendedor Individual. Incompatível com PJ."
                    active={formData.vinculos.includes("mei")}
                    disabled={formData.vinculos.includes("pj")}
                    onClick={() => toggleVinculo("mei")}
                  />
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button 
                    onClick={next} 
                    disabled={formData.vinculos.length === 0}
                    className="bg-[#120A45] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-deep transition-all shadow-xl shadow-violet/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo Passo →
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-fade-in">
                {/* CLT Section */}
                {formData.vinculos.includes("clt") && (
                  <div className="mb-10 last:mb-0">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg">👔</span>
                      <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua renda como CLT</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Qual era o seu salário bruto mensal em 2025?</label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                          <MoneyInput
                            value={formData.salarioMensal}
                            onChange={(val) => setFormData({...formData, salarioMensal: val})}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <label className="block text-[13px] font-bold text-deep mb-3">Por quantos meses trabalhou com carteira assinada em 2025?</label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={formData.mesesTrabalhados}
                            onChange={(e) => setFormData({...formData, mesesTrabalhados: Math.min(12, Math.max(1, parseInt(e.target.value) || 0))})}
                            className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 px-4 font-bold text-deep transition-all"
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
                          {formData.recebeu13 === "proporcional" && (
                            <div className="pl-9 animate-fade-in">
                              <label className="block text-[11px] font-bold text-deep mb-2">Valor bruto do 13º recebido</label>
                              <div className="relative max-w-md">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-xs">R$</span>
                                <MoneyInput
                                  value={formData.valor13}
                                  onChange={(val) => setFormData({...formData, valor13: val})}
                                  placeholder="0,00"
                                />
                              </div>
                            </div>
                          )}
                          <RadioOption 
                            label="Não recebi 13º em 2025"
                            active={formData.recebeu13 === "nao"}
                            onClick={() => setFormData({...formData, recebeu13: "nao"})}
                          />
                        </div>
                      </div>

                      {formData.salarioMensal > 0 && <CLTMonthlyEstimate salario={formData.salarioMensal} />}
                    </div>
                  </div>
                )}

                {/* Liberal Section */}
                {formData.vinculos.includes("liberal") && (
                  <div className="mb-10 pt-10 border-t border-gray-100 last:mb-0">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg">🩺</span>
                      <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua renda como profissional liberal</h4>
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-bold text-deep mb-3">Valor médio mensal recebido em 2025 (Honorários/Autônomo)</label>
                      <div className="relative max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                        <MoneyInput
                          value={formData.rendimentoLiberal}
                          onChange={(val) => setFormData({...formData, rendimentoLiberal: val})}
                        />
                      </div>
                      <p className="mt-3 text-[11px] text-gray-400">Informe a média recebida por mês. O sistema multiplicará por 12 meses automaticamente para o cálculo anual.</p>
                    </div>
                  </div>
                )}

                {/* PJ Section */}
                {formData.vinculos.includes("pj") && (
                  <div className="mb-10 pt-10 border-t border-gray-100 last:mb-0">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg">🏢</span>
                      <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua renda como PJ (Sócio)</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Valor total do Pró-labore recebido em 2025</label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                          <MoneyInput
                            value={formData.proLaborePJ}
                            onChange={(val) => setFormData({...formData, proLaborePJ: val})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Qual foi o total de distribuição de lucros recebido em 2025?</label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                          <MoneyInput
                            value={formData.lucrosPJ}
                            onChange={(val) => setFormData({...formData, lucrosPJ: val})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Qual foi o total de IR retido na fonte ao longo de 2025?</label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                          <MoneyInput
                            value={formData.irRetidoPJ}
                            onChange={(val) => setFormData({...formData, irRetidoPJ: val})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MEI Section */}
                {formData.vinculos.includes("mei") && (
                  <div className="mb-10 pt-10 border-t border-gray-100 last:mb-0">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg">🟡</span>
                      <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua atividade como MEI</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="field-group">
                        <label className="block text-[13px] font-bold text-deep mb-3">Qual é a atividade principal do seu MEI?</label>
                        <div className="space-y-2">
                          <RadioOption 
                            label="🛠️ Prestação de serviços"
                            sub="Isenta 32% do faturamento de IR PF"
                            active={formData.meiAtiv === "serv"}
                            onClick={() => setFormData({...formData, meiAtiv: "serv"})}
                          />
                          <RadioOption 
                            label="🛒 Comércio / indústria"
                            sub="Isenta 8% do faturamento de IR PF"
                            active={formData.meiAtiv === "com"}
                            onClick={() => setFormData({...formData, meiAtiv: "com"})}
                          />
                          <RadioOption 
                            label="⚡ Possui as duas atividades"
                            sub="Isenção proporcional — média de 20%"
                            active={formData.meiAtiv === "misto"}
                            onClick={() => setFormData({...formData, meiAtiv: "misto"})}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Quanto faturou pelo seu MEI em 2025 (total do ano)?</label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                          <MoneyInput
                            value={formData.rendimentoMEI}
                            onChange={(val) => setFormData({...formData, rendimentoMEI: val})}
                            limit={IRPF_RULES.MEI_ANNUAL_LIMIT}
                          />
                        </div>
                        <p className="mt-3 text-[11px] text-gray-400">Limite do MEI em 2025: R$ 81.000/ano.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aposentado Section */}
                {formData.vinculos.includes("apo") && (
                  <div className="mb-10 pt-10 border-t border-gray-100 last:mb-0">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-lg">🏅</span>
                      <h4 className="text-xs font-bold text-violet uppercase tracking-widest">Sua renda como Aposentado/Pensionista</h4>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Qual é o valor bruto do seu benefício anual em 2025?</label>
                        <div className="relative max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                          <MoneyInput
                            value={formData.rendimentoAposentado}
                            onChange={(val) => setFormData({...formData, rendimentoAposentado: val})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[13px] font-bold text-deep mb-3">Tinha 65 anos ou mais em 2025?</label>
                        <div className="space-y-2">
                          <RadioOption 
                            label="Sim — tinha 65 anos ou mais"
                            sub="Isenção extra de R$ 2.824/mês (Art. 6º, XV, Lei 7.713/88)"
                            active={formData.idade65 === true}
                            onClick={() => setFormData({...formData, idade65: true})}
                          />
                          <RadioOption 
                            label="Não"
                            active={formData.idade65 === false}
                            onClick={() => setFormData({...formData, idade65: false})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                      <MoneyInput
                        value={formData.patrimonio}
                        onChange={(val) => setFormData({...formData, patrimonio: val})}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400">Some imóveis (pelo custo de aquisição), veículos, investimentos, saldos e participações societárias.</p>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Recebeu rendimentos isentos ou tributados na fonte em 2025?</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <MoneyInput
                        value={formData.rendimentoOutros}
                        onChange={(val) => setFormData({...formData, rendimentoOutros: val})}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-gray-400 italic">Ex.: PLR, FGTS sacado, poupança, LCI/LCA, dividendos, heranças, indenizações, observação: O 13º salário já é informado no bloco CLT.</p>
                    {formData.vinculos.includes("mei") && formData.rendimentoMEI > 0 && (
                      <p className="mt-2 text-[11px] text-violet font-bold bg-violet/5 p-2 rounded-lg border border-violet/10">
                        ✨ Incluímos automaticamente {formatBRL(formData.rendimentoMEI * (formData.meiAtiv === "serv" ? 0.32 : formData.meiAtiv === "com" ? 0.08 : 0.20))} referentes à isenção presumida do seu MEI ({formData.meiAtiv === "serv" ? "32%" : formData.meiAtiv === "com" ? "8%" : "20%"}).
                      </p>
                    )}
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
                      onChange={(e) => {
                        const deps = Math.min(20, Math.max(0, parseInt(e.target.value) || 0));
                        setFormData({
                          ...formData, 
                          dependentes: deps
                        });
                      }}
                      className="w-32 bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 px-4 font-bold text-deep transition-all"
                    />
                    {formData.dependentes > 0 && (
                      <p className="mt-2 text-[11px] text-gray-500">
                        Dedução legal: <strong className="text-violet">{formatBRL(IRPF_RULES.DEPENDENT_DEDUCTION_ANNUAL)}</strong> por dependente (Total: <strong className="text-violet">{formatBRL(formData.dependentes * IRPF_RULES.DEPENDENT_DEDUCTION_ANNUAL)}</strong>/ano)
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Quanto gastou com saúde em 2025? (médicos, plano de saúde, exames — sem limite de dedução)</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <MoneyInput
                        value={formData.gastosSaude}
                        onChange={(val) => setFormData({...formData, gastosSaude: val})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-bold text-deep mb-3">Quanto gastou com educação em 2025? (limite de R$ 3.561,50 por pessoa)</label>
                    <div className="relative max-w-md">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold">R$</span>
                      <MoneyInput
                        value={formData.gastosEducacao}
                        onChange={(val) => setFormData({...formData, gastosEducacao: val})}
                        limit={IRPF_RULES.EDUCATION_DEDUCTION_LIMIT_ANNUAL}
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
  disabled,
  onClick,
}: {
  icon: string;
  title: string;
  desc: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative p-6 rounded-2xl transition-all duration-300 border-2 select-none group min-h-[140px] ${
        disabled
          ? "bg-white/50 border-gray-100 opacity-40 cursor-not-allowed filter grayscale"
          : active
          ? "bg-[#F4F2FF] border-violet shadow-lg shadow-violet/10 cursor-pointer"
          : "bg-white border-gray-100 hover:border-soft cursor-pointer"
      }`}
    >
      <div 
        className={`absolute top-4 right-4 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
          disabled ? "bg-gray-100 border-gray-200" : active ? "bg-violet border-violet text-white" : "bg-white border-gray-300"
        }`}
      >
        {active && !disabled && <span className="text-[10px] font-bold">✓</span>}
      </div>
      
      <div className="flex flex-col gap-3">
        <div className={`text-3xl transition-transform ${!disabled && "group-hover:scale-110"}`}>{icon}</div>
        <div>
          <h4 className={`font-extrabold text-[15px] mb-1 ${disabled ? "text-gray-400" : "text-deep"}`}>{title}</h4>
          <p className={`text-[12px] leading-snug ${disabled ? "text-gray-300" : "text-sub"}`}>{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Result({ data, reset }: { data: FormData; reset: () => void }) {
  const [isSent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMemory, setShowMemory] = useState(false);

  // Use state for email and whatsapp to handle form changes
  const [email, setEmail] = useState(data.email);
  const [whatsapp, setWhatsapp] = useState(data.whatsapp);

  const res = calculateAnnual2026({
    clt: data.salarioMensal,
    meses: data.mesesTrabalhados,
    recebeu13: data.recebeu13,
    valor13: data.valor13,
    liberal: data.rendimentoLiberal * 12,
    proLaborePJ: data.proLaborePJ,
    lucrosPJ: data.lucrosPJ,
    irRetidoPJ: data.irRetidoPJ,
    mei: data.rendimentoMEI,
    meiAtiv: data.meiAtiv,
    aposentadoria: data.rendimentoAposentado,
    idade65: data.idade65,
    outrosIsentos: Math.max(0, data.rendimentoOutros - (data.vinculos.includes("mei") ? (data.rendimentoMEI * (data.meiAtiv === "serv" ? 0.32 : data.meiAtiv === "com" ? 0.08 : 0.20)) : 0)),
    dependentes: data.dependentes,
    saude: data.gastosSaude,
    educacao: data.gastosEducacao,
  });

  const model =
    data.tipoCalculo === "simplificado"
      ? res.simplificado
      : data.tipoCalculo === "completo"
      ? res.completo
      : res.simplificado.imposto < res.completo.imposto
      ? res.simplificado
      : res.completo;

  const isSimplified = model === res.simplificado;

  // Obrigatoriedade Logic (IN RFB 2.312/2026)
  const reasons = [];
  if (res.totalTributavel > IRPF_RULES.ANNUAL_EXEMPTION_LIMIT) reasons.push(`Rendimentos tributáveis acima de ${formatBRL(IRPF_RULES.ANNUAL_EXEMPTION_LIMIT)}`);
  if (res.totalIsento > IRPF_RULES.ANNUAL_EXEMPT_INCOME_LIMIT) reasons.push(`Rendimentos isentos/não tributáveis acima de ${formatBRL(IRPF_RULES.ANNUAL_EXEMPT_INCOME_LIMIT)}`);
  if (data.patrimonio > IRPF_RULES.ANNUAL_ASSETS_LIMIT) reasons.push(`Posse de bens ou direitos acima de ${formatBRL(IRPF_RULES.ANNUAL_ASSETS_LIMIT)}`);
  if (data.operouBolsa === "sim") reasons.push("Operações em bolsa de valores/mercados futuros");
  if (data.vendeuBem === "sim") reasons.push("Ganho de capital na alienação de bens ou direitos");
  if (data.situacoes.includes("exterior")) reasons.push("Bens ou direitos no exterior (Lei 14.754)");
  if (data.situacoes.includes("residente")) reasons.push("Passou à condição de residente no Brasil em 2025");
  if (data.situacoes.includes("rural") && (data.rendimentoLiberal + data.rendimentoMEI) > 153199.50) reasons.push("Receita bruta rural acima de R$ 153.199,50");

  const isObrigado = reasons.length > 0;

  const handleLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveLead({
        email: email,
        whatsapp: whatsapp,
        vinculos: data.vinculos.join(","),
        situacoes: data.situacoes.join(","),
        isento: res.totalIsento,
        tributavel: res.totalTributavel,
        imposto: model.imposto,
        obrigado: isObrigado,
      });

      setSent(true);

      const text = encodeURIComponent(
        `Olá! Fiz a simulação do IRPF 2026 e o resultado foi ${
          isObrigado ? "Obrigado" : "Isento"
        }. Gostaria de falar com um especialista sobre meu caso.`
      );
      window.open(`https://wa.me/5574999697652?text=${text}`, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
        <h3 className="text-2xl font-bold text-deep mb-4">Dados enviados com sucesso!</h3>
        <p className="text-sub max-w-md mx-auto mb-8">Nossa equipe analisará seu perfil e entrará em contato em breve para garantir que você pague o mínimo de imposto legalmente possível.</p>
        <button onClick={reset} className="text-violet font-bold hover:underline">Fazer nova simulação</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="mb-8">
            <h4 className="text-xs font-bold text-violet uppercase tracking-widest mb-2">Diagnóstico Fiscal</h4>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold ${isObrigado ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              <span className={`w-2 h-2 rounded-full ${isObrigado ? "bg-red-500" : "bg-green-500"}`}></span>
              {isObrigado ? "OBRIGADO A DECLARAR" : "DISPENSADO DA DECLARAÇÃO*"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-bg p-5 rounded-2xl flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Rendimento Tributável Anual</span>
              <span className="text-lg font-bold text-deep">{formatBRL(res.totalTributavel)}</span>
            </div>
            <div className="bg-bg p-5 rounded-2xl flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Rendimento Isento (Incluso MEI)</span>
              <span className="text-lg font-bold text-deep">{formatBRL(res.totalIsento)}</span>
            </div>
            
            <div className="bg-[#120A45] p-6 rounded-2xl text-white shadow-xl shadow-violet/20">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Estimativa de Imposto</span>
                <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">{isSimplified ? "SIMPLIFICADO" : "COMPLETO"}</span>
              </div>
              <div className="text-3xl font-black mb-2">{formatBRL(model.imposto)}</div>
              <div className="text-[11px] opacity-70 border-t border-white/10 pt-3 flex justify-between items-center">
                <span>Alíquota Efetiva: <strong>{model.aliquotaEfetiva.toFixed(2)}%</strong></span>
                <span className="text-gold-lt font-bold uppercase tracking-tighter">Sugestão: {isSimplified ? "Simplificado" : "Completo"}</span>
              </div>
            </div>
          </div>

          {isObrigado && (
            <div className="mt-8 p-5 bg-red-50 rounded-2xl border border-red-100">
              <h5 className="text-[13px] font-bold text-red-800 mb-3 flex items-center gap-2">
                <span>⚠️</span> Critérios de Obrigatoriedade atendidos:
              </h5>
              <ul className="space-y-2">
                {reasons.map((r, i) => (
                  <li key={i} className="text-[12px] text-red-700 flex items-start gap-2">
                    <span className="text-red-400">•</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <button 
              onClick={() => setShowMemory(!showMemory)}
              className="w-full flex items-center justify-between p-4 bg-bg rounded-2xl text-deep font-bold hover:bg-violet/5 transition-all border border-transparent hover:border-violet/20"
            >
              <span>📊 Ver Memória de Cálculo Detalhada</span>
              <span className={`transition-transform ${showMemory ? "rotate-180" : ""}`}>↓</span>
            </button>

            {showMemory && (
              <div className="mt-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm animate-fade-in space-y-6">
                {/* Receitas Tributáveis */}
                <div>
                  <h5 className="text-[11px] font-bold text-violet uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-violet rounded-full"></span>
                    Origem das Receitas Tributáveis (Ano-Base 2025)
                  </h5>
                  <div className="space-y-2 text-sm">
                    {res.breakdownIncomes.clt > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Rendimentos CLT (Salários)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIncomes.clt)}</span>
                      </div>
                    )}
                    {res.breakdownIncomes.liberal > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Rendimentos Autônomo / Liberal</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIncomes.liberal)}</span>
                      </div>
                    )}
                    {res.breakdownIncomes.proLabore > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Pró-Labore (Sócio/PJ)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIncomes.proLabore)}</span>
                      </div>
                    )}
                    {res.breakdownIncomes.aposentadoria > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Aposentadoria (Parcela Tributável)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIncomes.aposentadoria)}</span>
                      </div>
                    )}
                    {res.breakdownIncomes.mei > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">MEI (Parcela Tributável)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIncomes.mei)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-deep font-bold bg-bg px-2 rounded mt-1">
                      <span>Base de Cálculo Bruta</span>
                      <span>{formatBRL(res.totalTributavel)}</span>
                    </div>
                  </div>
                </div>

                {/* Rendimentos Isentos */}
                <div>
                  <h5 className="text-[11px] font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Rendimentos Isentos ou Não Tributáveis
                  </h5>
                  <div className="space-y-2 text-sm">
                    {res.breakdownIsentos.lucros > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Distribuição de Lucros (PJ)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIsentos.lucros)}</span>
                      </div>
                    )}
                    {res.breakdownIsentos.mei > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Lucro Isento Presumido (MEI)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIsentos.mei)}</span>
                      </div>
                    )}
                    {res.breakdownIsentos.aposentadoria > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Isenção Extra (Aposentado 65+)</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIsentos.aposentadoria)}</span>
                      </div>
                    )}
                    {res.breakdownIsentos.outros > 0 && (
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-sub">Outros Rendimentos Isentos</span>
                        <span className="font-medium text-deep">{formatBRL(res.breakdownIsentos.outros)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 text-green-700 font-bold bg-green-50 px-2 rounded mt-1">
                      <span>Total Desconsiderado de IR</span>
                      <span>{formatBRL(res.totalIsento)}</span>
                    </div>
                  </div>
                </div>

                {/* Deduções e Modelos */}
                <div className="space-y-6 pt-4 border-t border-gray-100">
                  <div className="p-4 bg-bg rounded-xl">
                    <h6 className="text-[10px] font-bold text-deep uppercase mb-3 underline">Modelo Simplificado</h6>
                    <div className="space-y-1 text-[12px]">
                      <div className="flex justify-between mb-2">
                        <span>Desconto Padrão (20%):</span>
                        <span className="font-bold text-red-600">-{formatBRL(res.simplificado.desconto)}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mb-2">
                        * Limitado ao teto anual de {formatBRL(IRPF_RULES.SIMPLIFIED_DISCOUNT_MAX)}
                      </div>
                      <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                        <span>Base Líquida:</span>
                        <span>{formatBRL(res.simplificado.base)}</span>
                      </div>
                      {res.simplificado.base < IRPF_RULES.ANNUAL_EXEMPTION_LIMIT && res.totalTributavel >= IRPF_RULES.ANNUAL_EXEMPTION_LIMIT && (
                        <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] text-blue-800 leading-relaxed font-medium">
                          <strong>Aviso:</strong> Após aplicação dos 20% de descontos simplificados sobre os rendimentos tributados, a base líquida resultou em um valor menor que {formatBRL(IRPF_RULES.ANNUAL_EXEMPTION_LIMIT)}.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-bg rounded-xl">
                    <h6 className="text-[10px] font-bold text-deep uppercase mb-3 underline">Modelo Completo (Legal)</h6>
                    <div className="space-y-1 text-[12px]">
                      <div className="flex justify-between">
                        <span>Previdência (INSS):</span>
                        <span className="font-bold text-red-600">-{formatBRL(res.breakdownDeducoes.inss)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dependentes:</span>
                        <span className="font-bold text-red-600">-{formatBRL(res.breakdownDeducoes.dependentes)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saúde:</span>
                        <span className="font-bold text-red-600">-{formatBRL(res.breakdownDeducoes.saude)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Educação*:</span>
                        <span className="font-bold text-red-600">-{formatBRL(res.breakdownDeducoes.educacao)}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        * Respeitando o limite máximo dedutível de {formatBRL(IRPF_RULES.EDUCATION_DEDUCTION_LIMIT_ANNUAL)}.
                      </div>
                      <div className="flex justify-between font-bold border-t border-gray-200 pt-2">
                        <span>Base Líquida:</span>
                        <span>{formatBRL(res.completo.base)}</span>
                      </div>
                      {res.completo.base < IRPF_RULES.ANNUAL_EXEMPTION_LIMIT && res.totalTributavel >= IRPF_RULES.ANNUAL_EXEMPTION_LIMIT && (
                        <div className="mt-3 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] text-blue-800 leading-relaxed font-medium">
                          <strong>Aviso:</strong> Após aplicação das deduções legais sobre os rendimentos tributados, a base líquida resultou em um valor menor que {formatBRL(IRPF_RULES.ANNUAL_EXEMPTION_LIMIT)}.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-violet/5 p-8 rounded-3xl border border-violet/10 h-fit sticky top-6">
          <h4 className="text-xl font-bold text-deep mb-4">Receba seu planejamento detalhado</h4>
          <p className="text-sm text-sub mb-8 leading-relaxed">
            Deixe seus contatos e um especialista entrará em contato para validar sua simulação e garantir o menor imposto.
          </p>

          <form className="space-y-4" onSubmit={handleLead}>
            <div>
              <label className="block text-[11px] font-bold text-violet uppercase tracking-widest mb-2 px-1">Seu melhor E-mail</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full bg-white border border-gray-200 outline-none focus:border-violet rounded-xl py-3 px-4 font-bold text-deep transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-violet uppercase tracking-widest mb-2 px-1">WhatsApp para contato</label>
              <input
                required
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full bg-white border border-gray-200 outline-none focus:border-violet rounded-xl py-3 px-4 font-bold text-deep transition-all shadow-sm"
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-[#120A45] text-white py-4 rounded-xl font-bold mt-4 hover:bg-deep transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Processando..." : "Consultar Consultor IRPF Especialista"}
            </button>
          </form>
        </div>
      </div>
      
      <div className="text-center mt-12 pt-8 border-t border-gray-100">
        <button onClick={reset} className="text-sub font-bold hover:text-deep transition-colors">← Refazer Simulação</button>
      </div>
    </div>
  );
}

function MoneyInput({ 
  value, 
  onChange, 
  placeholder = "0,00", 
  limit 
}: { 
  value: number; 
  onChange: (val: number) => void; 
  placeholder?: string; 
  limit?: number;
}) {
  const formatValue = (num: number) => {
    return num.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    if (!rawDigits) {
      onChange(0);
      return;
    }
    
    let numeric = parseFloat(rawDigits) / 100;
    
    if (limit && numeric > limit) {
      numeric = limit;
    }
    
    onChange(numeric);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value > 0 ? formatValue(value) : ""}
      onChange={handleChange}
      className="w-full bg-bg border-2 border-transparent focus:border-violet outline-none rounded-xl py-3 pl-12 pr-4 font-bold text-deep transition-all"
      placeholder={placeholder}
    />
  );
}
