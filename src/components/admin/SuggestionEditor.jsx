import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const SuggestionEditor = ({ isOpen, onClose, editingSuggestion = null, onSave }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        position: '',
        company_segment: '',
        email: '',
        suggestion: '',
        votes: 0,
        status: 'voting'
    });

    useEffect(() => {
        if (editingSuggestion) {
            setFormData({
                name: editingSuggestion.name || '',
                position: editingSuggestion.position || '',
                company_segment: editingSuggestion.company_segment || '',
                email: editingSuggestion.email || '',
                suggestion: editingSuggestion.suggestion || '',
                votes: editingSuggestion.votes || 0,
                status: editingSuggestion.status || 'voting'
            });
        } else {
            setFormData({
                name: '',
                position: '',
                company_segment: '',
                email: '',
                suggestion: '',
                votes: 0,
                status: 'voting'
            });
        }
    }, [editingSuggestion, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!formData.suggestion.trim()) {
            toast({
                title: "Erro",
                description: "A sugestão é obrigatória",
                variant: "destructive"
            });
            return;
        }

        if (!formData.name.trim()) {
            toast({
                title: "Erro",
                description: "O nome é obrigatório",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            if (editingSuggestion) {
                const { error } = await supabase
                    .from('cocreate_suggestions')
                    .update({
                        name: formData.name.trim(),
                        position: formData.position?.trim() || null,
                        company_segment: formData.company_segment?.trim() || null,
                        email: formData.email?.trim() || null,
                        suggestion: formData.suggestion.trim(),
                        votes: formData.votes,
                        status: formData.status
                    })
                    .eq('id', editingSuggestion.id);

                if (error) throw error;

                toast({
                    title: "Sugestão atualizada!",
                    description: "As alterações foram salvas com sucesso."
                });
            } else {
                const { error } = await supabase
                    .from('cocreate_suggestions')
                    .insert({
                        name: formData.name.trim(),
                        position: formData.position?.trim() || null,
                        company_segment: formData.company_segment?.trim() || null,
                        email: formData.email?.trim() || null,
                        suggestion: formData.suggestion.trim(),
                        votes: formData.votes,
                        status: formData.status
                    });

                if (error) throw error;

                toast({
                    title: "Sugestão criada!",
                    description: "A nova sugestão foi adicionada com sucesso."
                });
            }
            
            onSave?.();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar:', error);
            toast({
                title: "Erro ao salvar",
                description: error.message || "Ocorreu um erro ao salvar a sugestão.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!editingSuggestion) return;
        
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('cocreate_suggestions')
                .delete()
                .eq('id', editingSuggestion.id);

            if (error) throw error;

            toast({
                title: "Sugestão excluída",
                description: "A sugestão foi removida com sucesso."
            });
            
            onSave?.();
            onClose();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            toast({
                title: "Erro ao excluir",
                description: error.message || "Ocorreu um erro ao excluir a sugestão.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'voting': return 'Em votação';
            case 'development': return 'Em desenvolvimento';
            case 'completed': return 'Já no Hub';
            default: return status;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {editingSuggestion ? 'Editar Sugestão' : 'Nova Sugestão'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {editingSuggestion ? 'Atualize as informações da sugestão' : 'Adicione uma nova sugestão'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                        {/* Suggestion Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sugestão *
                            </label>
                            <textarea
                                value={formData.suggestion}
                                onChange={(e) => handleChange('suggestion', e.target.value)}
                                placeholder="Descrição da ideia ou ferramenta..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all resize-none"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all"
                            >
                                <option value="voting">Em votação</option>
                                <option value="development">Em desenvolvimento</option>
                                <option value="completed">Já no Hub</option>
                            </select>
                        </div>

                        {/* Votes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade de Votos
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.votes}
                                onChange={(e) => handleChange('votes', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Nome do autor"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all"
                            />
                        </div>

                        {/* Position & Company Segment */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => handleChange('position', e.target.value)}
                                    placeholder="Cargo"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Segmento
                                </label>
                                <input
                                    type="text"
                                    value={formData.company_segment}
                                    onChange={(e) => handleChange('company_segment', e.target.value)}
                                    placeholder="Segmento da empresa"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="email@exemplo.com"
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A31FF]/20 focus:border-[#6A31FF] transition-all"
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                        {editingSuggestion ? (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-5 py-2 bg-[#6A31FF] text-white rounded-xl hover:bg-[#5A28E0] transition-colors font-medium disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {editingSuggestion ? 'Salvar' : 'Criar'}
                            </button>
                        </div>
                    </div>

                    {/* Delete Confirmation */}
                    <AnimatePresence>
                        {showDeleteConfirm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    className="bg-white p-6 rounded-xl shadow-xl max-w-sm mx-4"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">Excluir sugestão?</h3>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        Esta ação não pode ser desfeita. A sugestão e todos os votos associados serão removidos permanentemente.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : null}
                                            Excluir
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SuggestionEditor;
