import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import VelttaLogo from '@/components/VelttaLogo';
const Footer = () => {
  const {
    toast
  } = useToast();
  const handleLinkClick = () => {
    toast({
      title: "🚧 Página em construção!",
      description: "Esta seção estará disponível em breve. Continue explorando!"
    });
  };
  return <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8 text-gray-800">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
               <VelttaLogo />
              <span className="text-2xl font-bold text-gray-900">Veltta</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Capacitando o futuro do Procurement com estratégia, inteligência e comunidade.
            </p>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block text-gray-900">Contato</span>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8E24AA]" />
                <span className="text-sm">comercialveltta@outlook.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8E24AA]" />
                <span className="text-sm">(21) 97225-7438</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block text-gray-900">Navegação</span>
            <div className="space-y-2 text-gray-600">
              <p onClick={handleLinkClick} className="text-sm hover:text-[#6A1B9A] cursor-pointer transition-colors">Consultoria</p>
              <p onClick={handleLinkClick} className="text-sm hover:text-[#6A1B9A] cursor-pointer transition-colors">Educação</p>
              <p onClick={handleLinkClick} className="text-sm hover:text-[#6A1B9A] cursor-pointer transition-colors">Conteúdo</p>
              <p onClick={handleLinkClick} className="text-sm hover:text-[#6A1B9A] cursor-pointer transition-colors">Comunidade</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Veltta. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;