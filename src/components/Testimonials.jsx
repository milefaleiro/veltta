import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Depois de usar o SmartFuel Planner, reduzi em 12% meu estoque parado. O capital de giro que liberei foi investido na modernização da loja.",
      author: "Rede Horizonte",
      location: "Goiás, GO"
    },
    {
      quote: "Agora sei exatamente quanto comprar antes do aumento da Petrobras. Nossa margem melhorou significativamente, pois compramos de forma mais inteligente.",
      author: "Posto Alfa",
      location: "Minas Gerais, MG"
    },
    {
      quote: "A plataforma é intuitiva e as projeções são assustadoramente precisas. Virou ferramenta essencial na nossa reunião de planejamento semanal.",
      author: "Distribuidora Veloz",
      location: "Santa Catarina, SC"
    }
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#00B050] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00B050] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Resultados <span className="text-[#00B050]">reais</span> de clientes reais
          </h2>
          <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
            Veja como estamos ajudando negócios como o seu a lucrar mais.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-[#1C1C1C] p-8 rounded-2xl border border-[#00B050]/20 hover:border-[#00B050] transition-all relative"
            >
              <Quote className="w-12 h-12 text-[#00B050] opacity-20 absolute top-6 right-6" />
              <p className="text-lg text-white mb-6 leading-relaxed relative z-10 font-light">
                "{testimonial.quote}"
              </p>
              <div className="border-t border-[#00B050]/20 pt-4">
                <p className="font-semibold text-lg text-[#00B050]">{testimonial.author}</p>
                <p className="text-[#B3B3B3] text-sm">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;