import React from 'react';
import { motion } from 'framer-motion';

const CTA = () => {
  return (
    <section className="py-20 bg-[#6A1B9A] text-white text-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto Para Transformar Sua Área de Compras?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar você ou sua empresa a alcançar resultados extraordinários em procurement.
          </p>
          <a
            href="https://wa.me/5521972257438"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-white text-[#6A1B9A] font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Agende uma Conversa
          </a>
          <p className="text-white/60 text-sm mt-4">
            Resposta em até 24 horas úteis
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;