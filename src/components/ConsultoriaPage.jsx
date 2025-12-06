import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Puzzle, BarChart, ArrowLeft, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ConsultoriaPage = ({ onNavigate }) => {
    const services = [
        {
            icon: GitBranch,
            title: "Procurement Transformation",
            description: "Reestruturamos sua área de compras com foco em estratégia, eficiência e geração de valor para o negócio.",
            details: [
                "Diagnóstico completo da área de compras",
                "Redesenho de processos e políticas",
                "Implementação de melhores práticas",
                "Capacitação das equipes"
            ]
        },
        {
            icon: Puzzle,
            title: "PDMS",
            description: "Implementamos e otimizamos a gestão de dados mestres de produtos para garantir consistência e qualidade.",
            details: [
                "Análise e limpeza de dados",
                "Padronização de cadastros",
                "Governança de dados mestres",
                "Integração com sistemas ERP"
            ]
        },
        {
            icon: BarChart,
            title: "Analytics",
            description: "Transformamos seus dados de compras em insights acionáveis para tomadas de decisão mais inteligentes.",
            details: [
                "Dashboards personalizados",
                "KPIs de compras",
                "Análise de spend",
                "Relatórios executivos"
            ]
        }
    ];

    const handleWhatsAppClick = () => {
        window.open("https://wa.me/5521972257438?text=Olá! Gostaria de saber mais sobre os serviços de consultoria da Veltta.", '_blank', 'noopener,noreferrer');
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <div className="min-h-screen bg-white">
            <Header onNavigate={onNavigate} currentPage="consultoria" />
            
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
                                Consultoria em <span className="text-gradient-purple">Compras</span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Soluções especializadas para elevar a performance da sua área de compras. 
                                Transformamos processos, dados e resultados.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.3 }}
                                    variants={cardVariants}
                                    className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
                                >
                                    <div className="w-16 h-16 gradient-purple rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                                        <service.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                                    
                                    <ul className="space-y-2">
                                        {service.details.map((detail, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                                                <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                                <span>{detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Pronto para transformar sua área de compras?
                            </h2>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                Entre em contato e descubra como podemos ajudar sua empresa a alcançar resultados extraordinários.
                            </p>
                            <button
                                onClick={handleWhatsAppClick}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl group"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Fale com um especialista
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ConsultoriaPage;
