"use server";

import { prisma } from "@/lib/prisma";

interface LeadData {
  email: string;
  whatsapp: string;
  rendimentos: number;
  patrimonio: number;
  vinculos: string;
  situacoes: string;
  isento: number;
}

export async function saveLead(data: LeadData) {
  await prisma.lead.create({
    data: {
      email: data.email,
      whatsapp: data.whatsapp,
      rendimentos: data.rendimentos,
      patrimonio: data.patrimonio,
      vinculos: data.vinculos,
      situacoes: data.situacoes,
      isento: data.isento,
      origem: "simulador_v3_steps",
    },
  });
}
