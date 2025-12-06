import React, { createContext, useContext, useState, useEffect } from 'react';
import { Newspaper, Mic, Video, FileSpreadsheet, Download, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
    const { user } = useAuth();
    const [contents, setContents] = useState([]);
    const [savedContentIds, setSavedContentIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Converte camelCase (JavaScript) para snake_case (banco de dados)
    const toSnakeCase = (data) => {
        const { videoUrl, downloadUrl, downloadName, fileSize, fileType, readTime, ...rest } = data;
        return {
            ...rest,
            video_url: videoUrl,
            download_url: downloadUrl,
            download_name: downloadName,
            file_size: fileSize,
            file_type: fileType,
            read_time: readTime
        };
    };

    // Converte snake_case (banco de dados) para camelCase (JavaScript)
    const toCamelCase = (data) => {
        if (!data) return data;
        const { video_url, download_url, download_name, file_size, file_type, read_time, ...rest } = data;
        return {
            ...rest,
            videoUrl: video_url,
            downloadUrl: download_url,
            downloadName: download_name,
            fileSize: file_size,
            fileType: file_type,
            readTime: read_time
        };
    };

    const fetchContents = async () => {
        try {
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Converte todos os itens para camelCase
            const camelData = (data || []).map(toCamelCase);
            setContents(camelData);
        } catch (error) {
            console.error('Erro ao buscar conteúdos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContents();
    }, []);

    useEffect(() => {
        if (user) {
            fetchSavedContents();
        } else {
            setSavedContentIds([]);
        }
    }, [user]);

    const fetchSavedContents = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('saved_contents')
                .select('content_id');

            if (error) throw error;
            if (data) setSavedContentIds(data.map(item => item.content_id));
        } catch (error) {
            console.error('Erro ao buscar conteúdos salvos:', error);
        }
    };

    const toggleSaveContent = async (contentId) => {
        if (!user) return { error: 'not_logged_in' };

        try {
            const isSaved = savedContentIds.includes(contentId);
            if (isSaved) {
                const { error } = await supabase
                    .from('saved_contents')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('content_id', contentId);

                if (error) throw error;
                setSavedContentIds(prev => prev.filter(id => id !== contentId));
                return { saved: false };
            } else {
                const { error } = await supabase
                    .from('saved_contents')
                    .insert({ user_id: user.id, content_id: contentId })
                    .select();

                if (error) throw error;
                setSavedContentIds(prev => [...prev, contentId]);
                return { saved: true };
            }
        } catch (error) {
            console.error('Erro ao salvar conteúdo:', error);
            return { error: error.message };
        }
    };

    const getSavedContents = () => {
        return contents.filter(item => savedContentIds.includes(item.id));
    };

    const addContent = async (content) => {
        try {
            // Remove id if present to let DB generate it
            const { id, ...contentData } = content;

            // Converte para snake_case antes de enviar ao banco
            const dbData = toSnakeCase(contentData);

            const { data, error } = await supabase
                .from('contents')
                .insert([dbData])
                .select()
                .single();

            if (error) throw error;

            // Converte de volta para camelCase
            const camelData = toCamelCase(data);
            setContents(prev => [camelData, ...prev]);
            return camelData;
        } catch (error) {
            console.error('Erro ao adicionar conteúdo:', error);
            throw error;
        }
    };

    const updateContent = async (id, updates) => {
        try {
            // Converte para snake_case antes de enviar ao banco
            const dbUpdates = toSnakeCase(updates);

            const { data, error } = await supabase
                .from('contents')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // Converte de volta para camelCase
            const camelData = toCamelCase(data);
            setContents(prev => prev.map(item => item.id === id ? camelData : item));
            return camelData;
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
            savedContentIds,
            toggleSaveContent,
            getSavedContents,
            CONTENT_TYPES,
            CONTENT_CATEGORIES
        }}>
            {children}
        </ContentContext.Provider>
    );
};
