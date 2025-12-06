import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Users } from 'lucide-react';
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

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Card In Company */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#111116] border border-gray-800 p-10 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#1A1A23] flex items-center justify-center mb-6 text-purple-500">
                            <Building className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">In Company</h3>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Treinamentos personalizados para as necessidades específicas da sua empresa, entregues por nossos especialistas.
                        </p>
                        <div className="mt-auto">
                            {/* Button can be added here or strictly text card? content indicates clickable or just info? Keeping it simple as per screenshot. */}
                        </div>
                    </motion.div>

                    {/* Card Cursos Livres */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-[#111116] border border-gray-800 p-10 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors duration-300"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-[#1A1A23] flex items-center justify-center mb-6 text-purple-500">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Cursos Livres</h3>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Oportunidades para profissionais de diversas empresas trocarem experiências e aprenderem juntos.
                        </p>
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