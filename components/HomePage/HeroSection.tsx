"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Calendar, Star, Award, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import heroImage from "@/public/images/HeroMentor.jpeg";
import heroImage2 from "@/public/images/mentorhero1.jpeg";
import Link from "next/link";

interface Mentor {
  id: string;
}

interface MentorsResponse {
  mentors: Mentor[] | null;
}

// Função simulada - substitua pela sua implementação real
const getAllMentors = async (): Promise<MentorsResponse> => {
  // Implementação real da sua função
  return { mentors: [] };
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [totalMentors, setTotalMentors] = useState<number>(500); // Valor inicial maior
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMentors = async () => {
      setIsLoading(true);
      try {
        const { mentors } = await getAllMentors();
        if (mentors && mentors.length > 0) {
          setTotalMentors(mentors.length);
        }
      } catch (error) {
        console.error("Erro ao buscar mentores:", error);
      } finally {
        setIsLoading(false);
        setIsVisible(true);
      }
    };

    fetchMentors();
  }, []);

  const benefits = [
    { icon: <CheckCircle className="w-5 h-5" />, text: "Mentores verificados" },
    { icon: <Award className="w-5 h-5" />, text: "Especialistas do mercado" },
    { icon: <Star className="w-5 h-5" />, text: "Avaliações e reviews" },
    { icon: <Calendar className="w-5 h-5" />, text: "Agendamento flexível" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Conteúdo principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            {/* Tag da plataforma */}
            {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-blue-700 dark:text-blue-300 font-medium">
                UniProf
              </span>
            </motion.div> */}

            {/* Título principal */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight  text-primary dark:text-white">
                Encontre um<br />
                <span className=" text-primary dark:text-white">
                  Profissional qualificado
                </span>
                <br />
                para mentoria, aulas<br />
                ou consultoria online
              </h1>
            </div>

            {/* Descrição */}
            <p className="text-lg md:text-xl text-card-foreground dark:text-gray-300 leading-relaxed max-w-xl">
              Agende uma sessão online com mentores, professores ou consultores especializados para o seu crescimento pessoal e profissional.
            </p>

            {/* Benefícios */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex flex-col items-center text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm"
                >
                  <div className="text-secondary ">
                    {benefit.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Botão de ação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold bg-primary text-white hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                asChild
              >
                <Link href="/mentores" className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agendar Sessão
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Seção de imagens */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative h-[500px] sm:h-[600px] lg:h-[700px] w-full"
          >
            <div className="relative h-full w-full">
              {/* Imagem principal - Mentor */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-8 right-4 lg:right-8 w-[70%] h-[60%]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={heroImage}
                    alt="Mentor profissional em sessão online"
                    fill
                    sizes="(max-width: 768px) 70vw, 40vw"
                    className="object-cover object-center rounded-2xl shadow-2xl"
                    priority
                  />
                  {/* Badge sobre a imagem */}
                  <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Avaliação dos alunos
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Imagem secundária - Aluno */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 left-4 lg:left-8 w-[60%] h-[50%]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={heroImage2}
                    alt="Aluno participando de sessão online"
                    fill
                    sizes="(max-width: 768px) 60vw, 35vw"
                    className="object-cover object-center rounded-2xl shadow-2xl"
                  />
                  {/* Badge sobre a imagem */}
                  <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg">
                    <p className="text-sm font-bold">+95%</p>
                    <p className="text-xs">Satisfação</p>
                  </div>
                </div>
              </motion.div>

              {/* Elemento decorativo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;