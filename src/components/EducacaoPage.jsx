import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, GraduationCap, Calendar, ArrowRight, ArrowLeft, MessageCircle, BookOpen, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WaitlistModal from '@/components/ui/WaitlistModal';

const EducacaoPage = ({ onNavigate }) => {
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const whatsappLink = "https://wa.me/5521972257438?text=Olá! Gostaria de saber mais sobre os treinamentos In Company da Veltta.";

    const handleWhatsAppClick = () => {
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    const benefits = [
        {
            icon: BookOpen,
            title: "Conteúdo Prático",
            description: "Metodologia focada em casos reais e aplicação imediata no dia a dia"
        },
        {
            icon: Users,
            title: "Networking",
            description: "Conecte-se com outros profissionais de compras e supply chain"
        },
        {
            icon: Award,
            title: "Certificação",
            description: "Receba certificado reconhecido pelo mercado ao concluir o curso"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B0B0F]">
            <Header onNavigate={onNavigate} currentPage="educacao" />
            
            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-16 bg-gradient-to-br from-[#0B0B0F] via-[#1C1C1C] to-[#2a2a2a] text-white">
                    <div className="container mx-auto px-4">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => onNavigate('home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Voltar para Home
                        </motion.button>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Educação que <span className="text-gradient-purple">Transforma Carreiras</span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Capacite suas equipes com treinamentos de ponta, desenvolvidos por quem entende do assunto.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-16 bg-[#1C1C1C]">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 gradient-purple rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                                    <p className="text-gray-400">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section className="py-24 bg-[#0B0B0F]">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossos Programas</h2>
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                Escolha o formato que melhor se adapta às suas necessidades.
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
                                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full text-white">
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

                                    <button
                                        onClick={() => setIsWaitlistOpen(true)}
                                        className="w-full py-4 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        Participar da lista de espera
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <p className="text-center text-white/70 text-sm mt-3">
                                        Receba condições especiais
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
                </section>
            </main>

            <Footer />

            {/* Modal de Lista de Espera */}
            <WaitlistModal 
                isOpen={isWaitlistOpen} 
                onClose={() => setIsWaitlistOpen(false)} 
            />
        </div>
    );
};

export default EducacaoPage;
