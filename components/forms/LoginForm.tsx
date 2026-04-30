"use client";

import React from "react";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../ui/InputField";
import { Separator } from "../ui/separator";
import { SubmitButton } from "../SubmitButton";
import { loginSchema, LoginFormData } from "@/lib/schemas/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth-actions";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const redirectUrl =
    new URL(window.location.href).searchParams.get("redirect") || "/mentores";
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await loginAction(data);
      if (response?.error) {
        toast.error("Erro!!!", {
          description: response?.error,
        });
        console.error(response.error);
        return;
      }
      toast.success(response?.success);
      router.push(redirectUrl);
    } catch (error) {
      console.error("Erro inesperado ao tentar fazer login.", error);
      toast.error("Erro do cliente ao tentar fazer login");
    }
  };
  return (
    <div className="bg-white/70 backdrop-blur-xl max-w-md w-full h-full shadow-2xl border border-white/20 py-4 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold ">Bem-vindo de volta!</h2>
          <p className="text-muted-foreground text-sm">
            Retome seu aprendizado e alcance novos horizontes
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <InputField
            icon={<Mail size={20} />}
            label="Email/Nome de Utilizador:"
            placeholder="Insira o seu email ou utilizador"
            type="text"
            {...register("identifier")}
            errorMessage={errors.identifier?.message}
            className=""
          />

          <InputField
            icon={<Lock size={20} />}
            label="Senha:"
            placeholder="Insira a sua senha"
            type="text"
            {...register("password")}
            errorMessage={errors.password?.message}
            className=""
          />

          <Link
            href={"/reset-password"}
            className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline font-medium transition-colors"
          >
            Esqueceu a senha?
          </Link>

          <SubmitButton
            isLoading={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary   py-5 shadow-lg transition-all hover:bg-gradient-to-br hover:shadow-xl"
          />

          <Separator />
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Ainda não tem uma conta?{" "}
            <Link
              href={"/register"}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
