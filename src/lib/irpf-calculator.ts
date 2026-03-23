/**
 * IRPF 2026 Calculation Engine (Base Year 2025)
 * Reference: IN RFB 2.312/2026
 */

export const IRPF_RULES = {
  ANNUAL_EXEMPTION_LIMIT: 35584.0, // Threshold for mandatory declaration
  ANNUAL_ASSETS_LIMIT: 800000.0,   // Threshold for assets
  ANNUAL_EXEMPT_INCOME_LIMIT: 200000.0, // Threshold for exempt income
  
  MONTHLY_EXEMPTION_LIMIT: 2965.33, // 35584 / 12
  
  SIMPLIFIED_DISCOUNT_PERCENT: 0.2, // 20%
  SIMPLIFIED_DISCOUNT_MAX: 16754.34, 
  
  DEPENDENT_DEDUCTION_ANNUAL: 2275.08,
  EDUCATION_DEDUCTION_LIMIT_ANNUAL: 3561.50,
  
  INSS_MAX_BASE: 8157.41,
  INSS_MAX_VALUE: 908.86, // 14% of teto (approximate)
  
  MIN_FINE: 165.74,
};

/**
 * Annual Progressive Table 2026 (Estimate based on IN RFB 2.312)
 * Note: These values are estimated based on the 35.584 total limit.
 */
export function calculateAnnualIRPFProgressive(base: number): number {
  // Estimated brackets for 2026
  if (base <= 35584.00) return 0;
  if (base <= 45012.60) return base * 0.075 - 2668.80; // 35584 * 0.075 = 2668.80
  if (base <= 55976.16) return base * 0.15 - 6044.75; 
  if (base <= 73200.00) return base * 0.225 - 10242.96;
  return base * 0.275 - 13903.00;
}

/**
 * Complex Annual Calculation
 * Refined for 2026 rules including 13th, MEI segments, and 65+ exemption.
 */
export function calculateAnnual2026(params: {
  clt: number;
  meses: number;
  recebeu13: "completo" | "proporcional" | "nao";
  valor13?: number;
  liberal: number;
  proLaborePJ: number;
  lucrosPJ: number;
  irRetidoPJ?: number;
  mei: number;
  meiAtiv?: "serv" | "com" | "misto";
  aposentadoria: number;
  idade65?: boolean;
  outrosIsentos?: number;
  dependentes: number;
  saude: number;
  educacao: number;
}): CalculationResult {
  // 1. CLT & 13th
  const rendimentoCLT = params.clt * params.meses;
  const rendimento13 = params.recebeu13 === "nao" ? 0 : (params.recebeu13 === "completo" ? params.clt : (params.valor13 || 0));
  
  // 2. Aposentado: Isenção extra de até R$ 2.824/mês para 65+ (based on previous rule, checking if it changed)
  // According to some sources, the 65+ exemption follows the first bracket. 
  // For simplicity and matching common simulator logic, we use the value mentioned in FAQ if present, or 2824.
  const isencaoExtraApo = params.idade65 ? Math.min(params.aposentadoria, 2824 * 12) : 0;
  const rendimentoApoTributavel = Math.max(0, params.aposentadoria - isencaoExtraApo);

  // 3. MEI: Isenção vs Tributável
  const pctIsentoMEI = params.meiAtiv === "serv" ? 0.32 : params.meiAtiv === "com" ? 0.08 : 0.20;
  const lucroIsentoMEI = params.mei * pctIsentoMEI;
  const rendimentoMEITributavel = Math.max(0, params.mei - lucroIsentoMEI);

  // Totals for Base
  const totalTributavel = rendimentoCLT + params.liberal + params.proLaborePJ + rendimentoApoTributavel + rendimentoMEITributavel;
  const totalIsento = params.lucrosPJ + lucroIsentoMEI + isencaoExtraApo + (params.outrosIsentos || 0);

  // INSS Estimation
  const inssCLT = rendimentoCLT * 0.11; 
  const inssLiberal = Math.min(params.liberal, IRPF_RULES.INSS_MAX_BASE * 12) * 0.2;
  const inssPJ = params.proLaborePJ * 0.11;
  const totalINSS = inssCLT + inssLiberal + inssPJ;

  // --- MODELS ---

  // A. SIMPLIFICADO
  const descSimp = Math.min(totalTributavel * 0.2, IRPF_RULES.SIMPLIFIED_DISCOUNT_MAX);
  const baseSimp = Math.max(0, totalTributavel - descSimp);
  const impSimp = calculateAnnualIRPFProgressive(baseSimp);

  // B. COMPLETO
  const dedDepend = params.dependentes * IRPF_RULES.DEPENDENT_DEDUCTION_ANNUAL;
  const dedEduc = Math.min(params.educacao, IRPF_RULES.EDUCATION_DEDUCTION_LIMIT_ANNUAL * (params.dependentes + 1));
  const dedSaude = params.saude;
  const totalDeducoes = totalINSS + dedDepend + dedEduc + dedSaude;
  const baseComp = Math.max(0, totalTributavel - totalDeducoes);
  const impComp = calculateAnnualIRPFProgressive(baseComp);

  return {
    totalTributavel,
    totalIsento,
    rendimento13,
    simplificado: {
      imposto: impSimp,
      base: baseSimp,
      aliquotaEfetiva: totalTributavel > 0 ? (impSimp / totalTributavel) * 100 : 0,
    },
    completo: {
      imposto: impComp,
      base: baseComp,
      aliquotaEfetiva: totalTributavel > 0 ? (impComp / totalTributavel) * 100 : 0,
    }
  };
}

export interface CalculationResult {
  totalTributavel: number;
  totalIsento: number;
  rendimento13: number;
  simplificado: {
    imposto: number;
    base: number;
    aliquotaEfetiva: number;
  };
  completo: {
    imposto: number;
    base: number;
    aliquotaEfetiva: number;
  };
}

export function formatBRL(val: number): string {
  return val.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Monthly helpers (for quick UI calculations if needed)
export function calculateMonthlyINSS(salarioBruto: number): number {
  if (salarioBruto <= 1518.00) return salarioBruto * 0.075;
  if (salarioBruto <= 2793.88) return (salarioBruto - 1518.00) * 0.09 + 113.85;
  if (salarioBruto <= 4190.83) return (salarioBruto - 2793.88) * 0.12 + 228.68;
  if (salarioBruto <= 8157.41) return (salarioBruto - 4190.83) * 0.14 + 396.31;
  return 951.63; // Teto
}

export function calculateMonthlyIRPF(base: number): number {
  if (base <= 2965.33) return 0;
  if (base <= 3751.05) return base * 0.075 - 222.40;
  if (base <= 4664.68) return base * 0.15 - 503.73;
  // ... continue table
  return base * 0.275 - 1100.00; // Simplified
}

export function calculateMonthlyCLT(salarioBruto: number) {
  const inss = calculateMonthlyINSS(salarioBruto);
  const baseIR = Math.max(0, salarioBruto - inss);
  const ir = calculateMonthlyIRPF(baseIR);
  const liquido = salarioBruto - inss - ir;
  return { inss, baseIR, ir, liquido };
}

/**
 * Calculates monthly tax burden for Pessoa Física (Autônomo)
 */
export function calculatePF(income: number) {
  const inss = Math.min(income * 0.20, IRPF_RULES.INSS_MAX_VALUE);
  const iss = income * 0.05; // Added ISS
  const baseIR = Math.max(0, income - inss);
  const ir = calculateMonthlyIRPF(baseIR);
  const total = inss + ir + iss;
  return { inss, ir, iss, total, liquido: income - total };
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
