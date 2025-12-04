import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Newspaper, Mic, Video, FileSpreadsheet, Filter, Search, Calendar, Clock, 
    ArrowLeft, ExternalLink, Plus, Pencil, LogIn, LogOut, User, Download,
    BookOpen, GraduationCap, Building2, ArrowRight, Play, ChevronRight, Tag, MessageCircle, Users, Bookmark, Lightbulb
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useContent, CONTENT_TYPES, CONTENT_CATEGORIES } from '@/contexts/ContentContext';
import { useToast } from '@/components/ui/use-toast';
import LoginModal from '@/components/admin/LoginModal';
import ContentEditor from '@/components/admin/ContentEditor';
import LeadsViewer from '@/components/admin/LeadsViewer';
import ContentViewer from '@/components/ContentViewer';
import WaitlistModal from '@/components/ui/WaitlistModal';

const KnowledgeHub = ({ onBack }) => {
    const { user, isAdmin, logout } = useAuth();
    const { contents, isLoading, savedContentIds, toggleSaveContent } = useContent();
    const { toast } = useToast();
    
    const [activeFilter, setActiveFilter] = useState('todos');
    const [activeCategory, setActiveCategory] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [showLeadsViewer, setShowLeadsViewer] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [viewingContent, setViewingContent] = useState(null);
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const [showSavedOnly, setShowSavedOnly] = useState(false);

    const whatsappLink = "https://wa.me/5521972257438?text=Olá! Gostaria de saber mais sobre os treinamentos In Company da Veltta.";

    const contentTypes = [
        { id: 'todos', label: 'Todos', icon: Filter },
        { id: 'artigo', label: 'Artigos', icon: Newspaper },
        { id: 'video', label: 'Vídeos', icon: Video },
        { id: 'ferramenta', label: 'Ferramentas', icon: FileSpreadsheet },
        { id: 'podcast', label: 'Podcasts', icon: Mic },
    ];

    const filteredContent = useMemo(() => {
        return contents.filter(item => {
            const matchesType = activeFilter === 'todos' || item.type === activeFilter;
            const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesSaved = !showSavedOnly || savedContentIds.includes(item.id);
            return matchesType && matchesCategory && matchesSearch && matchesSaved;
        });
    }, [contents, activeFilter, activeCategory, searchTerm, showSavedOnly, savedContentIds]);

    const featuredContent = contents.filter(item => item.featured).slice(0, 3);
    const ferramentas = contents.filter(item => item.type === 'ferramenta').slice(0, 4);

    const getTypeBadgeStyle = (type) => {
        const styles = {
            artigo: 'bg-blue-100 text-blue-700',
            video: 'bg-red-100 text-red-700',
            ferramenta: 'bg-green-100 text-green-700',
            podcast: 'bg-purple-100 text-purple-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    const getTypeIcon = (type) => CONTENT_TYPES[type]?.icon || Newspaper;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleEditContent = (content) => {
        setEditingContent(content);
        setShowEditor(true);
    };

    const handleNewContent = () => {
        setEditingContent(null);
        setShowEditor(true);
    };

    const handleViewContent = (content) => {
        setViewingContent(content);
    };

    const handleToggleSave = async (e, contentId) => {
        e.stopPropagation();
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        const result = await toggleSaveContent(contentId);
        if (result?.error) {
            toast({
                title: "Erro",
                description: "Não foi possível salvar o conteúdo.",
                variant: "destructive",
            });
        } else {
            toast({
                title: result?.saved ? "Salvo!" : "Removido!",
                description: result?.saved ? "Conteúdo adicionado aos seus salvos." : "Conteúdo removido dos seus salvos.",
                duration: 2000,
            });
        }
    };

    if (viewingContent) {
        return <ContentViewer content={viewingContent} onBack={() => setViewingContent(null)} isAdmin={isAdmin} onEdit={() => handleEditContent(viewingContent)} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#6A1B9A] to-[#4A148C] text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">Voltar</span>
                        </button>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <button 
                                        onClick={() => setShowSavedOnly(!showSavedOnly)}
                                        className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${showSavedOnly ? 'bg-white text-[#6A1B9A]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    >
                                        <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-current' : ''}`} />
                                        Meus Salvos
                                    </button>
                                    <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm">
                                        <User className="w-4 h-4" />{user?.user_metadata?.name || user?.email?.split('@')[0]}
                                    </span>
                                    <button onClick={() => { logout(); setShowSavedOnly(false); }} className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm" title="Sair">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setShowLoginModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-[#6A1B9A] hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">
                                    <LogIn className="w-4 h-4" />
                                    Entrar / Criar Conta
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="container mx-auto px-4 pb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">Hub de Conhecimento</h1>
                        <p className="text-lg text-white/80">Artigos, vídeos, ferramentas e podcasts para impulsionar sua carreira em compras.</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 max-w-xl">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Buscar conteúdos, ferramentas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none shadow-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="sticky top-0 bg-white shadow-sm z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-3 gap-4">
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {contentTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setActiveFilter(type.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                                        activeFilter === type.id ? 'bg-[#6A1B9A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <type.icon className="w-4 h-4" />
                                    {type.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => window.location.hash = 'cocrie'} 
                                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium hover:bg-amber-200 transition-colors"
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span className="hidden sm:inline">Co-crie com a Veltta</span>
                            </button>
                            {isAdmin && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setShowLeadsViewer(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200">
                                        <Users className="w-4 h-4" />
                                        <span className="hidden sm:inline">Inscritos</span>
                                    </button>
                                    <button onClick={handleNewContent} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700">
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">Novo</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Ferramentas em Destaque */}
                {activeFilter === 'todos' && !searchTerm && ferramentas.length > 0 && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                                Ferramentas Gratuitas
                            </h2>
                            <button onClick={() => setActiveFilter('ferramenta')} className="text-sm text-[#6A1B9A] hover:underline flex items-center gap-1">
                                Ver todas <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {ferramentas.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -4 }}
                                    onClick={() => handleViewContent(item)}
                                    className="relative group bg-white p-5 rounded-xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    {isAdmin && (
                                        <button onClick={(e) => { e.stopPropagation(); handleEditContent(item); }} className="absolute top-3 right-3 p-1.5 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100">
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                    )}
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Download className="w-3 h-3" />
                                        <span>{item.fileType?.toUpperCase()}</span>
                                        <span>•</span>
                                        <span>{item.fileSize}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Conteúdos */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                {showSavedOnly ? 'Meus Conteúdos Salvos' : (activeFilter === 'todos' ? 'Últimos Conteúdos' : CONTENT_TYPES[activeFilter]?.label + 's')}
                        <span className="text-gray-400 font-normal text-base">({filteredContent.length})</span>
                    </h2>

                    {filteredContent.length === 0 ? (
                        <div className="text-center py-16">
                            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
                            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outro termo.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredContent.map((item, index) => {
                                const IconComponent = getTypeIcon(item.type);
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleViewContent(item)}
                                        className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100"
                                    >
                                        {isAdmin && (
                                            <button onClick={(e) => { e.stopPropagation(); handleEditContent(item); }} className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-lg shadow opacity-0 group-hover:opacity-100 hover:bg-white transition-all">
                                                <Pencil className="w-4 h-4 text-gray-700" />
                                            </button>
                                        )}
                                        <button 
                                            onClick={(e) => handleToggleSave(e, item.id)}
                                            className={`absolute top-3 ${isAdmin ? 'right-12' : 'right-3'} z-10 p-2 rounded-lg shadow transition-all ${savedContentIds.includes(item.id) ? 'bg-[#6A1B9A] text-white opacity-100' : 'bg-white/90 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-[#6A1B9A]'}`}
                                            title={savedContentIds.includes(item.id) ? "Remover dos salvos" : "Salvar conteúdo"}
                                        >
                                            <Bookmark className={`w-4 h-4 ${savedContentIds.includes(item.id) ? 'fill-current' : ''}`} />
                                        </button>
                                        <div className="relative h-40">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            {item.type === 'video' && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                                        <Play className="w-6 h-6 text-[#6A1B9A] ml-1" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`absolute top-3 left-3 flex items-center gap-1.5 ${getTypeBadgeStyle(item.type)} px-2.5 py-1 rounded-full text-xs font-semibold`}>
                                                <IconComponent className="w-3 h-3" />
                                                {CONTENT_TYPES[item.type]?.label}
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                <Calendar className="w-3 h-3" />{formatDate(item.date)}
                                                {item.readTime && <><span>•</span><Clock className="w-3 h-3" />{item.readTime}</>}
                                            </div>
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6A1B9A] transition-colors">{item.title}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                                            {item.tags?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {item.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* CTA Curso Hotmart - Produto de Entrada */}
                {activeFilter === 'todos' && !searchTerm && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-16">
                        <div className="bg-gradient-to-r from-[#6A1B9A] to-[#9C27B0] rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 max-w-2xl">
                                <div className="flex items-center gap-2 mb-3">
                                    <GraduationCap className="w-6 h-6" />
                                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Curso Online</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Fundamentos de Compras Estratégicas</h3>
                                <p className="text-white/80 mb-4">Domine os conceitos essenciais e comece sua jornada em procurement com uma metodologia prática e reconhecida pelo mercado.</p>
                                <div className="flex items-center gap-2 text-white/90 mb-6">
                                    <Calendar className="w-5 h-5" />
                                    <span className="font-semibold">Início em 26/01/2026</span>
                                </div>
                                <button
                                    onClick={() => setIsWaitlistOpen(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#6A1B9A] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Participar da lista de espera <ArrowRight className="w-5 h-5" />
                                </button>
                                <p className="text-white/70 text-sm mt-3">
                                    Receba condições especiais
                                </p>
                            </div>
                        </div>
                    </motion.section>
                )}

                {/* CTA Corporativo */}
                {activeFilter === 'todos' && !searchTerm && (
                    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-16">
                        <div className="bg-gray-900 rounded-2xl p-8 md:p-12">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building2 className="w-6 h-6 text-amber-400" />
                                        <span className="text-amber-400 font-medium">Soluções Corporativas</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Treinamentos In Company e Turmas Abertas</h3>
                                    <p className="text-gray-400 mb-6">Programas customizados para desenvolver sua equipe de compras com metodologias exclusivas e cases práticos do seu setor.</p>
                                    <ul className="space-y-2 text-gray-300 mb-8">
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Diagnóstico personalizado</li>
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Workshops práticos</li>
                                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Certificação reconhecida</li>
                                    </ul>
                                    <a 
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-gray-900 rounded-xl font-semibold hover:bg-amber-300 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Solicitar Proposta <ArrowRight className="w-5 h-5" />
                                    </a>
                                    <p className="text-gray-500 text-sm mt-3">
                                        Fale diretamente com nossa equipe
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600" alt="Treinamento corporativo" className="rounded-xl shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <ContentEditor isOpen={showEditor} onClose={() => { setShowEditor(false); setEditingContent(null); }} editingContent={editingContent} />
            <LeadsViewer isOpen={showLeadsViewer} onClose={() => setShowLeadsViewer(false)} />
            <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
        </div>
    );
};

export default KnowledgeHub;
