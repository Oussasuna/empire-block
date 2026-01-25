'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Map, Coins, Swords, Crown, LayoutGrid, CheckCircle } from 'lucide-react';

const tutorialSteps = [
    {
        title: "Welcome to Empire Blocks! 👑",
        content: "Build your empire on the Solana blockchain! Conquer territories, earn passive revenue, and battle for supremacy in a persistent 50x50 world.",
        icon: <Crown size={64} className="text-primary" />,
        color: "from-primary/20 to-primary/5"
    },
    {
        title: "The Grid",
        content: "The world consists of 2,500 unique territories. Each block is an NFT that you can own, trade, and build upon. Strategic positioning is key.",
        icon: <LayoutGrid size={64} className="text-blue-400" />,
        color: "from-blue-500/20 to-blue-500/5"
    },
    {
        title: "Territory Types",
        content: "Not all land is equal. Capitals (Red) earn 2x revenue. Corners (Gold) earn 3x. Borders (Cyan) offer defensive bonuses.",
        icon: <Map size={64} className="text-yellow-400" />,
        color: "from-yellow-500/20 to-yellow-500/5"
    },
    {
        title: "Earn Revenue 💰",
        content: "As a landowner, you earn passive SOL from every marketplace trade and action on adjacent blocks. The more you own, the more you earn.",
        icon: <Coins size={64} className="text-accent" />,
        color: "from-green-500/20 to-green-500/5"
    },
    {
        title: "Form Empires",
        content: "Connect 4 or more territories to form an Empire. Empires generate bonus yield and are harder to attack.",
        icon: <Crown size={64} className="text-purple-400" />,
        color: "from-purple-500/20 to-purple-500/5"
    },
    {
        title: "Battle System ⚔️",
        content: "Expand aggressively by initiating battles for neighbor territories. Winner takes the land, loser keeps their stake. High risk, high reward.",
        icon: <Swords size={64} className="text-danger" />,
        color: "from-red-500/20 to-red-500/5"
    },
    {
        title: "Ready to Conquer?",
        content: "Connect your wallet to start your journey. The grid awaits your command, Emperor.",
        icon: <CheckCircle size={64} className="text-white" />,
        color: "from-gray-700/50 to-gray-800/50"
    }
];

export default function GameTutorial() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem('empire-blocks-tutorial-seen');
        if (!seen) {
            // Delay slightly for effect
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setHasSeenTutorial(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('empire-blocks-tutorial-seen', 'true');
        setHasSeenTutorial(true);
    };

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Allow reopening
    if (!isOpen && hasSeenTutorial) {
        return (
            <button
                onClick={() => { setIsOpen(true); setCurrentStep(0); }}
                className="fixed bottom-4 right-4 z-40 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-full border border-white/5 transition-all"
                title="Replay Tutorial"
            >
                <span className="sr-only">Help</span>
                <span className="text-xl">?</span>
            </button>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-lg glass-panel rounded-2xl overflow-hidden shadow-2xl relative"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${tutorialSteps[currentStep].color} opacity-30 transition-colors duration-500`} />

                        {/* Header */}
                        <div className="relative p-6 border-b border-white/10 flex justify-between items-center">
                            <div className="flex gap-1">
                                {tutorialSteps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 w-8 rounded-full transition-colors duration-300 ${idx <= currentStep ? 'bg-primary' : 'bg-gray-700'}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Skip Tutorial"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="relative p-8 flex flex-col items-center text-center min-h-[320px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="mb-8 p-6 bg-white/5 rounded-full border border-white/10 shadow-lg shadow-black/20">
                                        {tutorialSteps[currentStep].icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-4 font-heading">{tutorialSteps[currentStep].title}</h2>
                                    <p className="text-gray-300 leading-relaxed max-w-sm">
                                        {tutorialSteps[currentStep].content}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="relative p-6 border-t border-white/10 flex justify-between items-center bg-black/20">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-1 text-sm font-medium transition-colors ${currentStep === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>

                            <button
                                onClick={handleNext}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105"
                            >
                                {currentStep === tutorialSteps.length - 1 ? "Let's Play!" : "Next"}
                                {currentStep !== tutorialSteps.length - 1 && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
