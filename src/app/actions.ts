"use server";

import { prisma } from "@/lib/prisma";

interface LeadData {
  email: string;
  whatsapp: string;
  vinculos: string;
  situacoes: string;
  isento: number;
  tributavel: number;
  imposto: number;
  obrigado: boolean;
}

export async function saveLead(data: LeadData) {
  await prisma.lead.create({
    data: {
      email: data.email,
      whatsapp: data.whatsapp,
      rendimentos: data.tributavel, // mapping to existing field if possible, or new ones
      patrimonio: 0, // mapping if existing
      vinculos: data.vinculos,
      situacoes: data.situacoes,
      isento: data.isento,
      origem: "simulador_v3_steps",
    },
  });
}
