import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Mic, Video, ArrowRight, Clock } from 'lucide-react';
import { useContent, CONTENT_TYPES } from '@/contexts/ContentContext';

const Content = ({ onViewAll }) => {
    const { contents } = useContent();
    
    // Pega os 3 primeiros conteúdos (featured ou mais recentes)
    const displayedContent = contents
        .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        .slice(0, 3);

    const getTypeBadgeStyle = (type) => {
        switch(type) {
            case 'artigo': return 'bg-blue-100 text-blue-700';
            case 'podcast': return 'bg-purple-100 text-purple-700';
            case 'live': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type) => {
        return CONTENT_TYPES[type]?.icon || Newspaper;
    };

    return (
        <section id="conteudo" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Conteúdo para sua Carreira</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Artigos, podcasts e lives para manter você atualizado com as últimas tendências do mercado.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {displayedContent.map((item, index) => {
                        const IconComponent = getTypeIcon(item.type);
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: index * 0.15 }}
                                onClick={onViewAll}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100"
                            >
                                <div className="relative h-56">
                                    <img 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        alt={item.title} 
                                        src={item.image} 
                                    />
                                    <div className={`absolute top-4 left-4 inline-flex items-center gap-2 ${getTypeBadgeStyle(item.type)} px-3 py-1.5 rounded-full text-xs font-semibold`}>
                                        <IconComponent className="w-4 h-4" />
                                        <span>{CONTENT_TYPES[item.type]?.label}</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#6A1B9A] transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    {item.readTime && (
                                        <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                                            <Clock className="w-4 h-4" />
                                            {item.readTime}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Ver Todos Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <button
                        onClick={onViewAll}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#6A1B9A] text-white font-semibold rounded-full hover:bg-[#4A148C] transition-colors shadow-lg hover:shadow-xl"
                    >
                        Ver todos os conteúdos
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Content;