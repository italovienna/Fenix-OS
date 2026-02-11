import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Wine, Plus, Scroll, ShoppingBag, LogOut, Sword, BookOpen, Menu, X } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'inicio', label: 'Início', icon: Sword },
        { id: 'financeiro', label: 'Financeiro', icon: Wine },
        { id: 'rotina', label: 'Rotina', icon: Plus },
        { id: 'materias', label: 'Matérias', icon: BookOpen },
        { id: 'oraculo', label: 'Oráculo', icon: Scroll },
        { id: 'mercado', label: 'Mercado', icon: ShoppingBag },
    ];

    const handleNavClick = (id) => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* --- MOBILE HEADER (Sticky Top) --- */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-black/80 backdrop-blur-md border-b border-white/10 z-[110] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <span className="text-berserk-red font-bold text-xl">Ψ</span>
                    <h1 className="text-sm font-bold tracking-[0.2em] text-zinc-300 uppercase">
                        Fenix <span className="text-berserk-red">OS</span>
                    </h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-300 p-2">
                    <Menu size={24} />
                </button>
            </div>

            {/* --- MOBILE DRAWER OVERLAY --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140] md:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-[300px] bg-zinc-950 border-r border-berserk-red/30 z-[150] md:hidden flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-xl font-bold uppercase text-white tracking-widest">Menu</h2>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-zinc-500">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Drawer Nav */}
                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                {navItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavClick(item.id)}
                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-berserk-red/10 text-berserk-red border-l-2 border-berserk-red' : 'text-zinc-400 hover:text-white'}`}
                                    >
                                        <item.icon size={20} />
                                        <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            {/* Drawer Footer */}
                            <div className="p-4 border-t border-white/5">
                                <button onClick={onLogout} className="flex items-center gap-3 text-zinc-500 w-full px-4 py-3 hover:text-red-500 transition-colors">
                                    <LogOut size={20} />
                                    <span className="uppercase text-xs font-bold tracking-wider">Desconectar</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- DESKTOP SIDEBAR (Unchanged) --- */}
            <motion.aside
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#0d0d0d] border-r border-[#7f1d1d] flex-col z-50"
            >
                {/* Logo Section */}
                <div className="p-8 flex flex-col items-center border-b border-[#2a2a2a]/50">
                    <div className="w-16 h-16 mb-4 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-2 border-[#7f1d1d] rotate-45 opacity-50"></div>
                        <div className="absolute inset-2 border border-[#dc2626] rotate-45"></div>
                        <span className="text-[#dc2626] font-bold text-2xl relative z-10">Ψ</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-[0.2em] text-[#d4d4d4] uppercase">
                        Fenix <span className="text-[#dc2626]">OS</span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-8 px-4 space-y-2">
                    {navItems.map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={{ x: 10, backgroundColor: "#7f1d1d", color: "white" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-md transition-colors duration-300 group text-left
                                ${activeTab === item.id
                                    ? 'bg-[#7f1d1d] text-white shadow-glow-red-strong border-l-4 border-white'
                                    : 'text-[#a3a3a3] hover:text-white'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="uppercase text-sm font-bold tracking-wider">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[#2a2a2a]/50">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#525252] rounded-sm transition-all hover:text-berserk-red group">
                        <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform" />
                        <span className="uppercase text-xs font-bold tracking-wider">Desconectar</span>
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-green"></div>
                        <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-widest">Sistema Online</span>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
