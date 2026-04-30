"use server"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { processPayment } from "@/lib/services/payment.service";

const API_URL = process.env.API_BASE_URL;

export async function createAgendamento(data: {
  mentor_id: string;
  slot_ids: string[];
  paymentMethod: string;
  phoneNumber?: string;
}) {
  try {
    const token = cookies().get("unimentors_token")?.value;

    if (!token) {
      return { error: "Não autenticado. Por favor, faça login." };
    }
    // ── STEP 1: Criar Agendamento (status: "aguardando_pagamento") ──
    const res = await fetch(`${API_URL}/agendamentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        mentor_id: data.mentor_id,
        slot_ids: data.slot_ids,
      }),
    });

    const agendamento = await res.json();

    if (!res.ok) {
      console.error("[Agendamento] Falha ao criar:", agendamento);
      return { error: agendamento.message || "Erro ao criar agendamento no servidor." };
    }

    const agendamentoId: string = agendamento.id;
    const precoServidor: number = Number(agendamento.preco);

    console.log("[Agendamento] Criado:", { agendamentoId, precoServidor, status: agendamento.status });

    // ── STEP 2: Processar Pagamento ──
    if (data.paymentMethod === "mpesa") {
      if (!data.phoneNumber) {
        await updateAgendamentoStatus(agendamentoId, "cancelado", token);
        return { error: "Número de telefone é obrigatório para pagamento M-Pesa." };
      }

      const paymentResult = await processPayment({
        token,
        phoneNumber: data.phoneNumber,
        agendamentoId,
        amount: precoServidor,
        paymentMethod: data.paymentMethod,
      });

      if (!paymentResult.success) {
        console.error("[Agendamento] Pagamento falhou, cancelando agendamento:", agendamentoId);
        await updateAgendamentoStatus(agendamentoId, "cancelado", token);
        return { error: paymentResult.error || "Erro ao processar pagamento." };
      }

      // ── STEP 3: Confirmar agendamento ──
      console.log("[Agendamento] Pagamento aprovado, confirmando:", agendamentoId);
      await updateAgendamentoStatus(agendamentoId, "confirmado", token);
    }

    revalidatePath("/mentores");
    revalidatePath(`/mentor/${data.mentor_id}`);

    return { success: "Agendamento criado com sucesso!" };
  } catch (error) {
    console.error("[Agendamento] Erro fatal:", error);
    return { error: "Erro interno no servidor." };
  }
}

async function updateAgendamentoStatus(agendamentoId: string, status: string, token: string) {
  try {
    const res = await fetch(`${API_URL}/agendamentos/${agendamentoId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Internal-Secret": process.env.INTERNAL_API_SECRET || ""
      },
      body: JSON.stringify({ status }),
    });


    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error(`[Agendamento] Falha ao atualizar status para ${status}:`, body);
    } else {
      console.log(`[Agendamento] Status atualizado: ${agendamentoId} → ${status}`);
    }
  } catch (error) {
    console.error(`[Agendamento] Erro ao atualizar status ${agendamentoId}:`, error);
  }
}

export async function calcularPreco(data: { mentor_id: string; slot_ids: string[] }) {
  try {
    const token = cookies().get("unimentors_token")?.value;

    if (!token) {
      return { error: "Não autenticado." };
    }

    const res = await fetch(`${API_URL}/agendamentos/calcular-preco`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Erro ao calcular preço." };
    }

    return { data: result as { preco: number; duracaoMinutos: number; precoHora: number; numSlots: number } };
  } catch (error) {
    console.error("Erro ao calcular preço:", error);
    return { error: "Erro interno no servidor." };
  }
}

export async function getMenteeBookings() {
  try {
    const token = cookies().get("unimentors_token")?.value;

    if (!token) {
      return { error: "Não autenticado." };
    }

    const res = await fetch(`${API_URL}/agendamentos/minhas-mentorias`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Erro ao buscar agendamentos." };
    }

    return { data: result };
  } catch (error) {
    console.error("Erro ao carregar mentorias:", error);
    return { error: "Erro interno no servidor." };
  }
}

export async function getBookingById(id: string) {
  try {
    const token = cookies().get("unimentors_token")?.value;

    if (!token) {
      return { error: "Não autenticado." };
    }

    const res = await fetch(`${API_URL}/agendamentos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Erro ao buscar agendamento." };
    }

    return { data: result };
  } catch (error) {
    console.error(`Erro ao carregar mentoria ${id}:`, error);
    return { error: "Erro interno no servidor." };
  }
}
