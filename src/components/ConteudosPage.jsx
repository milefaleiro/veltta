import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Newspaper, Mic, Video, Clock, Search, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useContent, CONTENT_TYPES } from '@/contexts/ContentContext';

const ConteudosPage = ({ onNavigate }) => {
    const { contents } = useContent();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    const filteredContents = contents.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = selectedType === 'all' || item.type === selectedType;
        return matchesSearch && matchesType;
    });

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
        <div className="min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate} currentPage="conteudos" />
            
            <main className="pt-24">
                {/* Hero Section */}
                <section className="py-16 bg-gradient-to-br from-[#0B0B0F] via-[#1C1C1C] to-[#2a2a2a] text-white">
                    <div className="container mx-auto px-4">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => onNavigate('home')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Voltar para Home
                        </motion.button>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                Conteúdo para sua <span className="text-gradient-purple">Carreira</span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Artigos, podcasts e lives para manter você atualizado com as últimas tendências do mercado.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Filters Section */}
                <section className="py-8 bg-white border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Search */}
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar conteúdos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <button
                                    onClick={() => setSelectedType('all')}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        selectedType === 'all' 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Todos
                                </button>
                                {Object.entries(CONTENT_TYPES).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedType(key)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                                            selectedType === key 
                                                ? 'bg-purple-600 text-white' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <value.icon className="w-4 h-4" />
                                        {value.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        {filteredContents.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-lg">Nenhum conteúdo encontrado.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                {filteredContents.map((item, index) => {
                                    const IconComponent = getTypeIcon(item.type);
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.2 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
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
                                                {item.description && (
                                                    <p className="text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                                                )}
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
                        )}
                    </div>
                </section>

                {/* CTA to Co-Create */}
                <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500">
                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Quer sugerir um tema?
                            </h2>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                Participe da nossa comunidade e ajude a criar conteúdos relevantes para o mercado.
                            </p>
                            <button
                                onClick={() => onNavigate('cocrie')}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Co-crie com a Veltta
                            </button>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ConteudosPage;
