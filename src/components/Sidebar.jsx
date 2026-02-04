import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Wallet, Dumbbell, Store, BookOpen, LogOut, Sword, Coins, Scroll, Skull, ShoppingBag, Sparkles, Swords } from 'lucide-react';
import { supabase } from '../supabaseClient';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const navItems = [
        { id: 'inicio', label: 'Início', icon: Swords },
        { id: 'financeiro', label: 'Financeiro', icon: Coins },
        { id: 'rituais', label: 'Rituais', icon: Skull },
        { id: 'estudos', label: 'Estudos', icon: Scroll },
        { id: 'oraculo', label: 'Oráculo', icon: Sparkles },
        { id: 'mercado', label: 'Mercado', icon: ShoppingBag },
    ];

    return (
        <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed left-0 top-0 h-screen w-[260px] bg-[#0d0d0d] border-r border-[#7f1d1d] flex flex-col z-50"
        >
            {/* Logo Section */}
            <div className="p-8 flex flex-col items-center border-b border-[#2a2a2a]/50">
                <motion.div
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 mb-4 relative flex items-center justify-center cursor-pointer"
                >
                    {/* Brand of Sacrifice Placeholder - Stylized */}
                    <div className="absolute inset-0 border-2 border-[#7f1d1d] rotate-45 opacity-50"></div>
                    <div className="absolute inset-2 border border-[#dc2626] rotate-45"></div>
                    <span className="text-[#dc2626] font-bold text-2xl relative z-10">Ψ</span>
                </motion.div>
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
                        <item.icon
                            className={`w-6 h-6 transition-colors duration-300
                                ${activeTab === item.id ? 'text-white' : 'text-[#7f1d1d] group-hover:text-white'}
                            `}
                        />
                        <span className="uppercase text-sm font-bold tracking-wider">{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-[#2a2a2a]/50">
                <motion.button
                    whileHover={{ x: 5, color: "#dc2626" }}
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#525252] rounded-sm transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="uppercase text-xs font-bold tracking-wider">Desconectar</span>
                </motion.button>

                <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase tracking-widest text-[#525252]">Sistema Online</span>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
