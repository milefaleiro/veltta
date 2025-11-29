import React, { createContext, useContext, useState, useEffect } from 'react';
import { Newspaper, Mic, Video, FileSpreadsheet, Download, BookOpen } from 'lucide-react';

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

// Conteúdos iniciais
const initialContent = [
    {
        id: '1',
        type: 'artigo',
        title: "5 métricas de Compras que todo C-Level deveria acompanhar",
        description: "Descubra quais indicadores são essenciais para demonstrar o valor estratégico da área de compras para a alta gestão.",
        content: `<h2>Introdução</h2>
<p>A área de compras evoluiu de uma função operacional para um pilar estratégico das organizações. Para demonstrar esse valor, é fundamental acompanhar as métricas certas.</p>

<h2>1. Savings (Economia Gerada)</h2>
<p>O indicador mais tradicional, mas ainda relevante. Mede a diferença entre o preço de referência e o preço negociado.</p>
<blockquote>Dica: Vá além do saving nominal e calcule o saving realizado vs. orçamento.</blockquote>

<h2>2. Cost Avoidance</h2>
<p>Muitas vezes esquecido, o cost avoidance captura economias que não aparecem diretamente como redução de preço.</p>

<h2>3. Spend Under Management</h2>
<p>Percentual do gasto total que passa pela área de compras. Quanto maior, mais controle e oportunidade de negociação.</p>

<h2>4. Supplier Performance Score</h2>
<p>Avaliação consolidada dos fornecedores em critérios como qualidade, prazo e serviço.</p>

<h2>5. Time-to-Contract</h2>
<p>Tempo médio desde a requisição até a assinatura do contrato. Impacta diretamente a agilidade do negócio.</p>

<h2>Conclusão</h2>
<p>Essas métricas, quando bem comunicadas, transformam a percepção da área de compras perante a alta gestão.</p>`,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        date: "2024-11-20",
        readTime: "8 min de leitura",
        category: "analytics",
        tags: ["métricas", "KPIs", "gestão"],
        featured: true,
        author: "Equipe Veltta",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '2',
        type: 'video',
        title: "O Futuro do Procurement: Tendências para 2025",
        description: "Conversamos sobre as principais tendências que vão transformar a área de compras nos próximos anos.",
        content: "",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        date: "2024-11-18",
        readTime: "45 min",
        category: "tecnologia",
        tags: ["tendências", "futuro", "tecnologia"],
        featured: true,
        author: "Equipe Veltta",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: '3',
        type: 'ferramenta',
        title: "Planilha de Análise de Fornecedores",
        description: "Template completo para avaliar e comparar fornecedores com critérios ponderados. Pronto para uso.",
        content: `<h2>O que está incluso</h2>
<ul>
<li>Matriz de avaliação com 15 critérios</li>
<li>Peso customizável por critério</li>
<li>Gráfico radar automático</li>
<li>Comparativo lado a lado</li>
<li>Histórico de avaliações</li>
</ul>

<h2>Como usar</h2>
<p>1. Baixe o arquivo e abra no Excel ou Google Sheets</p>
<p>2. Configure os pesos dos critérios na aba "Configuração"</p>
<p>3. Preencha as avaliações na aba "Avaliação"</p>
<p>4. Veja o resultado consolidado na aba "Dashboard"</p>`,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        downloadUrl: "/downloads/analise-fornecedores.xlsx",
        downloadName: "Planilha_Analise_Fornecedores_Veltta.xlsx",
        fileSize: "245 KB",
        fileType: "xlsx",
        date: "2024-11-22",
        category: "gestao",
        tags: ["planilha", "fornecedores", "avaliação"],
        featured: true,
        author: "Equipe Veltta",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const ContentProvider = ({ children }) => {
    const [contents, setContents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load from localStorage or use initial content
        const saved = localStorage.getItem('veltta_contents_v2');
        if (saved) {
            try {
                setContents(JSON.parse(saved));
            } catch (e) {
                setContents(initialContent);
                localStorage.setItem('veltta_contents_v2', JSON.stringify(initialContent));
            }
        } else {
            setContents(initialContent);
            localStorage.setItem('veltta_contents_v2', JSON.stringify(initialContent));
        }
        setIsLoading(false);
    }, []);

    const saveToStorage = (newContents) => {
        localStorage.setItem('veltta_contents_v2', JSON.stringify(newContents));
    };

    const addContent = (content) => {
        const newContent = {
            ...content,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        const updated = [newContent, ...contents];
        setContents(updated);
        saveToStorage(updated);
        return newContent;
    };

    const updateContent = (id, updates) => {
        const updated = contents.map(item =>
            item.id === id
                ? { ...item, ...updates, updatedAt: new Date().toISOString() }
                : item
        );
        setContents(updated);
        saveToStorage(updated);
    };

    const deleteContent = (id) => {
        const updated = contents.filter(item => item.id !== id);
        setContents(updated);
        saveToStorage(updated);
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
