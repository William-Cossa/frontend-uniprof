"use server";

import { cookies } from "next/headers";
import * as jose from "jose";
import { registerSchema, loginSchema, RegisterFormData, LoginFormData, RegisterApiData, registerApiSchema } from "@/lib/schemas/auth";

const AUTH_URL = process.env.AUTH_SERVICE_URL
export type AuthState = {
  error?: string;
  success?: string;
};

export async function loginAction(
  data: LoginFormData
): Promise<AuthState> {
  const parseResult = loginSchema.safeParse(data);
  if (!parseResult.success) {
    return { error: "Dados inválidos." };
  }

  try {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parseResult.data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Erro ao fazer login." };
    }

    // Assume the token is returned in result.token or result.data.token
    const token = result.token || result.data?.token;

    if (token) {
      cookies().set({
        name: "uniprof_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return { success: "Login realizado com sucesso!" };
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Erro interno no servidor externo." };
  }
}


export async function registerAction(
  data: RegisterApiData
): Promise<AuthState> {
  const parseResult = registerApiSchema.safeParse(data);

  if (!parseResult.success) {
    console.error("Erros da API:", parseResult.error.flatten());
    return { error: "Dados inválidos enviados para o servidor." };
  }

  try {
    const res = await fetch(`${AUTH_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parseResult.data),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Erro ao fazer registro." };
    }

    return { success: "Registro realizado com sucesso! Verifique seu email ou continue para login." };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Erro interno no servidor externo." };
  }
}


export async function getCurrentUserProfile() {
  try {
    const token = cookies().get("uniprof_token")?.value;
    if (!token) return { error: "Não autenticado." };

    let payload;
    try {
      payload = jose.decodeJwt(token);
    } catch {
      return { error: "Token inválido." };
    }

    const userId = payload.id; // Usually 'id' or 'sub' or 'userId'
    if (!userId) {
      return { error: "ID de usuário não encontrado no token." };
    }

    const res = await fetch(`${AUTH_URL}/auth/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { error: errorData.message || "Falha ao buscar perfil do usuário." };
    }

    const user = await res.json();
    return { data: user };
  } catch (error) {
    console.error("GetCurrentUserProfile Error:", error);
    return { error: "Erro interno ao buscar perfil." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    const res = await fetch(`${AUTH_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return { status: res.status };
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return { status: 500 };
  }
}

export async function resend_OTP(email: string) {
  try {
    const res = await fetch(`${AUTH_URL}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return { status: res.status };
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return { status: 500 };
  }
}

export async function logout() {
  cookies().delete("uniprof_token");
}

