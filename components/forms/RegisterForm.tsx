"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../ui/InputField";
import { Separator } from "../ui/separator";
import { SubmitButton } from "../SubmitButton";
import { RegisterFormData, registerSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { registerAction } from "@/lib/actions/auth-actions";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    mode: "onTouched",
    defaultValues: {
      acceptTerms: false,
    }
  });

  const password = watch("password");
  const isTermsAccepted = watch("acceptTerms");

  const shouldShowConfirmPassword = password && password.length >= 6;

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await registerAction({
        nome: data.nome,
        apelido: data.apelido,
        email: data.email,
        contacto: data.contacto,
        password: data.password,
      });

      if (response?.error) {
        toast.error("Erro!!!", { description: response.error });
        return;
      }

      toast.success(response?.success);

      const redirectTarget = searchParams.get("redirect") || "/mentores";
      router.push(`/login?redirect=${encodeURIComponent(redirectTarget)}`);

    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro de cliente ao tentar registrar.");
    }
  };

  return (
    <div className="bg-background/80 backdrop-blur-xl w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-full shadow-2xl border border-white/20 py-4 lg:overflow-y-auto scrollbar-hide">
      <div className="p-4 sm:p-6 lg:p-8 lg:pt-2 2xl:pt-8">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Crie sua conta</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Junte-se à nossa comunidade de leitores
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="space-y-3 sm:space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              icon={<User size={18} className="sm:w-5 sm:h-5" />}
              label="Nome:"
              placeholder="Seu nome"
              type="text"
              {...register("nome")}
              errorMessage={errors.nome?.message}
              className="text-sm sm:text-base"
            />

            <InputField
              icon={<User size={18} className="sm:w-5 sm:h-5" />}
              label="Apelido:"
              placeholder="Seu apelido"
              type="text"
              {...register("apelido")}
              errorMessage={errors.apelido?.message}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              icon={<Mail size={18} className="sm:w-5 sm:h-5" />}
              label="Email:"
              placeholder="william@email.com"
              type="email"
              {...register("email")}
              errorMessage={errors.email?.message}
              className="text-sm sm:text-base"
            />

            <InputField
              icon={<Phone size={18} className="sm:w-5 sm:h-5" />}
              label="Contacto:"
              placeholder="+258 XX XXX XXXX"
              type="tel"
              {...register("contacto")}
              errorMessage={errors.contacto?.message}
              className="text-sm sm:text-base"
            />
          </div>

          <InputField
            icon={<Lock size={18} className="sm:w-5 sm:h-5" />}
            rightIcon={
              showPassword ? (
                <EyeOff size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Eye size={18} className="sm:w-5 sm:h-5" />
              )
            }
            onRightIconClick={() => setShowPassword(!showPassword)}
            label="Senha:"
            placeholder="Crie uma senha segura"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            errorMessage={errors.password?.message}
            className="text-sm sm:text-base"
          />

          {shouldShowConfirmPassword && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <InputField
                icon={<Lock size={18} className="sm:w-5 sm:h-5" />}
                rightIcon={
                  showConfirmPassword ? (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  )
                }
                onRightIconClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                label="Confirmar senha:"
                placeholder="Confirme sua senha"
                type={showConfirmPassword ? "text" : "password"}
                {...register("passwordConfirm")}
                errorMessage={errors.passwordConfirm?.message}
                className="text-sm sm:text-base"
              />
            </div>
          )}

          <div className="flex flex-col space-y-1 pt-2">
            <div className="flex items-start space-x-2">
              <input
                id="terms"
                type="checkbox"
                {...register("acceptTerms")}
                className="mt-1 h-4 w-4 border-gray-300 rounded flex-shrink-0 cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer"
              >
                Eu aceito os{" "}
                <button
                  type="button"
                  className="hover:text-foreground font-medium transition-colors underline"
                >
                  Termos de Uso
                </button>{" "}
                e a{" "}
                <button
                  type="button"
                  className="hover:text-blue-800 font-medium transition-colors underline"
                >
                  Política de Privacidade
                </button>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-xs sm:text-sm font-medium mt-1">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <SubmitButton
            isLoading={isSubmitting}
            defaultText="Criar conta"
            loadingText="Criando conta..."
            // Botão fica desativado se estiver a enviar OU se os termos não estiverem aceites via watch
            disabled={isSubmitting || !isTermsAccepted}
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Separator />
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            Já tem uma conta?{" "}
            <button className="underline underline-offset-4 font-semibold transition-colors">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
