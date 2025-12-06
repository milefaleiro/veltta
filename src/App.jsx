import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Community from '@/components/Community';
import Footer from '@/components/Footer';

import CoCreatePage from '@/components/CoCreatePage';
import ConsultoriaPage from '@/components/ConsultoriaPage';
import EducacaoPage from '@/components/EducacaoPage';
import ConteudosPage from '@/components/ConteudosPage';
import Services from '@/components/Services';
import Education from '@/components/Education';
import Content from '@/components/Content';
import CTA from '@/components/CTA';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Check hash on load and hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['consultoria', 'educacao', 'conteudos', 'cocrie'].includes(hash)) {
        setCurrentPage(hash);
      } else if (hash === '' || hash === '#') {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page) => {
    if (page === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = page;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const getPageMeta = () => {
    switch (currentPage) {
      case 'consultoria':
        return { title: 'Consultoria em Compras - Veltta', description: 'Soluções especializadas para elevar a performance da sua área de compras.' };
      case 'educacao':
        return { title: 'Educação - Veltta', description: 'Capacite suas equipes com treinamentos de ponta em procurement e compras estratégicas.' };
      case 'conteudos':
        return { title: 'Conteúdos - Veltta', description: 'Artigos, podcasts e lives sobre procurement, compras estratégicas e gestão de fornecedores.' };
      case 'cocrie':
        return { title: 'Co-crie com a Veltta', description: 'Contribua com ideias e sugestões para a comunidade Veltta.' };

      default:
        return { title: 'Veltta - Consultoria em Compras', description: 'A Veltta capacita empresas com consultoria em compras, seleção de software, PDMS e analytics, além de programas de educação e uma comunidade exclusiva.' };
    }
  };

  const meta = getPageMeta();

  const renderPage = () => {
    switch (currentPage) {
      case 'consultoria':
        return <ConsultoriaPage onNavigate={navigate} />;
      case 'educacao':
        return <EducacaoPage onNavigate={navigate} />;
      case 'conteudos':
        return <ConteudosPage onNavigate={navigate} />;
      case 'cocrie':
        return <CoCreatePage onBack={() => navigate('conteudos')} />;

      default:
        return (
          <div className="min-h-screen">
            <Header onNavigate={navigate} currentPage="home" />
            <main>
              <Hero />
              <Services />
              <Education />
              <Content onViewAll={() => navigate('conteudos')} />
              <Community />
              <CTA />
            </main>
            <Footer />
          </div>
        );
    }
  };

  return (
    <AuthProvider>
      <ContentProvider>
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        {renderPage()}
        <Toaster />
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;