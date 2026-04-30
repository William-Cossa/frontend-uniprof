import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "O e-mail ou nome de utilizador é obrigatório."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  apelido: z.string().min(2, "O apelido deve ter pelo menos 2 caracteres."),
  email: z.string().email("Endereço de e-mail inválido."),
  contacto: z.string().min(9, "O contacto deve ter pelo menos 9 dígitos."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
  passwordConfirm: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos."),
}).refine((data) => {
  if (data.password && data.password.length > 6) {
    return data.password === data.passwordConfirm;
  }
  return true;
}, {
  message: "As palavras-passes não coincidem.",
  path: ["passwordConfirm"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
