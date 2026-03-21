# Documento de Contexto — Portal IRPF 2026 · Inovacont
## Para uso por sistemas de inteligência artificial

**Versão:** 1.0 · **Arquivo principal:** `irpf2026.html` · **Data de referência:** Março 2026

---

## 1. PROPÓSITO E OBJETIVO

Este documento descreve a estrutura, lógica de funcionamento e embasamentos legais do Portal IRPF 2026 da Inovacont — uma landing page single-file (`irpf2026.html`) que combina conteúdo educativo sobre declaração do Imposto de Renda 2026 com um simulador interativo de obrigatoriedade e estimativa de IR.

### Missão da página
Converter visitantes em leads e clientes para os serviços de declaração de IR da Inovacont, com foco em **profissionais da saúde** (médicos, dentistas, psicólogos, fisioterapeutas) que possuem estruturas tributárias complexas (CLT + PJ, MEI, autônomos).

### Público-alvo
- Profissionais da saúde com dúvidas sobre obrigatoriedade de declaração
- Médicos e dentistas com PJ médica (pró-labore + distribuição de lucros)
- Autônomos e prestadores de serviço no CPF
- Aposentados e pensionistas com renda INSS
- MEI de serviços de saúde

---

## 2. ARQUITETURA TÉCNICA

```
irpf2026.html (único arquivo, ~306 KB, self-contained)
├── <head>
│   ├── Meta tags OG / Twitter Card / Schema.org (WebApplication + FAQPage)
│   ├── Google Fonts: Sora + IBM Plex Mono
│   └── <style> CSS (~60 KB)
├── <body>
│   ├── Barra de progresso de leitura (#read-progress)
│   ├── Hero (logo + título + CTA)
│   ├── Stats bar (4 números-chave)
│   ├── Seção: Quem deve declarar (#quem-deve)
│   ├── Simulador IRPF (#simulador) ← CORE
│   ├── Prazos e penalidades (#prazos)
│   ├── Especialistas em saúde (#inovacont)
│   ├── Como funciona declarar
│   ├── Prova social (depoimentos)
│   ├── FAQ (#faq)
│   ├── Footer
│   └── Sticky CTA bar
└── <script> JavaScript (~56 KB)
```

**Stack:** HTML5 + CSS3 + JavaScript puro. Sem frameworks. Sem dependências externas além de Google Fonts.

---

## 3. IDENTIDADE VISUAL — PRESERVAR FIELMENTE

### Paleta de cores (variáveis CSS)

| Variável CSS | Hex | Uso obrigatório |
|---|---|---|
| `--deep` | `#1A1060` | Fundos escuros principais, nav, simulador, footer |
| `--navy` | `#2D1F8F` | Gradientes secundários |
| `--mid` | `#3D2BAD` | Gradientes intermediários |
| `--purple` | `#4B35C8` | Elementos de destaque, stats bar |
| `--violet` | `#6B55E0` | CTAs, bordas ativas, steps ativos, botões |
| `--lavender` | `#8B78EF` | Hover states, destaques suaves |
| `--muted` | `#A99EF5` | Textos secundários em fundo escuro |
| `--soft` | `#C9C2FA` | Textos terciários em fundo escuro |
| `--bg` | `#F4F2FF` | Fundo geral do site (lavanda muito claro) |
| `--gold` | `#F5A623` | Urgência, prazo, alertas, deadline |
| `--gold-lt` | `#FFC84A` | Texto dourado em fundo escuro |
| `--green` | `#2ECC71` | WhatsApp, sucesso, confirmação |
| `--red` | `#E74C3C` | Erros, valores negativos no IR |
| `--text` | `#1A1060` | Texto principal em fundo claro |
| `--sub` | `#5A4E99` | Texto secundário em fundo claro |

**Padrão decorativo:** hachura diagonal em SVG inline (`stroke-opacity: 0.06–0.08`) em todas as seções. Fundos escuros usam `background-blend-mode: overlay`.

