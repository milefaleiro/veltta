import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Puzzle, BarChart, Settings, Database } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: GitBranch,
            title: "Procurement Transformation",
            description: "Diagnóstico e redesenho completo da função de Compras — estratégia, processos, KPIs e governança."
        },
        {
            icon: Settings,
            title: "Software Selection",
            description: "Apoio técnico e metodológico para escolher, comparar e implantar soluções de Procurement, SRM e e-Sourcing."
        },
        {
            icon: Database,
            title: "PDMS — Padronização de Descrições",
            description: "Organização e estruturação de cadastros de materiais e serviços, com saneamento, categorização e criação de taxonomias."
        },
        {
            icon: BarChart,
            title: "Analytics",
            description: "Desenvolvimento de painéis e análises de Spend, fornecedores e performance."
        }
    ];

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
        <section id="consultoria" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Consultoria em Compras</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Soluções especializadas para elevar a performance da sua área de compras.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={cardVariants}
                            className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group h-full flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-6 group-hover:bg-[#6A1B9A] transition-colors duration-300">
                                <service.icon className="w-7 h-7 text-[#6A1B9A] group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 h-14 flex items-center justify-center">{service.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>

                            <div className="mt-auto pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-8 h-8 rounded-lg border border-purple-200 flex items-center justify-center mx-auto">
                                    <div className="w-2 h-2 bg-[#6A1B9A] rounded-full"></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;