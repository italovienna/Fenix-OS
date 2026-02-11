import React from 'react';
import { motion } from 'framer-motion';
import { Sword, Wine, Plus, Scroll, ShoppingBag, BookOpen } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'inicio', icon: Sword, label: 'Início' },
        { id: 'financeiro', icon: Wine, label: 'Fin.' },
        { id: 'rotina', icon: Plus, label: 'Rotina' },
        { id: 'mercado', icon: ShoppingBag, label: 'Market' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-safe pb-4 pt-2 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
            {/* Enhanced Glassmorphism Nav with Strong Red Glow Border */}
            <nav className="pointer-events-auto flex items-center justify-between bg-black/90 backdrop-blur-2xl border border-white/10 border-t-2 border-t-berserk-red/80 rounded-2xl px-1 py-1 shadow-[0_-8px_32px_rgba(220,38,38,0.25)] relative overflow-hidden">
                {/* Intense Glass Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-berserk-red/5 via-transparent to-white/5 pointer-events-none" />

                {/* Animated Top Glow */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-berserk-red to-transparent opacity-60 animate-pulse" />

                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex flex-col items-center justify-center w-full min-h-[56px] py-2 px-1 transition-all duration-300 rounded-xl touch-manipulation ${isActive ? 'text-berserk-red' : 'text-zinc-500 hover:text-zinc-300 active:scale-95'
                                }`}
                            aria-label={item.label}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBot"
                                    className="absolute inset-0 bg-berserk-red/10 rounded-xl border border-berserk-red/20"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className="relative z-10 flex flex-col items-center">
                                <item.icon
                                    size={22}
                                    className={`mb-1 transition-all duration-300 ${isActive
                                            ? 'scale-110 drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                                            : 'scale-100'
                                        }`}
                                />
                                <span className="text-[9px] font-bold uppercase tracking-wider opacity-90">
                                    {item.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNav;
