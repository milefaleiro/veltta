import React from 'react';
import { motion } from 'framer-motion';
import { Database, UploadCloud, BrainCircuit, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Database,
      title: "Dados de Mercado",
      description: "Coletamos e processamos dados públicos da ANP, preços, frota e sazonalidade.",
      color: "text-[#00B050]"
    },
    {
      number: "02",
      icon: UploadCloud,
      title: "Seus Dados Internos",
      description: "Você nos envia seu histórico de vendas, margens e níveis de estoque de forma segura.",
      color: "text-blue-400"
    },
    {
      number: "03",
      icon: BrainCircuit,
      title: "Inteligência Combinada",
      description: "Nossos algoritmos cruzam os dados para gerar previsões de demanda e planejamento de compra ideais.",
      color: "text-purple-400"
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-[#1C1C1C] to-black"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Como nossa <span className="text-gradient">Inteligência</span> funciona?
          </h2>
          <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto">
            Combinamos a visão macro do mercado com o comportamento real do seu posto em 3 passos simples.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="hidden lg:flex items-center justify-between gap-4 mb-12">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                  className="flex-1"
                >
                  <div className="bg-[#1C1C1C] p-8 rounded-2xl border border-white/10 hover:border-[#00B050]/50 transition-all duration-300 group relative">
                    <div className="absolute -top-6 left-8 w-12 h-12 bg-[#00B050] text-black text-xl font-bold rounded-full flex items-center justify-center border-4 border-black group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <div className="mt-4">
                      <step.icon className={`w-12 h-12 mb-4 ${step.color}`} />
                      <h3 className={`text-2xl font-semibold mb-3 ${step.color}`}>{step.title}</h3>
                      <p className="text-[#B3B3B3] text-base leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index + 1) * 0.2, duration: 0.4 }}
                    className="flex-shrink-0"
                  >
                    <ArrowRight className="w-8 h-8 text-[#00B050]" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="lg:hidden flex flex-col gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                className="bg-[#1C1C1C] p-8 rounded-2xl border border-white/10 hover:border-[#00B050]/50 transition-all duration-300 group relative"
              >
                <div className="absolute -top-6 left-8 w-12 h-12 bg-[#00B050] text-black text-xl font-bold rounded-full flex items-center justify-center border-4 border-black group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
                <div className="mt-4">
                  <step.icon className={`w-12 h-12 mb-4 ${step.color}`} />
                  <h3 className={`text-2xl font-semibold mb-3 ${step.color}`}>{step.title}</h3>
                  <p className="text-[#B3B3B3] text-base leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;