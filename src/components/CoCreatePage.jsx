import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const CoCreatePage = ({ onBack }) => {
    const { toast } = useToast();

    return (
        <div className="min-h-screen bg-white text-[#1A0B2E] overflow-x-hidden selection:bg-purple-500/30">
            {/* Header */}
            <header className="relative z-50 p-6 md:p-8 max-w-7xl mx-auto w-full flex justify-between items-center">
                <button 
                    onClick={onBack} 
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 hover:bg-white/60 border border-white/50 hover:border-white/60 transition-all text-sm font-medium text-[#1A0B2E]/80 hover:text-[#1A0B2E]"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar
                </button>
                <div className="hidden md:block text-sm font-medium tracking-widest text-[#1A0B2E]/40 uppercase">Veltta Co-create</div>
            </header>

            <main className="relative z-10 container mx-auto px-4 py-4 md:py-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 max-w-7xl">
                
                {/* Left Column: Content */}
                <div className="w-full lg:w-[45%] space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-[#1A0B2E]">
                            Vamos construir o Hub de Compras juntos.
                        </h1>
                        <p className="text-xl text-[#1A0B2E]/70 leading-relaxed max-w-lg">
                            Cocriado com profissionais que vivem Compras todos os dias.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button className="px-8 py-4 bg-[#4A148C] text-white rounded-full font-semibold hover:bg-[#6A1B9A] transition-colors shadow-lg shadow-purple-900/20">
                                Enviar sugestão
                            </button>
                            <button className="px-8 py-4 bg-transparent border-2 border-[#4A148C] text-[#4A148C] rounded-full font-semibold hover:bg-purple-50 transition-colors">
                                Ver ideias da comunidade
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Visuals */}
                <div className="w-full lg:w-[55%] flex justify-center lg:justify-end relative">
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative"
                    >
                        <img 
                            src="/cardscocrie.jpeg" 
                            alt="Cards Co-crie" 
                            className="relative z-10 w-full max-w-xl object-contain mix-blend-multiply"
                        />
                    </motion.div>
                </div>

            </main>
        </div>
    );
};

export default CoCreatePage;
