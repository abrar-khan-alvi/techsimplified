import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Zap, ArrowRight, BookOpen } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LandingPageProps {
    onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-black text-white overflow-hidden relative font-sans">

            {/* Background Abstract Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 30, 0],
                        rotate: [0, -10, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-10 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-screen flex flex-col justify-center relative z-10">

                {/* Main Hero Content */}
                <div className="text-center md:text-left md:flex md:items-center md:justify-between gap-12">

                    <div className="md:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-sm font-medium mb-6">
                                <Zap className="w-4 h-4 fill-indigo-300" />
                                <span>AI-Powered News Aggregator</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
                                Tech News, <br />
                                <span className="text-white">Simplified.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-lg">
                                Stay ahead of the curve without the noise. We curate global technology stories and deliver crystal-clear, AI-generated summaries.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onEnterApp}
                                className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">Start Reading</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>

                            <button onClick={onEnterApp} className="px-8 py-4 rounded-full font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all">
                                Learn More
                            </button>
                        </motion.div>
                    </div>

                    {/* Graphical/Cards Representation (Right Side) */}
                    <div className="hidden md:block md:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative z-10 grid grid-cols-2 gap-4"
                        >
                            {/* Abstract Cards */}
                            <FeatureCard
                                icon={<Cpu className="w-6 h-6 text-cyan-400" />}
                                title="Smart Summaries"
                                desc="Complex jargon turned into plain English."
                                delay={0.5}
                            />
                            <FeatureCard
                                icon={<Globe className="w-6 h-6 text-pink-400" />}
                                title="Global Reach"
                                desc="Stories from every corner of the tech world."
                                delay={0.6}
                                className="translate-y-8"
                            />
                            <FeatureCard
                                icon={<BookOpen className="w-6 h-6 text-emerald-400" />}
                                title="Multi-Language"
                                desc="Translate summaries instantly."
                                delay={0.7}
                            />
                        </motion.div>
                    </div>

                </div>

                {/* Footer Stats / Trust */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-10 left-0 right-0 text-center"
                >
                    <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">
                        Powered by Gemini AI • Real-time Updates
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay, className = "" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className={`bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl ${className}`}
    >
        <div className="mb-4 bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);
