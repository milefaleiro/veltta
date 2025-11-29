import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Puzzle, BarChart } from 'lucide-react';

const Services = () => {
    const services = [
        {
            icon: GitBranch,
            title: "Procurement Transformation",
            description: "Reestruturamos sua área de compras com foco em estratégia, eficiência e geração de valor para o negócio."
        },
        {
            icon: Puzzle,
            title: "PDMS",
            description: "Implementamos e otimizamos a gestão de dados mestres de produtos para garantir consistência e qualidade."
        },
        {
            icon: BarChart,
            title: "Analytics",
            description: "Transformamos seus dados de compras em insights acionáveis para tomadas de decisão mais inteligentes."
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

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                            <p className="text-gray-600 leading-relaxed">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;