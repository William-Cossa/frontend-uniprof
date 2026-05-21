"use server"

import axios from "axios";
import * as jose from "jose";
import { gerarIdUnicoRef } from "../utils";

const PAYMENT_URL = process.env.PAYMENT_SERVICE_URL;

export interface PaymentRequest {
  token: string;
  phoneNumber: string;
  agendamentoId: string;
  amount: number;
  paymentMethod: string;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  const { token, phoneNumber, agendamentoId, amount, paymentMethod } = request;

  if (!PAYMENT_URL) {
    console.error("[PaymentService] PAYMENT_SERVICE_URL não configurado no .env.local");
    return { success: false, error: "Serviço de pagamento indisponível. Contacte o suporte." };
  }

  if (!phoneNumber || phoneNumber.trim().length < 9) {
    return { success: false, error: "Número de telefone inválido." };
  }

  if (amount <= 0) {
    return { success: false, error: "Valor de pagamento inválido." };
  }

  const decoded = jose.decodeJwt(token);
  const userId = decoded.userId || decoded.id || decoded.sub;

  if (!userId) {
    return { success: false, error: "Token inválido: ID do usuário não encontrado." };
  }

  const payload = {
    userId,
    paymentMethod,
    phoneNumber: phoneNumber.trim(),
    service: "uniprof",
    serviceId: agendamentoId,
    amount,
  };

  console.log("[PaymentService] Enviando pagamento:", {
    url: `${PAYMENT_URL}/payments/create`,
    serviceId: agendamentoId,
    amount,
    paymentMethod,
    phoneNumber: phoneNumber.replace(/\d(?=\d{4})/g, "*"),
    payload: payload
  });

  try {
    const response = await axios.post(
      `${PAYMENT_URL}/payments/create`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // timeout: 30000,
      }
    );

    console.log("[PaymentService] Resposta:", {
      status: response.status,
      data: response.data,
    });

    if (response.status !== 200 && response.status !== 201) {
      return { success: false, error: "Falha ao processar pagamento. Verifique o seu saldo ou tente novamente." };
    }

    const { payment, mpesa } = response.data || {};

    if (payment?.status === "failed" || mpesa?.status === false) {
      const errorMsg = mpesa?.responseDescription || "Falha na transação M-Pesa. Verifique seu PIN e saldo.";
      console.error("[PaymentService] Transação falhou internamente:", {
        paymentStatus: payment?.status,
        mpesaStatus: mpesa?.status,
        description: errorMsg
      });
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    const statusCode = error.response?.status;

    console.error("[PaymentService] Falha:", {
      statusCode,
      errorMessage,
      url: `${PAYMENT_URL}/payments/create`,
    });

    if (statusCode === 401 || statusCode === 403) {
      return { success: false, error: "Sessão expirada. Faça login novamente." };
    }

    if (statusCode === 422 || statusCode === 400) {
      return { success: false, error: errorMessage || "Dados de pagamento inválidos." };
    }

    return { success: false, error: errorMessage || "Erro ao processar pagamento M-Pesa. Tente novamente." };
  }
}
