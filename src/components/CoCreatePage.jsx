import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Check, AlertCircle, Pencil, Plus, LogIn, LogOut, User, X, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/admin/LoginModal';
import SuggestionEditor from '@/components/admin/SuggestionEditor';

const CoCreatePage = ({ onBack }) => {
    const { user, isAdmin, logout } = useAuth();
    const [activePopup, setActivePopup] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [pendingSuggestions, setPendingSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [votedIds, setVotedIds] = useState(new Set());
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [editingSuggestion, setEditingSuggestion] = useState(null);
    const [processingIds, setProcessingIds] = useState(new Set()); // IDs sendo processados (aprovar/rejeitar)
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        company_segment: '',
        email: '',
        suggestion: ''
    });

    // Generate unique voter identifier (session-based)
    const getVoterIdentifier = () => {
        let voterId = localStorage.getItem('veltta_voter_id');
        if (!voterId) {
            voterId = 'voter_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('veltta_voter_id', voterId);
        }
        return voterId;
    };

    // Load suggestions from Supabase
    useEffect(() => {
        loadSuggestions();
        loadVotedSuggestions();
    }, [isAdmin]);

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            
            // Carrega sugestões aprovadas (voting, development, completed) - visível para todos
            const { data: approvedData, error: approvedError } = await supabase
                .from('cocreate_suggestions')
                .select('*')
                .in('status', ['voting', 'development', 'completed'])
                .order('votes', { ascending: false });
            
            if (approvedError) throw approvedError;
            setSuggestions(approvedData || []);

            // Se for admin, também carrega as pendentes
            if (isAdmin) {
                const { data: pendingData, error: pendingError } = await supabase
                    .from('cocreate_suggestions')
                    .select('*')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });
                
                if (pendingError) throw pendingError;
                setPendingSuggestions(pendingData || []);
            }
        } catch (error) {
            console.error('Error loading suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadVotedSuggestions = async () => {
        try {
            const voterId = getVoterIdentifier();
            console.log('Loading votes for voter:', voterId);
            
            const { data, error } = await supabase
                .from('cocreate_votes')
                .select('suggestion_id')
                .eq('voter_identifier', voterId);
            
            console.log('Loaded votes:', { data, error });
            
            if (error) throw error;
            const voteSet = new Set(data?.map(v => v.suggestion_id) || []);
            console.log('Vote IDs set:', [...voteSet]);
            setVotedIds(voteSet);
        } catch (error) {
            console.error('Error loading votes:', error);
        }
    };

    const handleVote = async (suggestionId) => {
        const voterId = getVoterIdentifier();
        
        if (votedIds.has(suggestionId)) {
            console.log('Already voted locally for:', suggestionId);
            return; // Already voted
        }

        // Otimistic update - atualiza UI imediatamente
        setVotedIds(prev => new Set([...prev, suggestionId]));
        setSuggestions(prev => prev.map(s => 
            s.id === suggestionId ? { ...s, votes: (s.votes || 0) + 1 } : s
        ));

        try {
            console.log('Attempting to vote for:', suggestionId, 'with voter:', voterId);
            
            // Insert vote record
            const { data: voteData, error: voteError } = await supabase
                .from('cocreate_votes')
                .insert({ suggestion_id: suggestionId, voter_identifier: voterId })
                .select();
            
            console.log('Vote insert result:', { voteData, voteError });
            
            if (voteError) {
                if (voteError.code === '23505') { // Unique constraint violation - already voted
                    console.log('Already voted in DB');
                    return; // Já votou, mantém o estado otimista
                }
                console.error('Vote insert error:', voteError);
                // Reverte o estado otimista
                setVotedIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(suggestionId);
                    return newSet;
                });
                setSuggestions(prev => prev.map(s => 
                    s.id === suggestionId ? { ...s, votes: Math.max(0, (s.votes || 0) - 1) } : s
                ));
                return;
            }

            // Vote was successful, now increment the counter using RPC
            console.log('Vote inserted, incrementing counter...');
            
            const { data: rpcData, error: rpcError } = await supabase
                .rpc('increment_suggestion_votes', { suggestion_uuid: suggestionId });
            
            console.log('RPC result:', { rpcData, rpcError });
            
            if (rpcError) {
                console.error('RPC error:', rpcError);
                // O voto foi registrado, mas o contador pode não ter sido incrementado
                // Recarrega as sugestões para sincronizar
                await loadSuggestions();
            }
            
            console.log('Vote successful for:', suggestionId);
        } catch (error) {
            console.error('Error voting:', error);
            // Reverte o estado otimista em caso de erro
            setVotedIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(suggestionId);
                return newSet;
            });
            setSuggestions(prev => prev.map(s => 
                s.id === suggestionId ? { ...s, votes: Math.max(0, (s.votes || 0) - 1) } : s
            ));
        }
    };

    const handleSubmitSuggestion = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.suggestion.trim()) {
            return;
        }

        try {
            setSubmitting(true);
            setSubmitStatus(null);

            // Save to Supabase - novas sugestões começam como 'pending'
            const { error } = await supabase
                .from('cocreate_suggestions')
                .insert({
                    name: formData.name.trim(),
                    position: formData.position.trim() || null,
                    company_segment: formData.company_segment.trim() || null,
                    email: formData.email.trim() || null,
                    suggestion: formData.suggestion.trim(),
                    votes: 0,
                    status: 'pending'
                });

            if (error) throw error;

            // Send email notification
            try {
                // Web3Forms public access key (safe to expose in frontend)
                const web3formsKey = import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_ACCESS_KEY_HERE';
                const emailData = {
                    access_key: web3formsKey,
                    subject: '🚀 Nova Sugestão no Veltta Co-Create',
                    from_name: 'Veltta Hub',
                    to: 'comercialveltta@outlook.com',
                    message: `
Nova sugestão recebida no Veltta Co-Create!

📌 Sugestão: ${formData.suggestion.trim()}

👤 Informações do autor:
- Nome: ${formData.name.trim()}
- Cargo: ${formData.position.trim() || 'Não informado'}
- Segmento: ${formData.company_segment.trim() || 'Não informado'}
- Email: ${formData.email.trim() || 'Não informado'}

📅 Data: ${new Date().toLocaleString('pt-BR')}
                    `.trim()
                };

                await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData)
                });
            } catch (emailError) {
                // Don't fail the form if email fails, just log it
                console.error('Email notification failed:', emailError);
            }

            setSubmitStatus('success');
            setFormData({ name: '', position: '', company_segment: '', email: '', suggestion: '' });
            
            // Reload suggestions
            await loadSuggestions();
            
            // Close popup after 2 seconds
            setTimeout(() => {
                closePopup();
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            console.error('Error submitting suggestion:', error);
            setSubmitStatus('error');
        } finally {
            setSubmitting(false);
        }
    };

    const openPopup = (id) => setActivePopup(id);
    const closePopup = () => {
        setActivePopup(null);
        setSubmitStatus(null);
    };

    const handleEditSuggestion = (suggestion) => {
        setEditingSuggestion(suggestion);
        setShowEditor(true);
    };

    const handleNewSuggestion = () => {
        setEditingSuggestion(null);
        setShowEditor(true);
    };

    const handleEditorClose = () => {
        setShowEditor(false);
        setEditingSuggestion(null);
    };

    const handleEditorSave = () => {
        loadSuggestions();
    };

    // Aprovar sugestão (muda de 'pending' para 'voting')
    const handleApproveSuggestion = async (suggestionId) => {
        try {
            setProcessingIds(prev => new Set([...prev, suggestionId]));
            
            const { error } = await supabase
                .from('cocreate_suggestions')
                .update({ status: 'voting' })
                .eq('id', suggestionId);
            
            if (error) throw error;
            
            // Atualiza estado local
            const approvedSuggestion = pendingSuggestions.find(s => s.id === suggestionId);
            if (approvedSuggestion) {
                setPendingSuggestions(prev => prev.filter(s => s.id !== suggestionId));
                setSuggestions(prev => [{ ...approvedSuggestion, status: 'voting' }, ...prev]);
            }
        } catch (error) {
            console.error('Error approving suggestion:', error);
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(suggestionId);
                return newSet;
            });
        }
    };

    // Rejeitar sugestão (deleta permanentemente)
    const handleRejectSuggestion = async (suggestionId) => {
        try {
            setProcessingIds(prev => new Set([...prev, suggestionId]));
            
            const { error } = await supabase
                .from('cocreate_suggestions')
                .delete()
                .eq('id', suggestionId);
            
            if (error) throw error;
            
            // Remove do estado local
            setPendingSuggestions(prev => prev.filter(s => s.id !== suggestionId));
        } catch (error) {
            console.error('Error rejecting suggestion:', error);
        } finally {
            setProcessingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(suggestionId);
                return newSet;
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'voting':
                return <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-[#f4f0ff] text-[#6A31FF]">Em votação</span>;
            case 'development':
                return <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-[#fff4d7] text-[#9b5a00]">Em desenvolvimento</span>;
            case 'completed':
                return <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-[#e6fbef] text-[#0d7b48]">Já no Hub</span>;
            default:
                return null;
        }
    };

    const getActionButton = (suggestion) => {
        const hasVoted = votedIds.has(suggestion.id);
        
        if (suggestion.status === 'completed') {
            return (
                <button className="px-2.5 py-1.5 rounded-full border border-[rgba(106,49,255,0.35)] bg-white text-[#6A31FF] text-[11px] font-medium hover:bg-purple-50">
                    Acessar no Hub
                </button>
            );
        }
        
        if (hasVoted) {
            return (
                <span className="px-2.5 py-1.5 rounded-full bg-[#e6fbef] text-[#0d7b48] text-[11px] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Votado
                </span>
            );
        }
        
        return (
            <button 
                onClick={() => handleVote(suggestion.id)}
                className="px-2.5 py-1.5 rounded-full border border-[rgba(106,49,255,0.35)] bg-white text-[#6A31FF] text-[11px] font-medium hover:bg-purple-50 transition-colors"
            >
                {suggestion.status === 'development' ? 'Quero prioridade' : 'Votar nessa ideia'}
            </button>
        );
    };

    // Get top 4 suggestions for the cards
    const topSuggestions = suggestions.filter(s => s.status === 'voting').slice(0, 4);
    
    // Get suggestions for the table (all statuses)
    const tableSuggestions = suggestions.slice(0, 5);

    return (
        <div className="min-h-screen flex justify-center items-start py-8 font-sans text-[#20163a]"
             style={{ background: 'radial-gradient(circle at top left,#f3e9ff 0,#f4f2ff 30%,#f7f7ff 70%,#fdfdff 100%)' }}>
            
            <div className="w-[1280px] min-h-[720px] rounded-[32px] bg-white shadow-[0_32px_80px_rgba(20,10,60,0.25)] p-[40px_56px_32px_56px] flex flex-col gap-[22px]">
                
                {/* Top Bar */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        {/* Back button integrated */}
                        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2" title="Voltar">
                            <ArrowLeft className="w-5 h-5 text-[#6A31FF]" />
                        </button>
                        <div className="w-[22px] h-[22px] rounded-lg bg-gradient-to-br from-[#6A31FF] to-[#B36DFF]"></div>
                        <div className="font-[650] tracking-[0.03em] text-sm text-[#20163a]">Veltta Hub</div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Admin controls */}
                        {user ? (
                            <>
                                <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[rgba(106,49,255,0.08)] rounded-full text-xs text-[#6A31FF]">
                                    <User className="w-3 h-3" />{user?.user_metadata?.name || user?.email?.split('@')[0]}
                                </span>
                                {isAdmin && (
                                    <button 
                                        onClick={handleNewSuggestion}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6A31FF] text-white rounded-full text-xs font-medium hover:bg-[#5A28E0] transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Nova Sugestão
                                    </button>
                                )}
                                <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Sair">
                                    <LogOut className="w-4 h-4 text-[#6A31FF]" />
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setShowLoginModal(true)} 
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(106,49,255,0.08)] text-[#6A31FF] rounded-full text-xs font-medium hover:bg-[rgba(106,49,255,0.15)] transition-colors"
                            >
                                <LogIn className="w-3 h-3" />
                                Entrar
                            </button>
                        )}
                        <div className="px-3.5 py-1.5 rounded-full border border-[rgba(106,49,255,0.25)] text-[11px] tracking-[0.09em] uppercase text-[#6A31FF] bg-[rgba(106,49,255,0.04)] font-semibold">
                            Espaço de cocriação da comunidade
                        </div>
                    </div>
                </div>

                {/* Hero */}
                <div className="grid grid-cols-[1.05fr_1fr] gap-10 items-center">
                    <div className="max-w-[560px]">
                        <div className="text-[13px] font-medium text-[#6A31FF] mb-2.5">Novo no Veltta Hub</div>
                        <div className="text-[52px] leading-[1.05] font-bold text-[#20163a] mb-4">
                            Vamos construir o <span className="text-[#6A31FF]">Hub de Compras</span> juntos
                        </div>
                        <div className="text-[18px] text-[#6b6885] mb-[26px]">
                            Um espaço para transformar as dores do dia a dia em conteúdos, templates e ferramentas
                            cocriados com profissionais de Compras como você.
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => openPopup('sugestao')}
                                className="px-8 py-3.5 rounded-full bg-gradient-to-br from-[#6A31FF] to-[#B36DFF] text-white border-none font-semibold cursor-pointer text-[15px] shadow-[0_16px_35px_rgba(106,49,255,0.45)] hover:opacity-90 transition-opacity"
                            >
                                Enviar sugestão
                            </button>
                            <button 
                                onClick={() => openPopup('ideias')}
                                className="px-8 py-3.5 rounded-full border border-[#d8d3ff] text-[#4b4375] bg-white font-medium cursor-pointer text-[15px] hover:bg-gray-50 transition-colors"
                            >
                                Ver ideias da comunidade
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center items-center">
                        {/* Ideas Panel */}
                        <div className="w-full p-[24px_26px_22px_26px] rounded-[28px] shadow-[0_30px_70px_rgba(26,16,80,0.28)]"
                             style={{ background: 'radial-gradient(circle at top,#f6f1ff 0,#ffffff 58%)' }}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-[15px] font-semibold text-[#4a3f77]">Ideias que a comunidade já pediu</div>
                                <div className="text-[11px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-full bg-[rgba(106,49,255,0.06)] text-[#6A31FF] font-semibold">
                                    VELTTA CO-CREATE
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                                {loading ? (
                                    <div className="col-span-2 flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-[#6A31FF]" />
                                    </div>
                                ) : topSuggestions.length > 0 ? (
                                    topSuggestions.map((suggestion, index) => (
                                        <IdeaCard 
                                            key={suggestion.id}
                                            title={suggestion.suggestion}
                                            votes={suggestion.votes}
                                            colorIndex={index}
                                            onVote={() => handleVote(suggestion.id)}
                                            hasVoted={votedIds.has(suggestion.id)}
                                            isAdmin={isAdmin}
                                            onEdit={() => handleEditSuggestion(suggestion)}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-2 text-center py-4 text-[#6b6885]">
                                        Seja o primeiro a sugerir uma ideia!
                                    </div>
                                )}
                            </div>
                            <div className="text-[13px] text-[#5b567a] mt-2">
                                O que facilitaria de verdade seu dia a dia em Compras? <span className="font-semibold text-[#6A31FF]">Comece votando ou sugerindo uma nova ideia.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-3.5 mt-1">
                    {/* Admin Pending Suggestions Panel */}
                    {isAdmin && pendingSuggestions.length > 0 && (
                        <div className="w-full rounded-[22px] bg-white shadow-[0_18px_40px_rgba(32,18,90,0.16)] border-2 border-amber-300 overflow-hidden">
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-4 py-2.5 text-white flex justify-between items-center">
                                <div className="text-[15px] font-semibold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Sugestões Aguardando Aprovação ({pendingSuggestions.length})
                                </div>
                                <div className="text-[11px] px-2.5 py-1 rounded-full border border-white/50 bg-white/10">
                                    Apenas você pode ver esta seção
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                {pendingSuggestions.map((suggestion) => (
                                    <div key={suggestion.id} className="flex items-start justify-between p-3 bg-amber-50 rounded-xl border border-amber-200 group">
                                        <div className="flex-1">
                                            <p className="text-[14px] text-[#443a68] font-medium mb-1">{suggestion.suggestion}</p>
                                            <div className="flex items-center gap-3 text-[11px] text-[#6b6885]">
                                                <span>Por: {suggestion.name}</span>
                                                {suggestion.position && <span>• {suggestion.position}</span>}
                                                {suggestion.company_segment && <span>• {suggestion.company_segment}</span>}
                                                <span>• {new Date(suggestion.created_at).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            {processingIds.has(suggestion.id) ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-[#6A31FF]" />
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveSuggestion(suggestion.id)}
                                                        className="p-2 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                                                        title="Aprovar sugestão"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectSuggestion(suggestion.id)}
                                                        className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                                                        title="Rejeitar sugestão"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Table Card */}
                    <div className="w-full rounded-[22px] bg-white shadow-[0_18px_40px_rgba(32,18,90,0.16)] border border-[#ece7ff] overflow-hidden">
                        <div className="bg-gradient-to-br from-[#6A31FF] to-[#9C63FF] px-4 py-2.5 text-white flex justify-between items-center">
                            <div className="text-[15px] font-semibold">Acompanhe o andamento das ideias</div>
                            <div className="text-[11px] px-2.5 py-1 rounded-full border border-white/50 bg-white/10">
                                Atualizado com base nos votos da comunidade
                            </div>
                        </div>
                        <table className="w-full border-collapse text-[13px]">
                            <thead className="bg-[#f8f6ff]">
                                <tr>
                                    <th className="p-[9px_14px] text-left font-semibold text-[#5a5280] border-b border-[#ece7ff]">Ideia</th>
                                    <th className="p-[9px_14px] text-left font-semibold text-[#5a5280] border-b border-[#ece7ff]">Status</th>
                                    <th className="p-[9px_14px] text-left font-semibold text-[#5a5280] border-b border-[#ece7ff]">Qtd. votos</th>
                                    <th className="p-[9px_14px] text-left font-semibold text-[#5a5280] border-b border-[#ece7ff]">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center">
                                            <Loader2 className="w-5 h-5 animate-spin text-[#6A31FF] mx-auto" />
                                        </td>
                                    </tr>
                                ) : tableSuggestions.length > 0 ? (
                                    tableSuggestions.map((suggestion) => (
                                        <tr key={suggestion.id} className="hover:bg-[#f3efff] even:bg-[#fbfaff] group">
                                            <td className="p-[9px_14px] text-[#443a68] border-b border-[#f0ecff]">
                                                <div className="flex items-center gap-2">
                                                    {suggestion.suggestion}
                                                    {isAdmin && (
                                                        <button 
                                                            onClick={() => handleEditSuggestion(suggestion)}
                                                            className="p-1 rounded hover:bg-[#e0d8ff] opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="w-3 h-3 text-[#6A31FF]" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-[9px_14px] border-b border-[#f0ecff]">{getStatusBadge(suggestion.status)}</td>
                                            <td className="p-[9px_14px] text-[#443a68] border-b border-[#f0ecff]">{suggestion.status === 'completed' ? '—' : suggestion.votes}</td>
                                            <td className="p-[9px_14px] border-b border-[#f0ecff]">{getActionButton(suggestion)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center text-[#6b6885]">
                                            Nenhuma ideia ainda. Seja o primeiro a sugerir!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Important Card */}
                    <div className="p-[14px_18px] rounded-[22px] bg-white shadow-[0_18px_40px_rgba(32,18,90,0.16)] border border-[#ece7ff]">
                        <div className="text-[11px] text-[#7b7696] p-[10px_12px] rounded-xl bg-[#fbf9ff] border border-dashed border-[#e0d8ff]">
                            <strong className="text-[#6A31FF]">Importante:</strong> todas as ideias enviadas são avaliadas pela equipe da Veltta considerando impacto,
                            viabilidade, prioridade da comunidade e <strong>complexidade de desenvolvimento</strong>. Nem todas poderão ser implementadas
                            — algumas exigem mais tempo, tecnologia ou integrações — mas todas ajudam a direcionar o roadmap e a evolução do Hub.
                        </div>
                    </div>
                </div>
            </div>

            {/* Popups */}
            <AnimatePresence>
                {activePopup && (
                    <div className="fixed inset-0 bg-[rgba(12,7,30,0.55)] flex items-center justify-center z-[999]" onClick={closePopup}>
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-[480px] max-w-[90vw] rounded-3xl bg-white shadow-[0_28px_70px_rgba(22,10,60,0.55)] p-[22px_24px_20px_24px] relative"
                            onClick={e => e.stopPropagation()}
                        >
                            {activePopup === 'sugestao' && (
                                <form onSubmit={handleSubmitSuggestion}>
                                    <div className="flex justify-between items-center mb-2.5">
                                        <div className="text-lg font-[650] text-[#22153b]">Enviar nova sugestão</div>
                                        <button type="button" onClick={closePopup} className="border-none bg-[#f1ecff] text-[#6A31FF] rounded-full px-2.5 py-1 text-[13px] cursor-pointer font-medium hover:bg-[#e5deff]">Fechar</button>
                                    </div>
                                    
                                    {submitStatus === 'success' ? (
                                        <div className="py-8 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#e6fbef] flex items-center justify-center">
                                                <Check className="w-8 h-8 text-[#0d7b48]" />
                                            </div>
                                            <div className="text-lg font-semibold text-[#22153b] mb-2">Sugestão enviada!</div>
                                            <p className="text-[13px] text-[#6b6885]">Sua sugestão será avaliada pela equipe Veltta e, se aprovada, aparecerá para votação da comunidade.</p>
                                        </div>
                                    ) : submitStatus === 'error' ? (
                                        <div className="py-8 text-center">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#fff0f0] flex items-center justify-center">
                                                <AlertCircle className="w-8 h-8 text-[#dc2626]" />
                                            </div>
                                            <div className="text-lg font-semibold text-[#22153b] mb-2">Erro ao enviar</div>
                                            <p className="text-[13px] text-[#6b6885] mb-4">Por favor, tente novamente.</p>
                                            <button 
                                                type="button"
                                                onClick={() => setSubmitStatus(null)}
                                                className="px-6 py-2 rounded-full border border-[#6A31FF] text-[#6A31FF] text-[13px] font-medium hover:bg-purple-50"
                                            >
                                                Tentar novamente
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-[13px] text-[#6b6885] mb-3.5">
                                                Conte o que realmente faria diferença no seu dia a dia em Compras. Essas informações ajudam a priorizar
                                                o que gera mais impacto para a comunidade.
                                            </p>
                                            <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                                                <input 
                                                    className="w-full rounded-xl border border-[#e1ddff] p-[8px_10px] text-[13px] outline-none focus:border-[#6A31FF] focus:shadow-[0_0_0_1px_rgba(106,49,255,0.15)]" 
                                                    placeholder="Nome *"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    required
                                                />
                                                <input 
                                                    className="w-full rounded-xl border border-[#e1ddff] p-[8px_10px] text-[13px] outline-none focus:border-[#6A31FF] focus:shadow-[0_0_0_1px_rgba(106,49,255,0.15)]" 
                                                    placeholder="Cargo"
                                                    value={formData.position}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                                />
                                                <input 
                                                    className="w-full rounded-xl border border-[#e1ddff] p-[8px_10px] text-[13px] outline-none focus:border-[#6A31FF] focus:shadow-[0_0_0_1px_rgba(106,49,255,0.15)]" 
                                                    placeholder="Segmento da empresa"
                                                    value={formData.company_segment}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, company_segment: e.target.value }))}
                                                />
                                                <input 
                                                    className="w-full rounded-xl border border-[#e1ddff] p-[8px_10px] text-[13px] outline-none focus:border-[#6A31FF] focus:shadow-[0_0_0_1px_rgba(106,49,255,0.15)]" 
                                                    placeholder="E-mail (opcional)"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                                />
                                            </div>
                                            <textarea
                                                className="w-full rounded-xl border border-[#e1ddff] p-[8px_10px] text-[13px] outline-none focus:border-[#6A31FF] focus:shadow-[0_0_0_1px_rgba(106,49,255,0.15)] resize-y min-h-[80px] mb-3"
                                                placeholder="Descreva sua ideia, dor ou ferramenta que você gostaria de ter no Hub... *"
                                                value={formData.suggestion}
                                                onChange={(e) => setFormData(prev => ({ ...prev, suggestion: e.target.value }))}
                                                required
                                            ></textarea>
                                            <div className="text-[11px] text-[#8a85a3] mb-2.5">
                                                Ao enviar, você concorda que sua sugestão poderá ser usada de forma agregada para evoluir o Veltta Hub.
                                            </div>
                                            <button 
                                                type="submit"
                                                disabled={submitting || !formData.name.trim() || !formData.suggestion.trim()}
                                                className="w-full py-3.5 rounded-full bg-gradient-to-br from-[#6A31FF] to-[#B36DFF] text-white border-none font-semibold cursor-pointer text-[15px] shadow-[0_16px_35px_rgba(106,49,255,0.45)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    'Enviar sugestão'
                                                )}
                                            </button>
                                        </>
                                    )}
                                </form>
                            )}

                            {activePopup === 'ideias' && (
                                <>
                                    <div className="flex justify-between items-center mb-2.5">
                                        <div className="text-lg font-[650] text-[#22153b]">Ideias da comunidade</div>
                                        <button onClick={closePopup} className="border-none bg-[#f1ecff] text-[#6A31FF] rounded-full px-2.5 py-1 text-[13px] cursor-pointer font-medium hover:bg-[#e5deff]">Fechar</button>
                                    </div>
                                    <p className="text-[13px] text-[#6b6885] mb-3.5">
                                        Veja algumas ideias que já estão na fila. Vote nas que fazem mais sentido para sua rotina ou volte para
                                        sugerir algo novo.
                                    </p>
                                    <div className="max-h-[300px] overflow-y-auto mb-3">
                                        {loading ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-[#6A31FF]" />
                                            </div>
                                        ) : suggestions.length > 0 ? (
                                            <ul className="text-[13px] text-[#6b6885] list-none space-y-2">
                                                {suggestions.map((suggestion) => (
                                                    <li key={suggestion.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8f6ff] group">
                                                        <span className="flex-1">{suggestion.suggestion}</span>
                                                        <div className="flex items-center gap-2 ml-2">
                                                            <span className="text-[11px] text-[#6A31FF] font-medium">{suggestion.votes} votos</span>
                                                            {isAdmin && (
                                                                <button 
                                                                    onClick={() => { closePopup(); handleEditSuggestion(suggestion); }}
                                                                    className="p-1 rounded hover:bg-[#e0d8ff] opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    title="Editar"
                                                                >
                                                                    <Pencil className="w-3 h-3 text-[#6A31FF]" />
                                                                </button>
                                                            )}
                                                            {votedIds.has(suggestion.id) ? (
                                                                <span className="px-2 py-1 rounded-full bg-[#e6fbef] text-[#0d7b48] text-[10px] font-medium flex items-center gap-1">
                                                                    <Check className="w-3 h-3" /> Votado
                                                                </span>
                                                            ) : suggestion.status !== 'completed' && (
                                                                <button 
                                                                    onClick={() => handleVote(suggestion.id)}
                                                                    className="px-2 py-1 rounded-full border border-[rgba(106,49,255,0.35)] bg-white text-[#6A31FF] text-[10px] font-medium hover:bg-purple-50"
                                                                >
                                                                    Votar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-center text-[#6b6885] py-4">Nenhuma ideia ainda. Seja o primeiro!</p>
                                        )}
                                    </div>
                                    <div className="text-[11px] text-[#8a85a3] mb-2.5">
                                        Clique em "Votar" para apoiar as ideias que mais fazem sentido para você.
                                    </div>
                                    <button className="w-full py-3.5 rounded-full bg-gradient-to-br from-[#6A31FF] to-[#B36DFF] text-white border-none font-semibold cursor-pointer text-[15px] shadow-[0_16px_35px_rgba(106,49,255,0.45)] hover:opacity-90 transition-opacity" onClick={closePopup}>
                                        Entendi, voltar para o Hub
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Admin Modals */}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            <SuggestionEditor 
                isOpen={showEditor} 
                onClose={handleEditorClose} 
                editingSuggestion={editingSuggestion}
                onSave={handleEditorSave}
            />
        </div>
    );
};

// Card colors for variety
const cardColors = [
    { bg: '#FFDFA8', icon: '📊' },
    { bg: '#CDE7FF', icon: '📋' },
    { bg: '#FFE0F0', icon: '✅' },
    { bg: '#D9FFE8', icon: '🔧' },
];

const IdeaCard = ({ title, votes, colorIndex = 0, onVote, hasVoted, isAdmin, onEdit }) => {
    const color = cardColors[colorIndex % cardColors.length];
    
    const handleClick = () => {
        if (isAdmin) {
            onEdit?.();
        } else if (!hasVoted) {
            onVote?.();
        }
    };
    
    return (
        <div 
            className="bg-white rounded-[20px] p-[11px_13px_10px_13px] shadow-[0_12px_26px_rgba(43,23,120,0.16)] border border-[rgba(223,218,255,0.9)] cursor-pointer hover:shadow-[0_14px_30px_rgba(43,23,120,0.2)] transition-shadow relative group"
            onClick={handleClick}
        >
            {isAdmin && (
                <div className="absolute top-2 right-2 p-1 bg-white/90 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="w-3 h-3 text-[#6A31FF]" />
                </div>
            )}
            <div className="flex items-start gap-2 mb-1.5">
                <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: color.bg }}
                >
                    {color.icon}
                </div>
                <div className="text-[13px] font-semibold text-[#33284f] line-clamp-2">{title}</div>
            </div>
            <div className="flex items-center justify-between">
                <span className="inline-block text-[10px] px-[9px] py-[3px] rounded-full border border-[rgba(106,49,255,0.35)] text-[#6A31FF] font-medium">
                    {votes} votos
                </span>
                {hasVoted && (
                    <span className="text-[10px] text-[#0d7b48] font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Votado
                    </span>
                )}
            </div>
        </div>
    );
};

export default CoCreatePage;
