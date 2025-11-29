import React from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Calendar, Clock, User, Tag, Download, Play,
    Share2, Bookmark, Pencil, ExternalLink, FileSpreadsheet
} from 'lucide-react';
import { CONTENT_TYPES, CONTENT_CATEGORIES } from '@/contexts/ContentContext';

const ContentViewer = ({ content, onBack, isAdmin, onEdit }) => {
    const IconComponent = CONTENT_TYPES[content.type]?.icon;
    const categoryLabel = CONTENT_CATEGORIES.find(c => c.id === content.category)?.label;

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getTypeBadgeStyle = (type) => {
        const styles = {
            artigo: 'bg-blue-100 text-blue-700',
            video: 'bg-red-100 text-red-700',
            ferramenta: 'bg-green-100 text-green-700',
            podcast: 'bg-purple-100 text-purple-700'
        };
        return styles[type] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Voltar</span>
                        </button>
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <button 
                                    onClick={onEdit}
                                    className="flex items-center gap-2 px-4 py-2 text-[#6A1B9A] hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Editar
                                </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Share2 className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bookmark className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            {content.image && content.type !== 'ferramenta' && (
                <div className="relative h-64 md:h-96 bg-gray-900">
                    <img 
                        src={content.image} 
                        alt={content.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    
                    {content.type === 'video' && content.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-[#6A1B9A] ml-1" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Meta Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className={`inline-flex items-center gap-1.5 ${getTypeBadgeStyle(content.type)} px-3 py-1.5 rounded-full text-sm font-semibold`}>
                                {IconComponent && <IconComponent className="w-4 h-4" />}
                                {CONTENT_TYPES[content.type]?.label}
                            </span>
                            {categoryLabel && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                                    {categoryLabel}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {content.title}
                        </h1>

                        <p className="text-xl text-gray-600 mb-6">
                            {content.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b">
                            {content.author && (
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {content.author}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(content.date)}
                            </span>
                            {content.readTime && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {content.readTime}
                                </span>
                            )}
                        </div>
                    </motion.div>

                    {/* Video Embed */}
                    {content.type === 'video' && content.videoUrl && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
                                <iframe
                                    src={content.videoUrl}
                                    title={content.title}
                                    className="w-full h-full"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Download Card for Ferramenta */}
                    {content.type === 'ferramenta' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">{content.downloadName || 'Arquivo para download'}</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {content.fileType?.toUpperCase()} • {content.fileSize}
                                    </p>
                                    <a
                                        href={content.downloadUrl}
                                        download={content.downloadName}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        <Download className="w-5 h-5" />
                                        Baixar Arquivo
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Article Content */}
                    {content.content && (
                        <motion.article
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#6A1B9A] prose-blockquote:border-[#6A1B9A] prose-blockquote:bg-purple-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                            dangerouslySetInnerHTML={{ __html: content.content }}
                        />
                    )}

                    {/* Tags */}
                    {content.tags?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 pt-6 border-t"
                        >
                            <div className="flex items-center gap-2 flex-wrap">
                                <Tag className="w-4 h-4 text-gray-400" />
                                {content.tags.map(tag => (
                                    <span 
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* External Link */}
                    {content.link && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8"
                        >
                            <a
                                href={content.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3 bg-[#6A1B9A] text-white rounded-xl font-medium hover:bg-[#4A148C] transition-colors"
                            >
                                Acessar conteúdo externo
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </motion.div>
                    )}

                    {/* CTA Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 p-8 bg-gradient-to-r from-[#6A1B9A] to-[#9C27B0] rounded-2xl text-white text-center"
                    >
                        <h3 className="text-xl font-bold mb-2">Quer se aprofundar ainda mais?</h3>
                        <p className="text-white/80 mb-4">Conheça nosso curso completo de Compras Estratégicas</p>
                        <a
                            href="https://hotmart.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#6A1B9A] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Conhecer o Curso
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContentViewer;
