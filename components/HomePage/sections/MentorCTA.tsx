import Link from "next/link";

export default function CTASection() {
    return (
        <section className="w-full px-4 py-12 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/35 to-secondary/25 p-12 md:p-16">
                    {/* Círculos decorativos no fundo */}
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-40">
                        <div className="absolute right-[-40%] top-1/2 -translate-y-1/2 h-[150%] aspect-square rounded-full bg-primary/50"></div>
                        <div className="absolute right-[-35%] top-1/2 -translate-y-1/2 h-[130%] aspect-square rounded-full bg-blue-200/30"></div>
                        <div className="absolute right-[-30%] top-1/2 -translate-y-1/2 h-[110%] aspect-square rounded-full bg-blue-100/30"></div>
                        <div className="absolute right-[-25%] top-1/2 -translate-y-1/2 h-[80%] aspect-square rounded-full bg-white/20"></div>
                    </div>

                    {/* Conteúdo */}
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Seja um <span className="text-primary">Profissional</span>
                        </h2>
                        <p className="text-white text-lg md:text-xl mb-8 max-w-lg">
                            Compartilhe seu conhecimento como mentor, professor ou consultor e transforme vidas através da orientação online.
                        </p>

                        {/* Cards de serviços */}
                        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <h3 className="font-semibold text-white mb-2">Mentoria</h3>
                                <p className="text-white/90 text-sm">Oriente profissionais em suas jornadas de carreira</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <h3 className="font-semibold text-white mb-2">Aulas Online</h3>
                                <p className="text-white/90 text-sm">Ensine suas habilidades para alunos dedicados</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                <h3 className="font-semibold text-white mb-2">Consultoria</h3>
                                <p className="text-white/90 text-sm">Ofereça soluções para negócios e projetos</p>
                            </div>
                        </div> */}

                        {/* Benefícios */}
                        <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center text-white/90">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span>Flexibilidade de horários</span>
                            </div>
                            <div className="flex items-center text-white/90">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span>Renda extra ou principal</span>
                            </div>
                            <div className="flex items-center text-white/90">
                                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                                <span>Aprovação rápida</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/cadastro-profissional">
                                <button className="group relative bg-white hover:bg-gray-100 text-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-between min-w-[220px] shadow-lg">
                                    <span>Cadastrar como Profissional</span>
                                    <div className="ml-4 w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                </button>
                            </Link>
                            
                            {/* <Link href="/como-funciona">
                                <button className="group relative bg-transparent hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-between min-w-[220px] border-2 border-white/50">
                                    <span>Saiba Como Funciona</span>
                                    <div className="ml-4 w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors flex items-center justify-center border border-white/30">
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                </button>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}