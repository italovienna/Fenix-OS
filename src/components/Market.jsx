import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coffee, Gamepad2, Pizza, BookOpen, Package, Sparkles, Clock } from 'lucide-react';
import { useXp } from '../contexts/XpContext';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Market = ({ showToast }) => {
    const { currentXp, buyItem, consumeItem, inventory, activeReward, rewardTimeLeft } = useXp();

    const products = [
        { id: 1, name: 'Sair com Amigos', price: 400, icon: Coffee, desc: 'Socialização necessária.', purity: 'Alta' },
        { id: 2, name: '1h de Game Sem Culpa', price: 200, icon: Gamepad2, desc: 'Descanso estratégico.', purity: 'Média' },
        { id: 3, name: 'Leitura de Ficção', price: 100, icon: BookOpen, desc: 'Alimento para a alma.', purity: 'Máxima' },
        { id: 4, name: 'Cheat Meal', price: 500, icon: Pizza, desc: 'Gula controlada.', purity: 'Baixa' },
    ];

    const getPurityColor = (purity) => {
        if (purity === 'Máxima') return 'text-berserk-gold';
        if (purity === 'Alta') return 'text-emerald-500';
        if (purity === 'Média') return 'text-blue-400';
        return 'text-berserk-red';
    };

    const handleBuy = (product) => {
        const result = buyItem(product.price, product.name);
        if (result.success) {
            if (showToast) showToast(`🛒 Resgatado: ${product.name} (-${product.price} XP)`);
        } else {
            if (showToast) showToast(`❌ ${result.error}`);
        }
    };

    const handleConsume = (item) => {
        const result = consumeItem(item.id);
        if (result.success) {
            if (showToast) showToast(`⚔️ Recompensa ativada: ${item.name} — 60 min`);
        } else {
            if (showToast) showToast(`❌ ${result.error}`);
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12 mb-20"
        >
            <header className="mb-8 border-b border-berserk-border pb-6">
                <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase mb-2 flex items-center gap-3">
                    <ShoppingBag className="text-berserk-red" /> Mercado de Almas
                </h1>
                <p className="text-berserk-muted text-sm">Troque XP por Lazer e Virtude.</p>
                <div className="mt-4 text-xl font-mono text-white">
                    Saldo Atual: <span className="text-berserk-gold font-bold">{currentXp} XP</span>
                </div>
            </header>

            {/* ACTIVE REWARD BANNER (inside Market) */}
            {activeReward && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 relative overflow-hidden rounded-xl border border-berserk-gold/50 bg-gradient-to-r from-berserk-gold/10 via-black to-berserk-gold/10 p-5"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.15)_0%,_transparent_70%)]" />
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-berserk-gold/20 border border-berserk-gold/50 flex items-center justify-center animate-pulse">
                                <Sparkles size={24} className="text-berserk-gold" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-berserk-gold/70 font-bold">Recompensa Ativa</p>
                                <p className="text-lg font-bold text-white uppercase">{activeReward.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-black/60 border border-berserk-gold/30 px-4 py-2 rounded-full">
                            <Clock size={16} className="text-berserk-gold" />
                            <span className="text-2xl font-mono font-bold text-berserk-gold tabular-nums">
                                {rewardTimeLeft}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        variants={itemAnim}
                        className="bg-zinc-900/40 border border-berserk-border p-6 rounded-sm relative overflow-hidden group hover:border-berserk-gold/50 transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <product.icon size={100} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-white uppercase">{product.name}</h3>
                                <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded-full ${getPurityColor(product.purity)} border-current opacity-80`}>
                                    {product.purity}
                                </span>
                            </div>
                            <p className="text-zinc-500 text-xs mb-6 h-10">{product.desc}</p>

                            <div className="flex items-center justify-between">
                                <span className="font-mono text-berserk-gold font-bold">{product.price} XP</span>
                                <button
                                    onClick={() => handleBuy(product)}
                                    disabled={currentXp < product.price}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors border
                                        ${currentXp >= product.price
                                            ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-berserk-red hover:border-berserk-red hover:text-black'
                                            : 'bg-transparent border-zinc-800 text-zinc-700 cursor-not-allowed'}`}
                                >
                                    {currentXp >= product.price ? 'Resgatar' : 'Insuficiente'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Inventory Section */}
            {inventory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 border-t border-berserk-border pt-8"
                >
                    <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Package size={20} className="text-berserk-gold" /> Inventário
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {inventory.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                className="bg-zinc-900/60 border border-white/5 px-4 py-3 rounded-sm flex flex-col gap-2 group hover:border-berserk-gold/30 transition-all"
                            >
                                <div>
                                    <p className="text-sm font-bold text-white">{item.name}</p>
                                    <p className="text-[10px] text-zinc-500 mt-1">
                                        {new Date(item.purchasedAt).toLocaleDateString('pt-BR')} • {item.price} XP
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleConsume(item)}
                                    disabled={!!activeReward}
                                    className={`w-full mt-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded transition-all flex items-center justify-center gap-1.5 border
                                        ${activeReward
                                            ? 'bg-transparent border-zinc-800 text-zinc-600 cursor-not-allowed'
                                            : 'bg-berserk-gold/10 border-berserk-gold/40 text-berserk-gold hover:bg-berserk-gold/20 hover:border-berserk-gold'
                                        }`}
                                >
                                    <Sparkles size={12} />
                                    {activeReward ? 'Em uso' : 'Resgatar'}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Market;
