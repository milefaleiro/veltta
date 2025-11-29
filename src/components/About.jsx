import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Fuel, BarChart3 } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Dados da ANP",
      description: "Integração automática com dados públicos da Agência Nacional do Petróleo"
    },
    {
      icon: Fuel,
      title: "Análise por Combustível",
      description: "Previsões específicas para gasolina, diesel, etanol e GNV"
    },
    {
      icon: TrendingUp,
      title: "Tendências de Preço",
      description: "Algoritmos que identificam padrões e antecipam variações de mercado"
    }
  ];

  return (
    <section className="py-24 bg-[#1C1C1C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00B050] rounded-full blur-3xl" />
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
            Como o <span className="text-[#00B050]">SmartFuel Planner</span> funciona?
          </h2>
          <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
            Nosso sistema utiliza dados públicos da ANP, tendências históricas de preços e sazonalidade
            para gerar projeções automáticas de demanda, ajudando você a tomar decisões estratégicas
            com base em inteligência de mercado real.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-[#00B050]/20 hover:border-[#00B050] transition-all"
            >
              <div className="w-16 h-16 bg-[#00B050]/10 rounded-full flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-[#00B050]" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-[#B3B3B3]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;