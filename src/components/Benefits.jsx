import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Fuel, Brain, DollarSign } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: BarChart2,
      title: "Projeções automáticas por combustível",
      description: "Receba previsões de demanda detalhadas para gasolina, etanol, diesel S10 e S500."
    },
    {
      icon: Fuel,
      title: "Planejamento de compras inteligente",
      description: "Saiba o volume e o momento exato para comprar, ajustado à sua realidade de vendas e estoque."
    },
    {
      icon: Brain,
      title: "Simulações 'E se?'",
      description: "Entenda o impacto de um aumento de preço da distribuidora ou uma mudança na demanda do mercado."
    },
    {
      icon: DollarSign,
      title: "Evite estoques parados",
      description: "Reduza custos com capital imobilizado e maximize a rentabilidade de cada litro vendido."
    }
  ];

  return (
    <section className="py-24 bg-[#1C1C1C] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Benefícios que <span className="text-[#00B050]">impulsionam</span> seus lucros
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00B050]/10 to-transparent rounded-2xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative bg-black/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-[#00B050]/50 transition-all h-full">
                <div className="w-16 h-16 gradient-green rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <benefit.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-[#B3B3B3] leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;