### Tipografia (Google Fonts — NÃO substituir)

| Fonte | Peso(s) | Uso |
|---|---|---|
| **Sora** | 300, 400, 500, 600, 700, 800 | Toda a tipografia do site |
| **IBM Plex Mono** | 400, 500, 600, 700 | Valores monetários, percentuais, contadores |

**Hierarquia de texto:**
- H1 hero: `clamp(34px, 5vw, 56px)` weight 800, color white
- H2 seções: `clamp(26px, 3.5vw, 36px)` weight 800, color `--text`
- Body: 14–16px weight 400, color `--sub`
- Labels cards: 11–12px weight 700, uppercase, letter-spacing 0.1em
- Valores monetários: IBM Plex Mono, weight 700

---

## 4. ESTRUTURA DE SEÇÕES (ordem fixa na página)

1. **Hero** — logo Inovacont + badge de urgência + título + CTA único + trust row
2. **Stats bar** — 4 números: R$ 35.584 / R$ 800 mil / 27,5% / 29/05/2026
3. **Quem deve declarar** — 8 critérios expansíveis com exemplos práticos
4. **Simulador IRPF** — 5 steps interativos (CORE da página)
5. **Prazos e penalidades** — timeline + countdown + card de multas
6. **Especialistas em saúde** — merchandising Inovacont
7. **Como funciona declarar** — 4 passos do processo
8. **Prova social** — números + 3 depoimentos
9. **FAQ** — 10 perguntas frequentes
10. **Footer** — base legal

---

## 5. SIMULADOR IRPF — LÓGICA CENTRAL (PRESERVAR FIELMENTE)

### 5.1 Fluxo de navegação entre steps

```
Step 0 → Step 1 → Step 2 → Step 3 → Step 4
Vínculos  Rendimentos  Patrimônio  Deduções  Resultado
```

- Navegação via `goTo(n)` — NÃO rola automaticamente a página
- Valores preservados ao voltar (buildS1 não reconstrói se já existir)
- Estado global: `VT = {}` (vínculos) e `A = {}` (respostas)

### 5.2 Vínculos disponíveis (multi-seleção)

| Código | Nome | Regra especial |
|---|---|---|
| `clt` | CLT — Empregado | INSS progressivo; 13º exclusivo na fonte |
| `autonomo` | Profissional Liberal / Autônomo | INSS 20% CI; teto R$ 908,86/mês |
| `pj` | PJ — Pessoa Jurídica | INSS 11% pró-labore; lucros isentos |
| `apo` | Aposentado / Pensionista | Isenção R$ 2.824/mês para 65+ |
| `mei` | MEI | Lucro presumido isento; SEM pró-labore; DAS fixo |

**Regra de exclusividade:** MEI e PJ são incompatíveis. Implementar verificação em ambas as direções.

### 5.3 Cálculo do INSS 2025 — Tabela Progressiva (PRESERVAR)

**Base legal:** Portaria MPS / Tabela INSS 2025

```
Faixa 1: até R$ 1.518,00           → 7,5%
Faixa 2: R$ 1.518,01 a R$ 2.793,88 → 9,0%
Faixa 3: R$ 2.793,89 a R$ 4.190,83 → 12,0%
Faixa 4: R$ 4.190,84 a R$ 8.157,41 → 14,0%
```

**Método:** Cálculo PROGRESSIVO (cada faixa aplica sua alíquota apenas sobre o valor dentro daquela faixa — igual ao IRPF). NÃO é sobre o salário total.

```javascript
function calcINSS(sal) {
  const t = [{lim:1518,r:.075},{lim:2793.88,r:.09},{lim:4190.83,r:.12},{lim:8157.41,r:.14}];
  let v=0, prev=0;
  for(const f of t){
    if(sal<=prev) break;
    v += (Math.min(sal,f.lim)-prev)*f.r;
    prev=f.lim;
    if(sal<=f.lim) break;
  }
  return +v.toFixed(2);
}
```

