import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Building, BookOpen } from 'lucide-react';

const Education = () => {
    const { toast } = useToast();

    const handleLearnMore = (program) => {
        toast({
            title: "Interesse Registrado",
            description: `Você será notificado sobre o programa ${program}.`,
        });
    };

    const programs = [
        {
            icon: Building,
            title: "In Company",
            description: "Treinamentos personalizados para as necessidades específicas da sua empresa, entregues por nossos especialistas."
        },
        {
            icon: BookOpen,
            title: "Cursos Livres",
            description: "Oportunidades para profissionais de diversas empresas trocarem experiências e aprenderem juntos."
        }
    ];

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

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {programs.map((program, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            onClick={() => handleLearnMore(program.title)}
                            className="bg-[#2a2a2a] p-8 rounded-2xl border border-white/10 flex flex-col items-start cursor-pointer hover:border-purple-500/50 hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="mb-5">
                                <program.icon className="w-10 h-10 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">{program.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{program.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Education;