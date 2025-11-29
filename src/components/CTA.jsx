import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
  const { toast } = useToast();

  const handleDemo = () => {
    toast({
      title: "🎉 Solicitação recebida!",
      description: "Nossa equipe entrará em contato em breve para agendar sua demonstração gratuita!",
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-green" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-black">
            Planeje o futuro do seu posto com precisão.
          </h2>
          <p className="text-xl md:text-2xl text-black/80 mb-10">
            Descubra como a inteligência de dados pode transformar sua operação e aumentar sua lucratividade.
          </p>
          <Button
            onClick={handleDemo}
            className="bg-black text-white hover:bg-black/90 font-semibold text-lg px-10 py-7 rounded-full hover:scale-105 transition-all shadow-2xl group"
          >
            Solicitar demonstração gratuita
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-black/70 mt-6 text-sm">
            Sem compromisso • Demonstração de 30 minutos • Suporte em português
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;