### 5.4 Cálculo do IRPF — Tabela Progressiva Mensal 2025 (PRESERVAR)

**Base legal:** IN RFB nº 2.312/2026, Art. 2º + tabela progressiva ano-calendário 2025

```
Até R$ 2.824,00          → Isento
R$ 2.824,01 a R$ 3.751,05 → 7,5%  − R$ 211,80
R$ 3.751,06 a R$ 4.664,68 → 15,0% − R$ 492,78
R$ 4.664,69 a R$ 6.101,06 → 22,5% − R$ 842,11
Acima de R$ 6.101,06      → 27,5% − R$ 1.147,63
```

**Fórmula:** `IR = Base_mensal × Alíquota − Parcela_dedução`

```javascript
function calcIRMes(base){
  if(base<=2824)    return 0;
  if(base<=3751.05) return base*.075 - 211.80;
  if(base<=4664.68) return base*.15  - 492.78;
  if(base<=6101.06) return base*.225 - 842.11;
  return base*.275 - 1147.63;
}
```

**Para ajuste anual:** `irAnual = calcIRMes(baseAnual/12) × 12`

### 5.5 Critérios de Obrigatoriedade (PRESERVAR — Base: IN RFB 2.312/2026)

| Critério | Limite | Artigo |
|---|---|---|
| Rendimentos tributáveis | > R$ 35.584,00/ano | Art. 2º, I |
| Rendimentos isentos/excl. fonte | > R$ 200.000,00/ano | Art. 2º, II |
| Alienação de bens | qualquer valor com ganho | Art. 2º, III |
| Bolsa de valores | > R$ 40.000 ou com lucro | Art. 2º, IV |
| Atividade rural | > R$ 177.920,00 | Art. 2º, V |
| Patrimônio em 31/12 | > R$ 800.000,00 | Art. 2º, VI |
| Mudança de residência para o Brasil | qualquer | Art. 2º, VII |
| Ativos/offshores no exterior | qualquer | Art. 2º, IX–XII / Lei 14.754/2023 |

### 5.6 Desconto Simplificado (PRESERVAR)

**Base legal:** IN RFB 2.312/2026, Art. 3º

```
Desconto = min(rendaTrib × 20%, R$ 16.754,34)
Base_simplificada = rendaTrib − Desconto
```

Substitui TODAS as deduções legais (INSS, dependentes, saúde, educação).

### 5.7 Deduções Legais (PRESERVAR)

```
Dependente:  R$ 2.275,08/ano por dependente
Educação:    até R$ 3.561,50/ano por pessoa (contribuinte + dependentes)
Saúde:       sem limite (médicos, planos, exames com comprovante)
INSS:        valor total pago no ano (calculado automaticamente)
```

### 5.8 Tratamento do 13º Salário (CRÍTICO — PRESERVAR)

**Base legal:** Art. 700, inciso III, RIR/2018 (Decreto 9.580/2018) + IN RFB nº 1.500/2014

**REGRA OBRIGATÓRIA:** O 13º salário tem **tributação exclusiva na fonte**. Isso significa:
1. O IR sobre o 13º é retido pelo empregador e é DEFINITIVO
2. O 13º NÃO integra a base de cálculo do ajuste anual
3. O IRRF do 13º NÃO pode ser somado ao IRRF dos rendimentos mensais
4. Na declaração, é informado na ficha "Rendimentos Tributáveis Recebidos de PJ" — o programa da Receita Federal segrega automaticamente

**Implementação correta:**
```javascript
// 13º é calculado separadamente apenas para informação
const dec3Bruto = /* valor do 13º */;
const dec3INSS  = calcINSS(dec3Bruto);
const dec3IR    = calcIRMes(dec3Bruto - dec3INSS); // apenas informativo

// NÃO fazer isso (ERRADO):
// rendaTrib += dec3Bruto; ← NUNCA somar ao rendaTrib
```

### 5.9 Tratamento do MEI (PRESERVAR)

