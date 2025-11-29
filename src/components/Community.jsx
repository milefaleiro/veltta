import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight } from 'lucide-react';

const Community = () => {
  const communityLink = "https://chat.whatsapp.com/GRg6gqf23Xg9vBZztO3UWL";

  const handleJoin = () => {
    window.open(communityLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="comunidade" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="gradient-purple rounded-2xl p-8 md:p-16 text-white text-center relative overflow-hidden glow-purple"
        >
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Comunidade de Compradores</h2>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto">
              Junte-se a centenas de profissionais de compras no WhatsApp para trocar experiências, tirar dúvidas e acelerar sua carreira.
            </p>
            <Button
              onClick={handleJoin}
              className="bg-white text-[#6A1B9A] hover:bg-gray-100 font-bold text-lg px-10 py-7 rounded-full hover:scale-105 transition-transform group"
            >
              Entrar na comunidade
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Community;