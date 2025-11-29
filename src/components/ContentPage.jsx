import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Newspaper, Mic, Video, Filter, Search, Calendar, Clock, 
    ArrowLeft, ExternalLink, Plus, Pencil, LogIn, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent, CONTENT_TYPES } from '@/contexts/ContentContext';
import LoginModal from '@/components/admin/LoginModal';
import ContentEditor from '@/components/admin/ContentEditor';

const ContentPage = ({ onBack }) => {
    const { user, isAdmin, logout } = useAuth();
    const { contents, isLoading } = useContent();
    
    const [activeFilter, setActiveFilter] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [editingContent, setEditingContent] = useState(null);

    const contentTypes = [
        { id: 'todos', label: 'Todos', icon: Filter, color: 'bg-gray-600' },
        { id: 'artigo', label: 'Artigos', icon: Newspaper, color: 'bg-blue-600' },
        { id: 'podcast', label: 'Podcasts', icon: Mic, color: 'bg-purple-600' },
        { id: 'live', label: 'Lives', icon: Video, color: 'bg-red-600' },
    ];

    const filteredContent = useMemo(() => {
        return contents.filter(item => {
            const matchesFilter = activeFilter === 'todos' || item.type === activeFilter;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  item.description?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [contents, activeFilter, searchTerm]);

    const featuredContent = contents.filter(item => item.featured).slice(0, 3);

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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleEditContent = (content) => {
        setEditingContent(content);
        setShowEditor(true);
    };

    const handleNewContent = () => {
        setEditingContent(null);
        setShowEditor(true);
    };

    const handleCloseEditor = () => {
        setShowEditor(false);
        setEditingContent(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#6A1B9A] to-[#4A148C] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={onBack}
                            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Voltar para Home
                        </motion.button>

                        {/* Admin Controls */}
                        <div className="flex items-center gap-3">
                            {isAdmin ? (
                                <>
                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                                        <User className="w-4 h-4" />
                                        {user?.name}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Admin
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Central de Conteúdos
                        </h1>
                        <p className="text-xl text-white/80">
                            Artigos, podcasts e lives para impulsionar sua carreira em compras e procurement.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-8 max-w-2xl"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar conteúdos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="sticky top-0 bg-white shadow-sm z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {contentTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveFilter(type.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${
                                        activeFilter === type.id
                                            ? 'bg-[#6A1B9A] text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <type.icon className="w-4 h-4" />
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Add Button - Only visible for Admin */}
                        {isAdmin && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleNewContent}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-md"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="hidden sm:inline">Novo Conteúdo</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-[#6A1B9A] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Featured Section - Only show when no filter/search */}
                        {activeFilter === 'todos' && !searchTerm && featuredContent.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-16"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <span className="w-1 h-8 bg-[#6A1B9A] rounded-full"></span>
                                    Destaques
                                </h2>
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {featuredContent.map((item, index) => {
                                        const IconComponent = getTypeIcon(item.type);
                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                                            >
                                                {/* Admin Edit Button */}
                                                {isAdmin && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleEditContent(item);
                                                        }}
                                                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}

                                                <a href={item.link || '#'} className="block">
                                                    <div className="relative h-48">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                        <div className={`absolute top-4 left-4 flex items-center gap-2 ${getTypeBadgeStyle(item.type)} px-3 py-1.5 rounded-full text-xs font-semibold`}>
                                                            <IconComponent className="w-3.5 h-3.5" />
                                                            {CONTENT_TYPES[item.type]?.label}
                                                        </div>
                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <span className="text-white/80 text-sm">{formatDate(item.date)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#6A1B9A] transition-colors line-clamp-2">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                                                        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4" />
                                                                {item.readTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* All Content Grid */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-1 h-8 bg-[#6A1B9A] rounded-full"></span>
                                {activeFilter === 'todos' ? 'Todos os Conteúdos' : 
                                 activeFilter === 'artigo' ? 'Artigos' :
                                 activeFilter === 'podcast' ? 'Podcasts' : 'Lives'}
                                <span className="text-gray-400 font-normal text-lg">({filteredContent.length})</span>
                            </h2>

                            {filteredContent.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16"
                                >
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
                                    <p className="text-gray-600 mb-6">Tente ajustar os filtros ou buscar por outro termo.</p>
                                    {isAdmin && (
                                        <button
                                            onClick={handleNewContent}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6A1B9A] text-white rounded-xl hover:bg-[#4A148C] transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Criar primeiro conteúdo
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeFilter + searchTerm}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {filteredContent.map((item, index) => {
                                            const IconComponent = getTypeIcon(item.type);
                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                                    className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                                >
                                                    {/* Admin Edit Button */}
                                                    {isAdmin && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleEditContent(item);
                                                            }}
                                                            className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <a href={item.link || '#'} className="block">
                                                        <div className="relative h-44">
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <div className={`absolute top-3 left-3 flex items-center gap-1.5 ${getTypeBadgeStyle(item.type)} px-2.5 py-1 rounded-full text-xs font-semibold`}>
                                                                <IconComponent className="w-3 h-3" />
                                                                {CONTENT_TYPES[item.type]?.label}
                                                            </div>
                                                        </div>
                                                        <div className="p-5">
                                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3.5 h-3.5" />
                                                                    {formatDate(item.date)}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3.5 h-3.5" />
                                                                    {item.readTime}
                                                                </span>
                                                            </div>
                                                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#6A1B9A] transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                                                            <div className="mt-4 flex items-center gap-2 text-[#6A1B9A] font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                                Acessar conteúdo
                                                                <ExternalLink className="w-4 h-4" />
                                                            </div>
                                                        </div>
                                                    </a>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Stats Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-20 bg-gradient-to-br from-[#6A1B9A] to-[#4A148C] rounded-3xl p-10 text-white"
                        >
                            <div className="text-center mb-10">
                                <h3 className="text-2xl font-bold mb-2">Nosso Acervo</h3>
                                <p className="text-white/70">Conteúdo de qualidade para sua evolução profissional</p>
                            </div>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Newspaper className="w-6 h-6 text-white/80" />
                                    </div>
                                    <div className="text-4xl font-bold">{contents.filter(c => c.type === 'artigo').length}</div>
                                    <div className="text-white/70 text-sm">Artigos</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Mic className="w-6 h-6 text-white/80" />
                                    </div>
                                    <div className="text-4xl font-bold">{contents.filter(c => c.type === 'podcast').length}</div>
                                    <div className="text-white/70 text-sm">Podcasts</div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Video className="w-6 h-6 text-white/80" />
                                    </div>
                                    <div className="text-4xl font-bold">{contents.filter(c => c.type === 'live').length}</div>
                                    <div className="text-white/70 text-sm">Lives</div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>

            {/* Modals */}
            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
            />
            <ContentEditor 
                isOpen={showEditor} 
                onClose={handleCloseEditor}
                editingContent={editingContent}
            />
        </div>
    );
};

export default ContentPage;
