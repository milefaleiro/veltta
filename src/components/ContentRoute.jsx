import React, { useEffect, useState } from 'react';
import { useContent } from '@/contexts/ContentContext';
import ContentViewer from '@/components/ContentViewer';

const ContentRoute = ({ contentId, onNavigate }) => {
    const { getContentById, isLoading } = useContent();
    const [content, setContent] = useState(null);

    useEffect(() => {
        if (contentId && !isLoading) {
            const found = getContentById(contentId);
            setContent(found);
        }
    }, [contentId, isLoading, getContentById]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-[#6A1B9A] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!content) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo não encontrado</h2>
                <button
                    onClick={() => onNavigate('conteudos')}
                    className="text-[#6A1B9A] hover:underline"
                >
                    Voltar para lista de conteúdos
                </button>
            </div>
        );
    }

    return (
        <ContentViewer
            content={content}
            onBack={() => onNavigate('conteudos')}
            onEdit={() => { }} // TODO: Add edit handler if needed
        />
    );
};

export default ContentRoute;
