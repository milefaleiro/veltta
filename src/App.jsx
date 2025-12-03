import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ContentProvider } from '@/contexts/ContentContext';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Education from '@/components/Education';
import Content from '@/components/Content';
import Community from '@/components/Community';
import Footer from '@/components/Footer';
import KnowledgeHub from '@/components/KnowledgeHub';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Check hash on load and hash changes
    const handleHashChange = () => {
      if (window.location.hash === '#conteudos') {
        setCurrentPage('conteudos');
      } else if (window.location.hash === '' || window.location.hash === '#' || !window.location.hash.includes('conteudos')) {
        if (currentPage === 'conteudos') {
          setCurrentPage('home');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  const navigateToContentPage = () => {
    window.location.hash = 'conteudos';
    setCurrentPage('conteudos');
    window.scrollTo(0, 0);
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  if (currentPage === 'conteudos') {
    return (
      <AuthProvider>
        <ContentProvider>
          <Helmet>
            <title>Hub de Conhecimento - Veltta</title>
            <meta name="description" content="Artigos, vídeos, ferramentas e cursos sobre procurement, compras estratégicas e gestão de fornecedores." />
          </Helmet>
          <KnowledgeHub onBack={navigateToHome} />
          <Toaster />
        </ContentProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ContentProvider>
        <Helmet>
          <title>Veltta - Consultoria em Compras</title>
          <meta name="description" content="A Veltta capacita empresas com consultoria em compras, seleção de software, PDMS e analytics, além de programas de educação e uma comunidade exclusiva." />
        </Helmet>
        <div className="min-h-screen">
          <Header onNavigateToHub={navigateToContentPage} />
          <main>
            <Hero />
            <Services />
            <Education />
            <Content onViewAll={navigateToContentPage} />
            <Community />
          </main>
          <Footer />
          <Toaster />
        </div>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;