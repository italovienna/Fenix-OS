import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useSound } from '../utils/sfx';

const AchievementToast = ({ notification, onClose }) => {
    const sfx = useSound();

    useEffect(() => {
        if (notification) {
            sfx.levelUp();
            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="fixed top-6 right-6 z-[100] flex items-center gap-4 bg-zinc-900/95 backdrop-blur-xl border border-berserk-gold rounded-full p-2 pr-6 shadow-[0_0_20px_rgba(212,175,55,0.3)] min-w-[300px]"
                >
                    {/* Icon Circle */}
                    <div className="relative w-12 h-12 bg-black rounded-full border border-berserk-gold/50 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-berserk-gold/20 rounded-full animate-pulse-slow" />
                        <Trophy size={24} className="text-berserk-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">
                            Conquista Desbloqueada
                        </h4>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide text-shadow-sm">
                            {notification.title}
                        </h3>
                        <p className="text-[10px] text-zinc-500 line-clamp-1">
                            {notification.desc}
                        </p>
                    </div>

                    {/* Close Button (Optional) */}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white"
                    >
                        <X size={14} />
                    </button>

                    {/* Scanning Light Effect */}
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-scan" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementToast;
