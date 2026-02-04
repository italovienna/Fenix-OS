import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Coffee, Gamepad2, Pizza } from 'lucide-react';

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

const Market = ({ userXp, onBuy }) => {
    const products = [
        { id: 1, name: 'Intervalo (15min)', price: 100, icon: Coffee, desc: 'Uma pausa estratégica.' },
        { id: 2, name: 'Sessão de Games', price: 300, icon: Gamepad2, desc: '1 hora de jogatina sem culpa.' },
        { id: 3, name: 'Cheat Meal', price: 500, icon: Pizza, desc: 'Uma refeição livre.' },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12"
        >
            <header className="mb-8 border-b border-berserk-border pb-6">
                <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase mb-2 flex items-center gap-3">
                    <ShoppingBag className="text-berserk-red" /> Mercado de Almas
                </h1>
                <p className="text-berserk-muted text-sm">Troque seu sangue e suor (XP) por recompensas.</p>
                <div className="mt-4 text-xl font-mono text-white">
                    Saldo Atual: <span className="text-berserk-brightRed font-bold">{userXp} XP</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        variants={itemAnim}
                        className="bg-berserk-card border border-berserk-border p-6 rounded-sm relative overflow-hidden group hover:shadow-glow-red transition-all"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <product.icon size={100} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white uppercase mb-2">{product.name}</h3>
                            <p className="text-zinc-500 text-xs mb-6 h-10">{product.desc}</p>

                            <div className="flex items-center justify-between">
                                <span className="font-mono text-berserk-red font-bold">{product.price} XP</span>
                                <button
                                    onClick={() => onBuy(product.price, product.name)}
                                    disabled={userXp < product.price}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors border
                                        ${userXp >= product.price
                                            ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-berserk-red hover:border-berserk-red hover:text-black'
                                            : 'bg-transparent border-zinc-800 text-zinc-700 cursor-not-allowed'}`}
                                >
                                    {userXp >= product.price ? 'Resgatar' : 'Insuficiente'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Market;
