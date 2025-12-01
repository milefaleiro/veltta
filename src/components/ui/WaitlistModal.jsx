import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const WaitlistModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        // Validação básica
        if (!formData.name.trim() || !formData.email.trim()) {
            setError('Nome e email são obrigatórios.');
            setIsSubmitting(false);
            return;
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor, insira um email válido.');
            setIsSubmitting(false);
            return;
        }

        try {
            const { error: insertError } = await supabase
                .from('leads')
                .insert([{
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.trim() || null,
                    company: formData.company.trim() || null,
                    position: formData.position.trim() || null,
                    source: 'course_waitlist'
                }]);

            if (insertError) {
                if (insertError.code === '23505') {
                    setError('Este email já está cadastrado na lista de espera.');
                } else {
                    console.error('Erro ao salvar lead:', insertError);
                    setError('Ocorreu um erro. Por favor, tente novamente.');
                }
                setIsSubmitting(false);
                return;
            }

            setIsSuccess(true);
            setFormData({ name: '', email: '', phone: '', company: '', position: '' });

            // Fechar modal após 3 segundos
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 3000);

        } catch (err) {
            console.error('Erro inesperado:', err);
            setError('Ocorreu um erro. Por favor, tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-[#1C1C1C] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                >
                    {/* Header com gradiente */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <GraduationCap className="w-8 h-8" />
                            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                                Lista de Espera
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold">
                            Fundamentos de Compras Estratégicas
                        </h3>
                        <p className="text-white/80 mt-1">
                            Início em 26/01/2026 • Condições especiais para inscritos
                        </p>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                        {isSuccess ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-8"
                            >
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h4 className="text-xl font-bold text-white mb-2">
                                    Inscrição Confirmada!
                                </h4>
                                <p className="text-gray-400">
                                    Você receberá um email com condições especiais e um cupom de 10% de desconto quando o curso for lançado.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <p className="text-gray-400 mb-6">
                                    Cadastre-se para receber em primeira mão as informações do curso e garantir um <span className="text-purple-400 font-semibold">cupom de 10% de desconto</span>.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Nome <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Seu nome completo"
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Email <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="seu@email.com"
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Telefone <span className="text-gray-500">(opcional)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(11) 99999-9999"
                                            className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Empresa <span className="text-gray-500">(opcional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="Sua empresa"
                                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                                Cargo <span className="text-gray-500">(opcional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleChange}
                                                placeholder="Seu cargo"
                                                className="w-full px-4 py-3 bg-[#2a2a2a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-sm">{error}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            'Garantir minha vaga'
                                        )}
                                    </button>
                                </form>

                                <p className="text-xs text-gray-500 text-center mt-4">
                                    Seus dados estão seguros. Não compartilhamos com terceiros.
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WaitlistModal;
