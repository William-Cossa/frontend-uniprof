// components/sections/SessionTypes.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, BookOpen, Briefcase, Calendar, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SessionTypes() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const sessionTypes = [
        {
            icon: Users,
            title: 'Mentoria',
            subtitle: 'Orientação e conselhos personalizados',
            description: 'Orientação personalizada de mentores experientes que já trilharam o seu caminho.',
            features: [
                // 'Planos personalizados',
                // 'Acompanhamento contínuo',
                // 'Feedback direto',
                // 'Networking estratégico'
            ],
            buttonText: 'Agendar Mentoria',
            color: 'blue',
            gradient: 'primary',
            popular: true
        },
        {
            icon: BookOpen,
            title: 'Aulas Particulares',
            subtitle: 'Aulas exclusivas com professores especializados',
            description: 'Aulas exclusivas com professores especializados em diversos assuntos e áreas profissionais.',
            features: [
                // 'Conteúdo personalizado',
                // 'Horários flexíveis',
                // 'Material exclusivo',
                // 'Avaliação contínua'
            ],
            buttonText: 'Agendar Aula',
            color: 'green',
            gradient: 'secondary'
        },
        {
            icon: Briefcase,
            title: 'Consultoria',
            subtitle: 'Consultoria profissional para negócios, carreiras e projetos',
            description: 'Consultoria profissional para negócios, carreiras e projectos estratégicos.',
            features: [
                // 'Análise estratégica',
                // 'Soluções práticas',
                // 'Plano de ação',
                // 'Resultados mensuráveis'
            ],
            buttonText: 'Agendar Consultoria',
            color: 'blue',
            gradient: 'primary',
            recommended: true
        }
    ];

    const getColorClasses = (color: string) => {
        const classes = {
            blue: {
                light: 'bg-blue-50 dark:bg-blue-900/20',
                medium: 'bg-blue-100 dark:bg-blue-800/30',
                dark: 'text-blue-700 dark:text-blue-300',
                border: 'border-blue-200 dark:border-blue-700'
            },
            green: {
                light: 'bg-green-50 dark:bg-green-900/20',
                medium: 'bg-green-100 dark:bg-green-800/30',
                dark: 'text-green-700 dark:text-green-300',
                border: 'border-green-200 dark:border-green-700'
            },
            purple: {
                light: 'bg-purple-50 dark:bg-purple-900/20',
                medium: 'bg-purple-100 dark:bg-purple-800/30',
                dark: 'text-purple-700 dark:text-purple-300',
                border: 'border-purple-200 dark:border-purple-700'
            }
        };
        return classes[color as keyof typeof classes];
    };

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >

                    <h2 className="text-3xl font-bold text-primary dark:text-white mb-4">
                        Encontre a sessão certa para você
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Conecte-se com profissionais qualificados através do formato que melhor atende suas necessidades
                    </p>
                </motion.div>

                {/* Session Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {sessionTypes.map((session, index) => {
                        const colors = getColorClasses(session.color);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                ref={ref}
                                className="relative group"
                            >

                                

                                {/* Card */}
                                <div className={`h-full ${colors.light} border ${colors.border} rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2`}>
                                    {/* Icon */}
                                        <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                                            <session.icon className="w-6 h-6 text-primary" />
                                        </div>

                                    {/* Title & Subtitle */}
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {session.title}
                                        </h3>
                                        <p className={`text-lg font-semibold ${colors.dark}`}>
                                            {session.subtitle}
                                        </p>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                        {session.description}
                                    </p>

                                    {/* Features */}
                                    <ul className="space-y-3 mb-8">
                                        {session.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Button */}
                                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            className={`w-full bg-${session.gradient} hover:bg-${session.gradient}/70 text-white font-semibold py-3 rounded-xl transition-all duration-300 group/btn`}
                                            size="lg"
                                            asChild
                                        >
                                            <Link href="/agendar" className="flex items-center justify-center gap-2">
                                                <Calendar className="w-5 h-5" />
                                                {session.buttonText}
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <div className="bg-secondary/5 dark:bg-secondary/10 rounded-xl p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            Agende uma sessão online com profissionais qualificados
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Comece sua jornada de desenvolvimento hoje mesmo
                        </p>

                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                            asChild
                        >
                            <Link href="/agendar" className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Agendar Sessão
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </Button>
                    </div>
                </motion.div> */}
            </div>
        </section>
    );
}