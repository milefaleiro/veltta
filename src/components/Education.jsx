import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, GraduationCap, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import WaitlistModal from '@/components/ui/WaitlistModal';

const Education = () => {
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const whatsappLink = "https://wa.me/5521972257438?text=Olá! Gostaria de saber mais sobre os treinamentos In Company da Veltta.";

    const handleWhatsAppClick = () => {
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <section id="educacao" className="py-24 bg-[#1C1C1C] text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Educação que <span className="text-gradient-purple">Transforma Carreiras</span></h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Capacite suas equipes com treinamentos de ponta, desenvolvidos por quem entende do assunto.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Card Curso Online */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600" />
                        <div className="relative p-8 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <GraduationCap className="w-6 h-6 text-white/80" />
                                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                    Curso Online
                                </span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                Fundamentos de Compras Estratégicas
                            </h3>
                            
                            <p className="text-white/80 leading-relaxed mb-6 flex-grow">
                                Domine os conceitos essenciais e comece sua jornada em procurement com uma metodologia prática e reconhecida pelo mercado.
                            </p>

                            <div className="flex items-center gap-2 text-white/90 mb-6">
                                <Calendar className="w-5 h-5" />
                                <span className="font-semibold">Início em 26/01/2026</span>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-white">R$ 297</span>
                                <span className="text-lg text-white/60 line-through">R$ 497</span>
                                <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    40% OFF
                                </span>
                            </div>

                            <button
                                onClick={() => setIsWaitlistOpen(true)}
                                className="w-full py-4 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                Participar da lista de espera
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-white/70 text-sm mt-3">
                                Receba condições especiais e 10% de desconto
                            </p>
                        </div>
                    </motion.div>

                    {/* Card In Company */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative overflow-hidden rounded-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a2e]" />
                        <div className="absolute inset-0 border border-white/10 rounded-2xl" />
                        <div className="relative p-8 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <Building className="w-6 h-6 text-purple-400" />
                                <span className="text-sm font-medium bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                                    Soluções Corporativas
                                </span>
                            </div>
                            
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                Turmas In Company
                            </h3>
                            
                            <p className="text-gray-400 leading-relaxed mb-6 flex-grow">
                                Treinamentos personalizados para as necessidades específicas da sua empresa. Desenvolvemos programas sob medida com nossos especialistas para capacitar suas equipes de compras e supply chain.
                            </p>

                            <ul className="space-y-3 mb-8 text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    Conteúdo personalizado
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    Cases da sua empresa
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    Certificação inclusa
                                </li>
                            </ul>

                            <button
                                onClick={handleWhatsAppClick}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 group"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Solicite uma proposta
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <p className="text-center text-gray-500 text-sm mt-3">
                                Fale diretamente com nossa equipe
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modal de Lista de Espera */}
            <WaitlistModal 
                isOpen={isWaitlistOpen} 
                onClose={() => setIsWaitlistOpen(false)} 
            />
        </section>
    );
};

export default Education;