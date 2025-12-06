import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, Mic, ArrowRight } from 'lucide-react';

const Content = ({ onViewAll }) => {
    const contentTypes = [
        {
            icon: FileText,
            label: "Artigos e Insights",
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            icon: Video,
            label: "Lives e Webinars",
            color: "text-purple-600",
            bg: "bg-purple-100"
        },
        {
            icon: Mic,
            label: "Podcasts Exclusivos",
            color: "text-purple-600",
            bg: "bg-purple-100"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto">
                    {/* Left Column: Text & List */}
                    <div className="flex-1 max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Mantenha-se <span className="text-purple-600">Atualizado</span>
                            </h2>
                            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                                Acesse um rico acervo de conteúdos para aprofundar seu conhecimento em procurement, logística e supply chain.
                            </p>

                            <div className="space-y-6 mb-10">
                                {contentTypes.map((type, index) => (
                                    <div key={index} className="flex items-center gap-4 group cursor-default">
                                        <div className={`w-12 h-12 rounded-full ${type.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                            <type.icon className={`w-6 h-6 ${type.color}`} />
                                        </div>
                                        <span className="text-lg font-medium text-gray-800">{type.label}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={onViewAll}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#6A1B9A] text-white font-semibold rounded-lg hover:bg-[#4A148C] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300"
                            >
                                Ver Todos os Conteúdos
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="flex-1 w-full relative">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {/* Large Image Top */}
                            <div className="col-span-2 rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
                                <img
                                    src="/content_top.jpg"
                                    alt="Podcast Setup"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Small Image 1 */}
                            <div className="rounded-2xl overflow-hidden shadow-lg h-48 md:h-56">
                                <img
                                    src="/content_bottom_left.jpg"
                                    alt="Digital Content"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Small Image 2 */}
                            <div className="rounded-2xl overflow-hidden shadow-lg h-48 md:h-56">
                                <img
                                    src="/content_bottom_right.jpg"
                                    alt="Analytics Content"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </motion.div>

                        {/* Decorative blob */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-100/50 rounded-full blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Content;