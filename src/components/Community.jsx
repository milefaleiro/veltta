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
    <section className="bg-[#0B0B0F] py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
          <div className="flex-1">
            <div className="w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Comunidade de <span className="text-purple-500">Compradores</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Disponível em breve
            </p>
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed opacity-60">
              Em breve
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/community_wa.jpg"
                alt="Comunidade WhatsApp"
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0B0F]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;