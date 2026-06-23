import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "O e-mail ou nome de utilizador é obrigatório."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Base dos dados comuns
const baseAuthFields = {
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  apelido: z.string().min(2, "O apelido deve ter pelo menos 2 caracteres."),
  email: z.string().email("Insira um email válido."),
  contacto: z.string().min(9, "O contacto deve ter pelo menos 9 dígitos."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
};

// 1. Schema usado exclusivamente pelo React Hook Form no Frontend
export const registerSchema = z.object({
  ...baseAuthFields,
  passwordConfirm: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos."),
}).refine((data) => {
  // Se a senha for maior que 6, a confirmação torna-se obrigatória e idêntica
  if (data.password && data.password.length > 6) {
    return data.password === data.passwordConfirm;
  }
  return true;
}, {
  message: "As palavras-passes não coincidem.",
  path: ["passwordConfirm"],
});

// 2. Schema usado pela Server Action para validar os dados limpos que vão para a API
export const registerApiSchema = z.object(baseAuthFields);

// Tipagens corretas para o TypeScript
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;
