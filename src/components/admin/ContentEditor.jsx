import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Save, Trash2, Image, Link, Calendar, Clock, Star,
    Bold, Italic, Underline, List, ListOrdered, Quote,
    Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
    Loader2, Upload, Eye, EyeOff, Newspaper, Mic, Video,
    FileSpreadsheet, Download, Tag, Youtube, File
} from 'lucide-react';
import { useContent, CONTENT_TYPES, CONTENT_CATEGORIES } from '@/contexts/ContentContext';
import { useToast } from '@/components/ui/use-toast';

const ContentEditable = ({ html, onChange, className, contentRef }) => {
    const lastHtml = useRef(html);

    useLayoutEffect(() => {
        if (contentRef.current && html !== contentRef.current.innerHTML) {
            contentRef.current.innerHTML = html;
        }
        lastHtml.current = html;
    }, [html, contentRef]);

    const handleInput = (e) => {
        const newHtml = e.target.innerHTML;
        lastHtml.current = newHtml;
        onChange({ target: { value: newHtml } });
    };

    return (
        <div
            ref={contentRef}
            className={className}
            onInput={handleInput}
            contentEditable
            style={{ minHeight: '200px', lineHeight: '1.6' }}
        />
    );
};

const ContentEditor = ({ isOpen, onClose, editingContent = null }) => {
    const { addContent, updateContent, deleteContent } = useContent();
    const { toast } = useToast();
    const fileInputRef = useRef(null);
    const contentRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [formData, setFormData] = useState({
        type: 'artigo',
        title: '',
        description: '',
        content: '',
        image: '',
        link: '',
        videoUrl: '',
        downloadUrl: '',
        downloadName: '',
        fileSize: '',
        fileType: '',
        date: new Date().toISOString().split('T')[0],
        readTime: '',
        author: 'Equipe Veltta',
        category: '',
        tags: [],
        featured: false
    });

    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (editingContent) {
            setFormData({
                type: editingContent.type || 'artigo',
                title: editingContent.title || '',
                description: editingContent.description || '',
                content: editingContent.content || '',
                image: editingContent.image || '',
                link: editingContent.link || '',
                videoUrl: editingContent.videoUrl || '',
                downloadUrl: editingContent.downloadUrl || '',
                downloadName: editingContent.downloadName || '',
                fileSize: editingContent.fileSize || '',
                fileType: editingContent.fileType || '',
                date: editingContent.date || new Date().toISOString().split('T')[0],
                readTime: editingContent.readTime || '',
                author: editingContent.author || 'Equipe Veltta',
                category: editingContent.category || '',
                tags: editingContent.tags || [],
                featured: editingContent.featured || false
            });
        } else {
            setFormData({
                type: 'artigo',
                title: '',
                description: '',
                content: '',
                image: '',
                link: '',
                videoUrl: '',
                downloadUrl: '',
                downloadName: '',
                fileSize: '',
                fileType: '',
                date: new Date().toISOString().split('T')[0],
                readTime: '',
                author: 'Equipe Veltta',
                category: '',
                tags: [],
                featured: false
            });
        }
    }, [editingContent, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Rich text formatting
    const formatText = (command, value = null) => {
        document.execCommand(command, false, value);
        contentRef.current?.focus();
    };

    const handleContentChange = (e) => {
        handleChange('content', e.target.innerHTML);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Em produção, fazer upload para CDN/Storage
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('image', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast({
                title: "Erro",
                description: "O título é obrigatório",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        try {
            if (editingContent) {
                updateContent(editingContent.id, formData);
                toast({
                    title: "Conteúdo atualizado!",
                    description: "As alterações foram salvas com sucesso."
                });
            } else {
                addContent(formData);
                toast({
                    title: "Conteúdo criado!",
                    description: "O novo conteúdo foi adicionado com sucesso."
                });
            }
            onClose();
        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao salvar o conteúdo.",
                variant: "destructive"
            });
        }

        setIsLoading(false);
    };

    const handleDelete = () => {
        if (editingContent) {
            deleteContent(editingContent.id);
            toast({
                title: "Conteúdo excluído",
                description: "O conteúdo foi removido com sucesso."
            });
            onClose();
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'artigo': return Newspaper;
            case 'podcast': return Mic;
            case 'video': return Video;
            case 'ferramenta': return FileSpreadsheet;
            default: return Newspaper;
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            handleChange('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        handleChange('tags', formData.tags.filter(t => t !== tag));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simular upload - em produção usar CDN
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('downloadUrl', reader.result);
                handleChange('downloadName', file.name);
                handleChange('fileSize', (file.size / 1024).toFixed(0) + ' KB');
                handleChange('fileType', file.name.split('.').pop());
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#6A1B9A]/10 rounded-xl flex items-center justify-center">
                                {React.createElement(getTypeIcon(formData.type), { className: "w-5 h-5 text-[#6A1B9A]" })}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingContent ? 'Editar Conteúdo' : 'Novo Conteúdo'}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingContent ? 'Atualize as informações' : 'Preencha os campos abaixo'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title={showPreview ? 'Ocultar preview' : 'Ver preview'}
                            >
                                {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Tipo de Conteúdo
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(CONTENT_TYPES).map(([key, { label, icon: Icon, color }]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleChange('type', key)}
                                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${formData.type === key
                                                    ? key === 'artigo' ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : key === 'video' ? 'border-red-500 bg-red-50 text-red-700'
                                                            : key === 'ferramenta' ? 'border-green-500 bg-green-50 text-green-700'
                                                                : 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-xs font-medium">{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="Digite o título do conteúdo"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A] transition-all text-lg"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Descrição / Resumo
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Uma breve descrição do conteúdo..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A] transition-all resize-none"
                                    />
                                </div>

                                {/* Video URL - Only for video type */}
                                {formData.type === 'video' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Youtube className="w-4 h-4 inline mr-1" />
                                            URL do Vídeo (YouTube/Vimeo)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={(e) => handleChange('videoUrl', e.target.value)}
                                            placeholder="https://www.youtube.com/embed/..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Use o link de incorporação (embed)</p>
                                    </div>
                                )}

                                {/* Download Fields - Only for ferramenta type */}
                                {formData.type === 'ferramenta' && (
                                    <div className="space-y-4 p-4 bg-green-50 rounded-xl">
                                        <label className="block text-sm font-medium text-green-800">
                                            <Download className="w-4 h-4 inline mr-1" />
                                            Arquivo para Download
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={formData.downloadUrl}
                                                onChange={(e) => handleChange('downloadUrl', e.target.value)}
                                                placeholder="URL do arquivo ou faça upload"
                                                className="flex-1 px-3 py-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                            />
                                            <label className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors text-sm font-medium">
                                                <Upload className="w-4 h-4 inline mr-1" />
                                                Upload
                                                <input type="file" onChange={handleFileUpload} className="hidden" />
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                type="text"
                                                value={formData.downloadName}
                                                onChange={(e) => handleChange('downloadName', e.target.value)}
                                                placeholder="Nome do arquivo"
                                                className="px-3 py-2 text-sm border border-green-200 rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                value={formData.fileSize}
                                                onChange={(e) => handleChange('fileSize', e.target.value)}
                                                placeholder="Tamanho (ex: 245 KB)"
                                                className="px-3 py-2 text-sm border border-green-200 rounded-lg"
                                            />
                                            <input
                                                type="text"
                                                value={formData.fileType}
                                                onChange={(e) => handleChange('fileType', e.target.value)}
                                                placeholder="Tipo (xlsx, pdf)"
                                                className="px-3 py-2 text-sm border border-green-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Rich Text Editor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Conteúdo Completo
                                    </label>

                                    {/* Toolbar */}
                                    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-xl border-b-0">
                                        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('bold')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Negrito"
                                            >
                                                <Bold className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('italic')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Itálico"
                                            >
                                                <Italic className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('underline')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Sublinhado"
                                            >
                                                <Underline className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('formatBlock', '<h1>')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Título 1"
                                            >
                                                <Heading1 className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('formatBlock', '<h2>')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Título 2"
                                            >
                                                <Heading2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('insertUnorderedList')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Lista"
                                            >
                                                <List className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('insertOrderedList')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Lista numerada"
                                            >
                                                <ListOrdered className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('formatBlock', '<blockquote>')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Citação"
                                            >
                                                <Quote className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1 px-2">
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('justifyLeft')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Alinhar à esquerda"
                                            >
                                                <AlignLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('justifyCenter')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Centralizar"
                                            >
                                                <AlignCenter className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => formatText('justifyRight')}
                                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Alinhar à direita"
                                            >
                                                <AlignRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1 pl-2 ml-auto">
                                            <select
                                                onChange={(e) => formatText('fontSize', e.target.value)}
                                                className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none"
                                                defaultValue="3"
                                            >
                                                <option value="1">Pequeno</option>
                                                <option value="2">Normal</option>
                                                <option value="3">Médio</option>
                                                <option value="4">Grande</option>
                                                <option value="5">Maior</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Editable Content Area */}
                                    <ContentEditable
                                        html={formData.content}
                                        onChange={(e) => handleChange('content', e.target.value)}
                                        className="w-full min-h-[200px] px-4 py-3 border border-gray-200 rounded-b-xl focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A] transition-all prose prose-sm max-w-none"
                                        contentRef={contentRef}
                                    />
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Imagem de Capa
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-300 hover:border-[#6A1B9A] transition-colors"
                                    >
                                        {formData.image ? (
                                            <>
                                                <img
                                                    src={formData.image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <Image className="w-10 h-10 mb-2" />
                                                <span className="text-sm">Clique para upload</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">ou cole uma URL:</p>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => handleChange('image', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                    />
                                </div>

                                {/* Link */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Link className="w-4 h-4 inline mr-1" />
                                        Link Externo
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => handleChange('link', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Categoria
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                    >
                                        <option value="">Selecione...</option>
                                        {CONTENT_CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Tag className="w-4 h-4 inline mr-1" />
                                        Tags
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Adicionar tag..."
                                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg"
                                        />
                                        <button type="button" onClick={addTag} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">+</button>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-purple-900">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Data
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => handleChange('date', e.target.value)}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Clock className="w-4 h-4 inline mr-1" />
                                            Duração
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.readTime}
                                            onChange={(e) => handleChange('readTime', e.target.value)}
                                            placeholder="5 min"
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                        />
                                    </div>
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Autor
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => handleChange('author', e.target.value)}
                                        placeholder="Nome do autor"
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A1B9A]/20 focus:border-[#6A1B9A]"
                                    />
                                </div>

                                {/* Featured Toggle */}
                                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Star className={`w-5 h-5 ${formData.featured ? 'text-amber-500 fill-amber-500' : 'text-amber-400'}`} />
                                        <span className="font-medium text-amber-900">Destaque</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleChange('featured', !formData.featured)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-amber-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.featured ? 'left-7' : 'left-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                        {editingContent ? (
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
                                className="px-6 py-2.5 text-gray-600 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#6A1B9A] text-white rounded-xl hover:bg-[#4A148C] transition-colors font-medium disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {editingContent ? 'Salvar Alterações' : 'Criar Conteúdo'}
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
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Excluir conteúdo?</h3>
                                    <p className="text-gray-600 mb-6">
                                        Esta ação não pode ser desfeita. O conteúdo será removido permanentemente.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                        >
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

export default ContentEditor;
