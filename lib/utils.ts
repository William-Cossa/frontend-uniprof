import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Erro desconhecido, tente novamente";
  }

  return message;
};
export function gerarIdUnicoRef() {
  const prefixo = "MNT";
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const parteAleatoria = Array.from({ length: 10 }, () => {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }).join("");
  return `${prefixo}${parteAleatoria}`;
}

