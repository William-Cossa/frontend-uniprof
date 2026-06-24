import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().email("Insira um email válido."),
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

export const registerSchema = z.object({
  ...baseAuthFields,
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

export const registerApiSchema = z.object(baseAuthFields);

export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;
