"use client";

import { useState } from "react";
import { Link2, Check, Loader2 } from "lucide-react";
import { gerarLinkMentor } from "@/lib/actions/agendamento-actions";

interface MentorSessionLinkButtonProps {
  agendamentoId: string;
}

/**
 * Botão para o mentor gerar e copiar o link seguro de acesso à videochamada.
 * Chama o backend para gerar um token de sessão de curta duração (4h).
 */
export function MentorSessionLinkButton({ agendamentoId }: MentorSessionLinkButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = async () => {
    setState("loading");
    setErrorMsg("");

    const result = await gerarLinkMentor(agendamentoId);

    if (result.error || !result.data) {
      setErrorMsg(result.error || "Erro ao gerar link.");
      setState("error");
      setTimeout(() => setState("idle"), 3000);
      return;
    }

    try {
      await navigator.clipboard.writeText(result.data.link);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      // Fallback se clipboard API não estiver disponível
      setErrorMsg("Link: " + result.data.link);
      setState("error");
    }
  };

  const label = {
    idle: "Copiar Link da Sessão",
    loading: "A gerar...",
    copied: "Link Copiado!",
    error: errorMsg || "Erro ao gerar link",
  }[state];

  const icon = {
    idle: <Link2 className="w-4 h-4" />,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    copied: <Check className="w-4 h-4" />,
    error: <Link2 className="w-4 h-4" />,
  }[state];

  return (
    <button
      onClick={handleCopy}
      disabled={state === "loading"}
      title="Gera um link seguro (válido 4h) para partilhar com o mentorando"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        fontSize: "13px",
        fontWeight: 500,
        borderRadius: "8px",
        border: `1px solid ${state === "error" ? "#ef4444" : state === "copied" ? "#10b981" : "rgba(255,255,255,0.15)"}`,
        backgroundColor:
          state === "copied"
            ? "rgba(16,185,129,0.15)"
            : state === "error"
            ? "rgba(239,68,68,0.15)"
            : "rgba(255,255,255,0.07)",
        color:
          state === "copied" ? "#10b981" : state === "error" ? "#ef4444" : "#cbd5e1",
        cursor: state === "loading" ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (state === "idle") {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (state === "idle") {
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
        }
      }}
    >
      {icon}
      {label}
    </button>
  );
}
