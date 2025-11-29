import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VelttaLogo from '@/components/VelttaLogo';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu after clicking
    } else {
      toast({
        title: "🚧 Página em construção!",
        description: "Esta seção estará disponível em breve. Continue explorando!",
      });
    }
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/5521972257438", '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0B0B0F]/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <VelttaLogo />
          <span className="text-2xl font-bold text-white">Veltta</span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8 text-white">
          <li>
            <a
              href="#consultoria"
              onClick={(e) => handleLinkClick(e, 'consultoria')}
              className="hover:text-purple-400 transition-colors text-lg font-medium"
            >
              Consultoria
            </a>
          </li>
          <li>
            <a
              href="#educacao"
              onClick={(e) => handleLinkClick(e, 'educacao')}
              className="hover:text-purple-400 transition-colors text-lg font-medium"
            >
              Educação
            </a>
          </li>
          <li>
            <a
              href="#conteudo"
              onClick={(e) => handleLinkClick(e, 'conteudo')}
              className="hover:text-purple-400 transition-colors text-lg font-medium"
            >
              Conteúdos
            </a>
          </li>
          <li>
            <a
              href="#comunidade"
              onClick={(e) => handleLinkClick(e, 'comunidade')}
              className="hover:text-purple-400 transition-colors text-lg font-medium"
            >
              Comunidade
            </a>
          </li>
        </ul>

        <Button
          onClick={handleWhatsAppClick}
          className="hidden md:block gradient-purple text-white font-semibold px-6 py-3 rounded-full hover:scale-105 transition-transform"
        >
          Fale Conosco
        </Button>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-white hover:bg-white/10"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-[#0B0B0F] z-40 flex flex-col items-center justify-center md:hidden"
          >
            <ul className="flex flex-col space-y-8 text-white text-2xl">
              <li>
                <a
                  href="#consultoria"
                  onClick={(e) => handleLinkClick(e, 'consultoria')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Consultoria
                </a>
              </li>
              <li>
                <a
                  href="#educacao"
                  onClick={(e) => handleLinkClick(e, 'educacao')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Educação
                </a>
              </li>
              <li>
                <a
                  href="#conteudo"
                  onClick={(e) => handleLinkClick(e, 'conteudo')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Conteúdos
                </a>
              </li>
              <li>
                <a
                  href="#comunidade"
                  onClick={(e) => handleLinkClick(e, 'comunidade')}
                  className="hover:text-purple-400 transition-colors"
                >
                  Comunidade
                </a>
              </li>
            </ul>
            <Button
              onClick={handleWhatsAppClick}
              className="gradient-purple text-white font-semibold px-8 py-4 rounded-full hover:scale-105 transition-transform mt-12 text-xl"
            >
              Fale Conosco
            </Button>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;