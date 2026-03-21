/**
 * IRPF 2026 Calculation Engine (Base Year 2025)
 */

export const IRPF_RULES = {
  ANNUAL_EXEMPTION_LIMIT: 35584.0,
  ANNUAL_ASSETS_LIMIT: 800000.0,
  MONTHLY_EXEMPTION_LIMIT: 2824.0,
  SIMPLIFIED_DISCOUNT_PERCENT: 0.2, // 20%
  SIMPLIFIED_DISCOUNT_MAX: 16754.34, 
  DEPENDENT_DEDUCTION_ANNUAL: 2275.08,
  EDUCATION_DEDUCTION_LIMIT_ANNUAL: 3561.50,
  INSS_MAX_BASE: 8157.41,
  INSS_MAX_VALUE: 908.86,
  MIN_FINE: 165.74,
};

export interface CalculationResult {
  baseCalculo: number;
  impostoDevido: number;
  aliquotaEfetiva: number;
  inss: number;
  descontoSimplificado: number;
  modeloMaisVantajoso: "simplificado" | "completo";
  totalRendimentos: number;
}

/**
 * Calculates monthly IRPF based on progressive table 2025
 */
export function calculateMonthlyIRPF(base: number): number {
  if (base <= 2259.20) return 0;
  if (base <= 2828.65) return base * 0.075 - 169.44;
  if (base <= 3751.05) return base * 0.15 - 381.44;
  if (base <= 4664.68) return base * 0.225 - 662.77;
  return base * 0.275 - 896.00;
}

/**
 * Annual Progressive Table 2025/2026 (Estimate based on 12 months)
 */
export function calculateAnnualIRPFProgressive(base: number): number {
  if (base <= 27110.40) return 0; // 2259.20 * 12
  if (base <= 33943.80) return base * 0.075 - 2033.28; // 169.44 * 12
  if (base <= 45012.60) return base * 0.15 - 4577.28; // 381.44 * 12
  if (base <= 55976.16) return base * 0.225 - 7953.24; // 662.77 * 12
  return base * 0.275 - 10752.00; // 896.00 * 12
}

export function calcINSS_autonomo(fat: number) {
  const base = Math.min(fat, IRPF_RULES.INSS_MAX_BASE);
  return base * 0.2; 
}

/**
 * Complex Annual Calculation
 */
export function calculateAnnual2026(params: {
  salarioMensal: number;
  mesesTrabalhados: number;
  recebeu13: "completo" | "proporcional" | "nao";
  rendimentoLiberal: number;
  dependentes: number;
  gastosSaude: number;
  gastosEducacao: number;
  tipoCalculo: "simplificado" | "completo" | "automatico";
}) {
  const rendimentoCLT = params.salarioMensal * params.mesesTrabalhados;
  const rendimentoLiberal = params.rendimentoLiberal;
  const totalRendimentosTributaveis = rendimentoCLT + rendimentoLiberal;
  
  // INSS Estimation
  // CLT: Approximate 11% (Simplified)
  const inssCLT = rendimentoCLT * 0.11; 
  // Liberal: 20% on monthly base up to ceiling
  const inssLiberal = Math.min(rendimentoLiberal, IRPF_RULES.INSS_MAX_BASE * 12) * 0.2;
  const totalINSS = inssCLT + inssLiberal;

  // 1. Simplified Model
  const descontoSimplificado = Math.min(
    totalRendimentosTributaveis * IRPF_RULES.SIMPLIFIED_DISCOUNT_PERCENT,
    IRPF_RULES.SIMPLIFIED_DISCOUNT_MAX
  );
  const baseSimplificada = Math.max(0, totalRendimentosTributaveis - descontoSimplificado);
  const impostoSimplificado = calculateAnnualIRPFProgressive(baseSimplificada);

  // 2. Complete Model
  const deducaoDependentes = params.dependentes * IRPF_RULES.DEPENDENT_DEDUCTION_ANNUAL;
  const deducaoEducacao = Math.min(params.gastosEducacao, IRPF_RULES.EDUCATION_DEDUCTION_LIMIT_ANNUAL * (params.dependentes + 1));
  const deducaoSaude = params.gastosSaude;
  
  const totalDeducoes = totalINSS + deducaoDependentes + deducaoEducacao + deducaoSaude;
  const baseCompleta = Math.max(0, totalRendimentosTributaveis - totalDeducoes);
  const impostoCompleto = calculateAnnualIRPFProgressive(baseCompleta);

  // Decision
  let finalModel: "simplificado" | "completo" = "simplificado";
  if (params.tipoCalculo === "completo") finalModel = "completo";
  else if (params.tipoCalculo === "simplificado") finalModel = "simplificado";
  else {
    finalModel = impostoCompleto < impostoSimplificado ? "completo" : "simplificado";
  }

  const finalImposto = finalModel === "completo" ? impostoCompleto : impostoSimplificado;
  const finalBase = finalModel === "completo" ? baseCompleta : baseSimplificada;

  return {
    totalRendimentos: totalRendimentosTributaveis,
    baseCalculo: finalBase,
    impostoDevido: finalImposto,
    aliquotaEfetiva: totalRendimentosTributaveis > 0 ? (finalImposto / totalRendimentosTributaveis) * 100 : 0,
    inss: totalINSS,
    descontoSimplificado: finalModel === "simplificado" ? descontoSimplificado : 0,
    modeloMaisVantajoso: finalModel,
  };
}

export function calculateMonthlyINSS(salarioBruto: number): number {
  // Tabela INSS 2025 (Exemplo de faixas progressivas)
  if (salarioBruto <= 1518.00) return salarioBruto * 0.075;
  if (salarioBruto <= 2793.88) return (salarioBruto - 1518.00) * 0.09 + 113.85;
  if (salarioBruto <= 4190.83) return (salarioBruto - 2793.88) * 0.12 + 228.68;
  if (salarioBruto <= 8157.41) return (salarioBruto - 4190.83) * 0.14 + 396.31;
  return 951.63; // Teto
}

export function calculateMonthlyCLT(salarioBruto: number) {
  const inss = calculateMonthlyINSS(salarioBruto);
  const baseIR = Math.max(0, salarioBruto - inss);
  const ir = calculateMonthlyIRPF(baseIR);
  const liquido = salarioBruto - inss - ir;
  return { inss, baseIR, ir, liquido };
}

export function formatBRL(val: number): string {
  return val.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Calculates monthly tax burden for Pessoa Física (Autônomo)
 */
export function calculatePF(income: number) {
  const inss = Math.min(income * 0.20, IRPF_RULES.INSS_MAX_VALUE);
  const iss = income * 0.05;
  const baseIR = Math.max(0, income - inss);
  const ir = calculateMonthlyIRPF(baseIR);
  const total = inss + iss + ir;
  return { inss, iss, ir, total, liquido: income - total };
}

/**
 * Calculates monthly tax burden for Pessoa Jurídica
 */
export function calculatePJ(
  income: number,
  proLabore: number,
  regime: "simples" | "lucropres"
) {
  const inssProL = Math.min(proLabore * 0.11, IRPF_RULES.INSS_MAX_VALUE);
  const baseIRProL = Math.max(0, proLabore - inssProL);
  const irProL = calculateMonthlyIRPF(baseIRProL);

  const impEmp =
    regime === "simples"
      ? income * 0.06 // Annexo III simplified estimate
      : income * 0.163; // Lucro Presumido average

  const total = impEmp + inssProL + irProL;
  return { impEmp, inssProL, irProL, total, liquido: income - total };
}