**Base legal:** Lei Complementar 123/2006, art. 18-A + Resolução CGSN

```
Atividade de serviços:    lucro presumido isento = 32% do faturamento
Comércio / indústria:     lucro presumido isento = 8% do faturamento
Ambas (misto):            usar média = 20%
```

**Regras obrigatórias:**
- MEI **NÃO tem pró-labore** formal — campo deve ser omitido
- O lucro presumido isento vai para "Rendimentos Isentos" na declaração
- O faturamento (não o lucro) é verificado para limite de R$ 200.000 de isentos
- DAS 2025: R$ 75,90 (serviços) / R$ 76,90 (comércio) / R$ 77,90 (ambos)
- Limite de faturamento MEI 2025: R$ 81.000/ano

### 5.10 Acumulação de Rendimentos (múltiplos vínculos)

```javascript
// Ordem de acumulação — todos somam ao rendaTrib e inssAnual
// CLT:
rendaTrib += salario × meses
inssAnual += calcINSS(salario) × meses
// 13º: NÃO somar (ver 5.8)

// Autônomo:
rendaTrib += rendimentoAnualTotal
inssAnual += min(rendimentoAnual × 0.20, 908.86 × 12)

// PJ:
rendaTrib += proLabore × 12
inssAnual += proLabore × 0.11 × 12

// APO (65+):
rendaTrib += max(0, beneficio − 2824) × 12

// MEI: rendaTrib += 0 (isento)
```

### 5.11 Comparativo Simplificado vs. Deduções

```javascript
// Simplificado
irS = calcIRMes( max(0, rendaTrib - min(rendaTrib*0.20, 16754.34)) / 12 ) * 12

// Deduções legais
dedComp  = inssAnual + deps*2275.08 + saude + min(educacao, (deps||1)*3561.50)
irC = calcIRMes( max(0, rendaTrib - dedComp) / 12 ) * 12

// Automático: usa o menor entre irS e irC
```

---

## 6. PRAZOS E PENALIDADES (PRESERVAR — IN RFB 2.312/2026)

| Data | Evento | Artigo |
|---|---|---|
| 23/03/2026 | Abertura do prazo | Art. 7º |
| 10/05/2026 | Último dia para débito automático — 1ª quota | Art. 12 |
| 29/05/2026 23:59 | Prazo final sem multa | Art. 7º |
| Maio–Nov 2026 | Lotes de restituição (até 7) | Art. 11 |
| Após 29/05/2026 | Multa 1%/mês sobre imposto devido | Art. 10, §1º, II |

**Multa mínima:** R$ 165,74 (Art. 10, §1º, I) — mesmo sem imposto a pagar  
**Multa máxima:** 20% do imposto devido  
**Parcelamento:** até 8 quotas mensais, mínimo R$ 50/quota (Art. 12)  
**Quota única:** imposto < R$ 100  
**Selic:** quotas a partir da 2ª têm acréscimo da Selic + 1%

**Prioridade de restituição (Art. 11):**
1. 80 anos ou mais
2. 60+, deficientes físicos/mentais, moléstia grave
3. Magistério como maior fonte de renda
4. Pré-preenchida E/OU recebimento via Pix
5. Demais, ordem cronológica

---

## 7. FUNCIONALIDADES GLOBAIS (PRESERVAR COMPORTAMENTO)

| Funcionalidade | Implementação | Comportamento |
|---|---|---|
| Barra de progresso leitura | `#read-bar` + evento scroll | Avança com scroll, gradiente roxo |
| Sticky CTA bar | Aparece após 420px scroll | Countdown + botões WA e Simular |
| FAQ interativo | Classe `.open` no `.faq-item` | Fundo `--deep`, texto branco quando aberto |
| Compartilhar resultado | Web Share API → fallback WhatsApp | Abre nativo em mobile |
| Imprimir resultado | `window.print()` + style injetado | Isola apenas `#step4` |
| Lead capture | Email + WhatsApp → Supabase + WA | Salva na tabela `leads_irpf` antes de redirecionar |
| Scroll entre steps | Condicional — só se simulador fora de vista | NÃO rola quando usuário já está no simulador |
| Preservar valores no voltar | `buildS1(force=false)` | HTML preservado, updaters reativados |

