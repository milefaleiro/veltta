import React, { createContext, useContext, useState, useEffect } from 'react';
import { Newspaper, Mic, Video, FileSpreadsheet, Download, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ContentContext = createContext(null);

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};

// Tipos de conteúdo com metadados
export const CONTENT_TYPES = {
    artigo: {
        label: 'Artigo',
        icon: Newspaper,
        color: 'blue',
        description: 'Conteúdo escrito para blog'
    },
    video: {
        label: 'Vídeo',
        icon: Video,
        color: 'red',
        description: 'Vídeo educativo ou tutorial'
    },
    ferramenta: {
        label: 'Ferramenta',
        icon: FileSpreadsheet,
        color: 'green',
        description: 'Planilha, template ou recurso para download'
    },
    podcast: {
        label: 'Podcast',
        icon: Mic,
        color: 'purple',
        description: 'Episódio de áudio'
    }
};

// Categorias de conteúdo
export const CONTENT_CATEGORIES = [
    { id: 'procurement', label: 'Procurement' },
    { id: 'negociacao', label: 'Negociação' },
    { id: 'gestao', label: 'Gestão de Fornecedores' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'carreira', label: 'Carreira' },
    { id: 'tecnologia', label: 'Tecnologia' }
];

export const ContentProvider = ({ children }) => {
    const [contents, setContents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchContents = async () => {
        try {
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setContents(data || []);
        } catch (error) {
            console.error('Erro ao buscar conteúdos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, []);

    const addContent = async (content) => {
        try {
            // Remove id if present to let DB generate it, or ensure it matches DB type
            const { id, ...contentData } = content;
            
            const { data, error } = await supabase
                .from('contents')
                .insert([contentData])
                .select()
                .single();

            if (error) throw error;
            
            setContents(prev => [data, ...prev]);
            return data;
        } catch (error) {
            console.error('Erro ao adicionar conteúdo:', error);
            throw error;
        }
    };

    const updateContent = async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('contents')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setContents(prev => prev.map(item => item.id === id ? data : item));
            return data;
        } catch (error) {
            console.error('Erro ao atualizar conteúdo:', error);
            throw error;
        }
    };

    const deleteContent = async (id) => {
        try {
            const { error } = await supabase
                .from('contents')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setContents(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Erro ao deletar conteúdo:', error);
            throw error;
        }
    };

    const getContentById = (id) => {
        return contents.find(item => item.id === id);
    };

    const getContentsByType = (type) => {
        if (type === 'todos') return contents;
        return contents.filter(item => item.type === type);
    };

    const getContentsByCategory = (category) => {
        if (!category || category === 'todos') return contents;
        return contents.filter(item => item.category === category);
    };

    const getFeaturedContents = () => {
        return contents.filter(item => item.featured).slice(0, 3);
    };

    const searchContents = (query) => {
        const q = query.toLowerCase();
        return contents.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.tags?.some(tag => tag.toLowerCase().includes(q))
        );
    };

    return (
        <ContentContext.Provider value={{
            contents,
            isLoading,
            addContent,
            updateContent,
            deleteContent,
            getContentById,
            getContentsByType,
            getContentsByCategory,
            getFeaturedContents,
            searchContents,
            CONTENT_TYPES,
            CONTENT_CATEGORIES
        }}>
            {children}
        </ContentContext.Provider>
    );
};
