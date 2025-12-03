import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Download, Search, Calendar, Mail, Phone, Building, Briefcase, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const LeadsViewer = ({ isOpen, onClose }) => {
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchLeads();
        }
    }, [isOpen]);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error('Erro ao buscar leads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Cargo', 'Data'];
        const csvContent = [
            headers.join(','),
            ...filteredLeads.map(lead => [
                `"${lead.name || ''}"`,
                `"${lead.email || ''}"`,
                `"${lead.phone || ''}"`,
                `"${lead.company || ''}"`,
                `"${lead.position || ''}"`,
                `"${new Date(lead.created_at).toLocaleDateString('pt-BR')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_veltta_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-700" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Lista de Espera</h2>
                                <p className="text-sm text-gray-500">
                                    {leads.length} inscritos no total
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                            >
                                <Download className="w-4 h-4" />
                                Exportar CSV
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nome, email ou empresa..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                            </div>
                        ) : filteredLeads.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                Nenhum lead encontrado.
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {filteredLeads.map((lead) => (
                                    <div key={lead.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                    {lead.name}
                                                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                                                    </span>
                                                </h3>
                                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                        {lead.email}
                                                    </div>
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                            {lead.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {(lead.company || lead.position) && (
                                                <div className="flex flex-wrap gap-3 text-sm border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4 md:w-1/3">
                                                    {lead.company && (
                                                        <div className="flex items-center gap-1.5 text-gray-700">
                                                            <Building className="w-3.5 h-3.5 text-gray-400" />
                                                            {lead.company}
                                                        </div>
                                                    )}
                                                    {lead.position && (
                                                        <div className="flex items-center gap-1.5 text-gray-600">
                                                            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                            {lead.position}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LeadsViewer;