---

## 8. INTEGRAÇÃO SUPABASE (leads_irpf)

**Projeto:** InovaHUB  
**URL:** `https://uquicdiottpntcskrkuv.supabase.co`

**Tabela:** `leads_irpf`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | Gerado automaticamente |
| `email` | text | E-mail do lead |
| `whatsapp` | text | Número WhatsApp informado |
| `origem` | text | Sempre `simulador_irpf2026` |
| `vinculo` | text | Vínculos selecionados (ex: `clt+mei`) |
| `criado_em` | timestamptz | Timestamp automático |

**Política RLS:**
- INSERT: aberto para `anon`
- SELECT: apenas `authenticated`

---

## 9. CONTATO WHATSAPP

**Número:** `5574999697652`  
**Formato URL:** `https://wa.me/5574999697652?text=MENSAGEM_ENCODED`

Todos os CTAs devem redirecionar para este número com mensagens contextuais pré-preenchidas.

---

## 10. SEO E META TAGS

```html
<meta property="og:type" content="website">
<meta property="og:title" content="Simulador IRPF 2026 Gratuito — Inovacont">
<meta property="og:url" content="https://inovacont.com.br/irpf2026">
<link rel="canonical" href="https://inovacont.com.br/irpf2026">
```

Schema.org: `WebApplication` + `AccountingService` + `FAQPage`

---

## 11. RESPONSIVIDADE — BREAKPOINTS

| Breakpoint | Target | Mudanças principais |
|---|---|---|
| `≥ 1920px` | Full HD | font-size 17px, max-widths até 1800px |
| `≥ 1440px` | Large desktop | max-widths até 1600px, paddings 80px |
| `≤ 1024px` | Tablet landscape | Grids 2 colunas, padding 32px |
| `≤ 768px` | Tablet portrait | Coluna única, padding 20px |
| `≤ 480px` | Mobile | Padding 16px, inputs font-size 16px (iOS) |
| `≤ 380px` | Mobile pequeno | Labels ocultos, títulos menores |

---

## 12. DISCLAIMERS OBRIGATÓRIOS

Toda modificação desta página DEVE preservar os seguintes disclaimers:

1. **"Simulação de caráter educativo — não substitui orientação de contador ou advogado tributarista"**
2. **"Baseado na IN RFB 2.312/2026"** — referência à norma deve sempre estar presente
3. **Nota sobre 13º salário:** sempre informar que tem tributação exclusiva na fonte e não altera o ajuste anual
4. **Nota sobre MEI:** sempre informar que o lucro presumido isento não integra a base do IR pessoal

---

## 13. O QUE NÃO PODE SER ALTERADO

- Tabelas INSS 2025 (faixas e alíquotas)
- Tabela IR mensal 2025 (faixas, alíquotas e parcelas de dedução)
- Critérios de obrigatoriedade da IN RFB 2.312/2026
- Tratamento do 13º como tributação exclusiva (NÃO somar ao rendaTrib)
- MEI sem pró-labore
- Exclusividade MEI ↔ PJ
- Percentuais de lucro presumido MEI (32% serviços / 8% comércio)
- Limites de desconto simplificado (20% / R$ 16.754,34)
- Valores de dedução por dependente (R$ 2.275,08) e educação (R$ 3.561,50)
- Prazo final 29/05/2026
- Multa mínima R$ 165,74
- Número WhatsApp 5574999697652
- Paleta de cores (variáveis CSS `--deep` a `--sub`)
- Fontes Sora + IBM Plex Mono

---

*Documento gerado em março de 2026 · Inovacont Contabilidade Digital*  
*Para uso exclusivo como contexto para sistemas de IA na manutenção e evolução do portal IRPF 2026*
