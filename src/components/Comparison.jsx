import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, BarChartHorizontal } from 'lucide-react';

const Comparison = () => {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00B050] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        A <span className="text-gradient">diferença</span> está nos dados
                    </h2>
                    <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
                        Veja por que nossa abordagem combinada oferece uma visão 360° do seu negócio.
                    </p>
                </motion.div>
                
                <motion.div 
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="bg-[#1C1C1C] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-3">
                            <div className="p-6 font-semibold text-lg">Funcionalidade</div>
                            <div className="p-6 font-semibold text-lg text-center bg-white/5">Ferramentas Tradicionais</div>
                            <div className="p-6 font-semibold text-lg text-center gradient-green text-black">SmartFuel Planner</div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-white/10">
                            <div className="p-6 text-[#B3B3B3] flex items-center">Análise de Vendas Internas</div>
                            <div className="p-6 text-center flex justify-center items-center bg-white/5"><CheckCircle className="text-green-500 w-6 h-6"/></div>
                            <div className="p-6 text-center flex justify-center items-center"><CheckCircle className="text-green-400 w-6 h-6"/></div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-white/10">
                            <div className="p-6 text-[#B3B3B3]">Dados de Mercado (ANP, Preços)</div>
                            <div className="p-6 text-center flex justify-center items-center bg-white/5"><X className="text-red-500 w-6 h-6"/></div>
                            <div className="p-6 text-center flex justify-center items-center"><CheckCircle className="text-green-400 w-6 h-6"/></div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-white/10">
                            <div className="p-6 text-[#B3B3B3]">Inteligência Combinada (Mercado + Interno)</div>
                            <div className="p-6 text-center flex justify-center items-center bg-white/5"><X className="text-red-500 w-6 h-6"/></div>
                            <div className="p-6 text-center flex justify-center items-center"><CheckCircle className="text-green-400 w-6 h-6"/></div>
                        </div>

                        <div className="grid grid-cols-3 border-t border-white/10">
                            <div className="p-6 text-[#B3B3B3] font-semibold">Visão Estratégica</div>
                            <div className="p-6 text-center bg-white/5 font-semibold text-orange-400">Limitada</div>
                            <div className="p-6 text-center font-semibold text-green-300">Completa</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Comparison;