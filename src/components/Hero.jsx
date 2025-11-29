import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
const Hero = () => {
  const communityLink = "https://chat.whatsapp.com/GRg6gqf23Xg9vBZztO3UWL";
  const handleJoinCommunity = () => {
    window.open(communityLink, '_blank', 'noopener,noreferrer');
  };
  const handleScrollToServices = () => {
    const section = document.getElementById('consultoria');
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-20 flex items-center bg-[#0B0B0F] text-white overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 items-center gap-12">
          <div className="text-center md:text-left">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="inline-block border border-white/20 bg-white/10 px-4 py-1 rounded-full text-sm font-semibold mb-6">
              O Espaço do Profissional de Compras
            </motion.div>
            
            <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.1
          }} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Procurement by <br />
              <span className="text-purple-400">Veltta</span>
            </motion.h1>

            <motion.p initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }} className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto md:mx-0">
              O ecossistema completo de conhecimento e conexão para profissionais e empresas da área de compras.
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.5
          }} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-0">
              <Button onClick={handleScrollToServices} className="gradient-purple text-white font-semibold text-base px-6 py-5 rounded-full hover:scale-105 transition-transform group flex items-center justify-center gap-2">
                Conheça Nossos Serviços
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={handleJoinCommunity} className="bg-white text-black font-semibold text-base px-6 py-5 rounded-full hover:bg-gray-200 transition-colors">
                Entre na Comunidade
              </Button>
            </motion.div>
          </div>
          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 1,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1]
        }} className="hidden md:block">
            <div className="p-1 border border-purple-500/50 rounded-2xl shadow-[0_0_30px_rgba(138,36,170,0.3)]">
              <img class="w-full max-w-lg mx-auto rounded-lg" alt="Equipe colaborando em um escritório com post-its na parede" src="https://horizons-cdn.hostinger.com/f89de369-6834-4684-8f9d-b3a26a4ff7df/captura-de-tela-2025-11-13-210314-puIxr.png" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default Hero;