// components/sections/WhyChooseUsMinimal.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    Target,
    Users,
    TrendingUp,
    Shield,
    Clock,
    MessageCircle,
    Calendar,
    Video,
    BookOpen,
    Briefcase,
    BarChart3,
    Zap,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhyChooseUsMinimal() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const valueCards = [
        {
            icon: Target,
            title: 'Mentoria Personalizada',
            description: 'Acompanhamento individualizado para desenvolvimento pessoal e profissional, com foco nos seus objectivos específicos.',
            stats: 'Plano 100% personalizado',
            color: 'blue',
            category: 'mentoria'
        },
        {
            icon: BookOpen,
            title: 'Aulas Especializadas',
            description: 'Conteúdo estruturado e prático em diversas áreas do conhecimento, ministrado por profissionais actuantes no mercado.',
            stats: 'Conteúdo actualizado',
            color: 'green',
            category: 'aulas'
        },
        {
            icon: Briefcase,
            title: 'Consultoria Online',
            description: 'Soluções estratégicas e orientação especializada para desafios profissionais e empresariais específicos.',
            stats: 'Soluções práticas',
            color: 'purple',
            category: 'consultoria'
        }
    ];

    const getColorClasses = (color: string) => {
        const classes = {
            blue: {
                iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                iconColor: 'text-blue-600 dark:text-blue-400',
                border: 'border-blue-200 dark:border-blue-800',
                badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            },
            green: {
                iconBg: 'bg-green-100 dark:bg-green-900/30',
                iconColor: 'text-green-600 dark:text-green-400',
                border: 'border-green-200 dark:border-green-800',
                badge: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            },
            purple: {
                iconBg: 'bg-purple-100 dark:bg-purple-900/30',
                iconColor: 'text-purple-600 dark:text-purple-400',
                border: 'border-purple-200 dark:border-purple-800',
                badge: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
            }
        };
        return classes[color as keyof typeof classes];
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4"
                    >
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                        <span className="text-blue-700 dark:text-blue-300 font-medium">
                            Por que escolher a UniProf
                        </span>
                    </motion.div> */}
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4"
                    >
                        Crescimento com <span className="text-primary">apoio especializado</span>
                    </motion.h2>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                    >
                        Seja para mentoria, aulas ou consultoria, oferecemos a estrutura ideal para seu desenvolvimento contínuo.
                    </motion.p>
                </div>

                {/* Value Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {valueCards.map((card, index) => {
                        const colors = getColorClasses(card.color);
                        
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                                ref={ref}
                                className="group relative"
                            >
                                <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border ${colors.border} shadow-sm hover:shadow-xl transition-all duration-300 h-full`}>
                                    {/* Category Badge */}
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${colors.badge}`}>
                                        {card.category}
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <card.icon className={`w-7 h-7 ${colors.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                                        {card.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        {card.stats}
                                    </div>

                                    {/* Hover Effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-500 rounded-2xl transition-all duration-300 pointer-events-none" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { 
                                icon: Shield, 
                                title: 'Segurança', 
                                description: 'Pagamentos 100% seguros',
                                color: 'text-secondary dark:text-green-400'
                            },
                            { 
                                icon: Zap, 
                                title: 'Flexibilidade', 
                                description: 'Horários adaptáveis',
                                color: 'text-secondary dark:text-blue-400'
                            },
                            { 
                                icon: Video, 
                                title: 'Online', 
                                description: 'Sessões por videoconferência',
                                color: 'text-secondary dark:text-purple-400'
                            },
                            { 
                                icon: Calendar, 
                                title: 'Agendamento', 
                                description: 'Remarcação gratuita',
                                color: 'text-secondary dark:text-orange-400'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center p-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 `}>
                                    <feature.icon className="w-6 h-6 text-secondary" />
                                </div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {feature.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" />
                        </div>
                        
                        <div className="relative">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Pronto para começar sua jornada?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Conecte-se com profissionais qualificados para mentoria, aulas ou consultoria online
                            </p>
                            
                            <Button
                                size="lg"
                                className="bg-primary text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Encontrar Meu Profissional
                                <Zap className="w-4 h-4 ml-2" />
                            </Button>

                            {/* Guarantees */}
                            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                {[
                                    'Primeira sessão experimental',
                                    'Profissionais verificados',
                                    'Satisfação garantida',
                                    'Suporte dedicado'
                                ].map((text, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}