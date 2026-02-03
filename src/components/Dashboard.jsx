import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sword, Target, Wallet, TrendingUp, Skull } from 'lucide-react';
import { motion } from 'framer-motion';

const financialData = [
    { name: 'Jan', balance: 100 },
    { name: 'Feb', balance: 180 },
    { name: 'Mar', balance: 150 },
    { name: 'Apr', balance: 240 },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Dashboard = ({ habits, toggleHabit, level, progress, financials }) => {
    const [levelUpFlash, setLevelUpFlash] = useState(false);

    // Calculate totals
    const totalIncome = financials?.income?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const totalExpenses = financials?.expenses?.reduce((acc, curr) => acc + curr.value, 0) || 0;

    // Trigger flash when level changes
    useEffect(() => {
        setLevelUpFlash(true);
        const timer = setTimeout(() => setLevelUpFlash(false), 1000);
        return () => clearTimeout(timer);
    }, [level]);

    // Format currency
    const formatBRL = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12"
        >
            {/* Header */}
            <header className="mb-8 border-b border-berserk-border pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <Sword className="w-8 h-8 text-berserk-red" />
                    <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase">
                        Struggler: <span className="text-berserk-brightRed">Italo</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6 text-sm md:text-base w-full md:w-auto justify-end">
                    <div className="flex flex-col items-end w-40">
                        <div className="flex justify-between w-full mb-1">
                            <span className="text-berserk-muted uppercase text-xs">
                                Level <span className={`font-bold transition-all duration-300 ${levelUpFlash ? 'text-berserk-brightRed scale-150 animate-pulse' : 'text-white'}`} style={{ textShadow: levelUpFlash ? '0 0 10px red' : '0 0 5px rgba(220,38,38,0.5)' }}>{level}</span>
                            </span>
                            <span className="text-berserk-muted text-xs">{progress}/100 XP</span>
                        </div>
                        {/* XP Bar with Gradient & Pulse */}
                        <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden border border-berserk-border relative shadow-pulse-red">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-berserk-red to-berserk-brightRed relative z-10"
                            ></motion.div>
                            {/* Glow effect behind the bar */}
                            <div
                                className="absolute top-0 left-0 h-full bg-berserk-brightRed blur-[4px] opacity-50 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="w-px h-8 bg-berserk-border hidden md:block"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-berserk-muted uppercase text-xs">Meta Principal</span>
                        <div className="flex items-center gap-2 text-berserk-brightRed font-semibold">
                            <Target size={16} />
                            <span>Banco do Brasil 2027</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Habit Summary */}
                <motion.div variants={item} className="bg-berserk-card border border-berserk-border p-6 rounded-sm shadow-lg shadow-black/50 hover:shadow-glow-red transition-shadow duration-300">
                    <h2 className="text-xl uppercase font-bold text-berserk-muted mb-6 flex items-center gap-2">
                        <Skull size={20} /> Rituais Diários
                    </h2>
                    <div className="space-y-4">
                        {habits.map(habit => (
                            <motion.div key={habit.id}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleHabit(habit.id)}
                                className={`group cursor-pointer p-4 border transition-all duration-300 flex items-center gap-4 select-none
                        ${habit.completed
                                        ? 'bg-berserk-red/10 border-berserk-red/50'
                                        : 'bg-berserk-start border-berserk-border hover:border-berserk-muted hover:shadow-card-hover'}`}
                            >
                                <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors
                            ${habit.completed ? 'border-berserk-red bg-berserk-red' : 'border-berserk-muted group-hover:border-berserk-text'}`}>
                                    {habit.completed && <Sword size={14} className="text-black fill-current" />}
                                </div>
                                <span className={`uppercase tracking-wide font-medium ${habit.completed ? 'text-berserk-red line-through' : 'text-berserk-text'}`}>
                                    {habit.name}
                                </span>
                                <habit.icon className={`ml-auto w-5 h-5 ${habit.completed ? 'text-berserk-red' : 'text-berserk-muted'}`} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Financial Overview */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div variants={item} className="bg-berserk-card border border-berserk-border p-6 rounded-sm relative overflow-hidden group hover:shadow-glow-red transition-shadow duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Wallet size={64} />
                            </div>
                            <h3 className="text-berserk-muted uppercase text-xs font-bold mb-2">Renda Mensal</h3>
                            <div className="text-2xl font-bold text-emerald-500 flex items-baseline gap-1">
                                {formatBRL(totalIncome)}
                            </div>
                        </motion.div>

                        <motion.div variants={item} className="bg-berserk-card border border-berserk-border p-6 rounded-sm relative overflow-hidden group hover:shadow-glow-red transition-shadow duration-300">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={64} />
                            </div>
                            <h3 className="text-berserk-muted uppercase text-xs font-bold mb-2">Gastos Mensais</h3>
                            <div className="text-2xl font-bold text-berserk-brightRed flex items-baseline gap-1">
                                {formatBRL(totalExpenses)}
                            </div>
                        </motion.div>
                    </div>

                    {/* Chart Area */}
                    <motion.div variants={item} className="bg-berserk-card border border-berserk-border p-6 rounded-sm h-[350px] hover:shadow-glow-red transition-shadow duration-300">
                        <h3 className="text-berserk-muted uppercase text-xs font-bold mb-6 flex items-center gap-2">
                            <Sword size={14} /> Trajetória Financeira
                        </h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <AreaChart data={financialData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7f1d1d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#7f1d1d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#d4d4d4', textTransform: 'uppercase' }}
                                    itemStyle={{ color: '#dc2626' }}
                                    formatter={(value) => [`R$ ${value}`, 'Saldo']}
                                />
                                <Area type="monotone" dataKey="balance" stroke="#dc2626" fillOpacity={1} fill="url(#colorBalance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
