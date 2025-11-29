import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';

const Versions = () => {
  const { toast } = useToast();

  const handleContact = (plan) => {
    toast({
      title: "🎉 Interesse registrado!",
      description: `Ótima escolha! Entraremos em contato em breve sobre o plano ${plan}.`,
    });
  };

  const plans = [
    {
      name: "Basic",
      description: "Análise de mercado com dados públicos.",
      features: [
        "Dados da ANP, frota e sazonalidade",
        "Análise de tendências de preço",
        "Relatórios regionais",
        "Ideal para planejamento inicial"
      ],
      highlighted: false
    },
    {
      name: "Plus",
      description: "Mercado + suas vendas internas.",
      features: [
        "Tudo do Basic",
        "Upload de histórico de vendas",
        "Projeções de demanda personalizadas",
        "Análise de margem por combustível",
        "Recomendado para postos individuais"
      ],
      highlighted: true
    },
    {
      name: "Pro",
      description: "Versão SaaS completa e automatizada.",
      features: [
        "Tudo do Plus",
        "Dashboards interativos em tempo real",
        "Atualizações automáticas",
        "Simulações de cenário 'E se?'",
        "API para integração",
        "Perfeito para redes e distribuidoras"
      ],
      highlighted: false
    }
  ];

  return (
    <section className="py-24 bg-[#1C1C1C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00B050] rounded-full blur-3xl" />
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
            Planos que se <span className="text-[#00B050]">adaptam</span> ao seu crescimento
          </h2>
          <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
            Da análise de mercado à plataforma completa. Escolha sua jornada.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative ${plan.highlighted ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00B050] text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Mais Popular
                </div>
              )}
              <div className={`bg-black/50 backdrop-blur-sm p-8 rounded-2xl border-2 h-full flex flex-col ${
                plan.highlighted ? 'border-[#00B050] glow-green' : 'border-[#00B050]/20'
              }`}>
                <div className="mb-6 flex-grow">
                  <h3 className="text-3xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-[#B3B3B3] mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#00B050] flex-shrink-0 mt-0.5" />
                        <span className="text-[#B3B3B3]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleContact(plan.name)}
                  className={`w-full py-6 rounded-full font-semibold transition-all ${
                    plan.highlighted
                      ? 'gradient-green text-black hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Solicitar Contato
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Versions;