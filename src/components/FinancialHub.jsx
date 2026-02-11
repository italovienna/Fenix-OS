import React, { useState, useMemo } from 'react';
import { Wallet, TrendingDown, Trash2, Plus, X, Activity, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, Legend
} from 'recharts';
import { useFinance } from '../contexts/FinanceContext';

const itemAnim = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };

const FinancialHub = ({ showToast }) => {
    const { income, expenses, history, balance, addIncome, addExpense, deleteEntry, processQuickEntry } = useFinance();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuickEntryOpen, setIsQuickEntryOpen] = useState(false);
    const [quickText, setQuickText] = useState('');
    const [modalType, setModalType] = useState('income');
    const [newItem, setNewItem] = useState({ name: '', value: '' });
    const [quickEntryFeedback, setQuickEntryFeedback] = useState(null);
    const [pendingClassification, setPendingClassification] = useState(null);

    // --- QUICK ENTRY (Async Fix) ---
    const handleQuickEntry = async () => {
        if (!quickText.trim()) return;

        // AWAIT the async result!
        const result = await processQuickEntry(quickText);

        if (result.success) {
            setQuickEntryFeedback({ type: 'success', message: result.message });
            if (showToast) showToast(`✅ ${result.message}`);
            setTimeout(() => {
                setIsQuickEntryOpen(false);
                setQuickText('');
                setQuickEntryFeedback(null);
            }, 1000);
        } else if (result.needsClassification) {
            setIsQuickEntryOpen(false);
            setPendingClassification({ value: result.value, description: result.description });
            setQuickText('');
            setQuickEntryFeedback(null);
        } else {
            setQuickEntryFeedback({ type: 'error', message: result.error });
        }
    };

    // --- MODAL HANDLERS ---
    const handleClassify = (type) => {
        if (!pendingClassification) return;
        const { value, description } = pendingClassification;
        if (type === 'income') addIncome(description, value);
        else addExpense(description, value);
        setPendingClassification(null);
    };

    const handleAdd = () => {
        if (!newItem.name || !newItem.value) return;
        if (modalType === 'income') addIncome(newItem.name, parseFloat(newItem.value));
        else addExpense(newItem.name, parseFloat(newItem.value));
        setIsModalOpen(false);
        setNewItem({ name: '', value: '' });
    };

    const openModal = (type) => {
        setModalType(type);
        setNewItem({ name: '', value: '' });
        setIsModalOpen(true);
    };

    const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // --- 1. EVOLUTION CHART LOGIC (Split Gradient) ---
    const evolutionData = useMemo(() => {
        if (!history || history.length === 0) return [];

        const sorted = [...history].sort((a, b) => new Date(a.created_at || a.timestamp) - new Date(b.created_at || b.timestamp));

        let current = 0;
        const points = [];

        // Daily buckets map
        const dailyMap = new Map();

        sorted.forEach(entry => {
            const val = parseFloat(entry.value || entry.amount || 0);
            const type = (entry.type || '').toLowerCase();
            const isIncome = ['income', 'receita', 'entrada', 'deposit'].includes(type);

            if (isIncome) current += val;
            else current -= val;

            const date = new Date(entry.created_at || entry.timestamp);
            if (isNaN(date.getTime())) return;

            const dayKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            dailyMap.set(dayKey, current);
        });

        return Array.from(dailyMap.entries()).map(([day, val]) => ({ day, value: val }));
    }, [history]);

    // Calculate Gradient Offset
    const gradientOffset = () => {
        if (evolutionData.length === 0) return 0;
        const dataMax = Math.max(...evolutionData.map((i) => i.value));
        const dataMin = Math.min(...evolutionData.map((i) => i.value));

        if (dataMax <= 0) return 0;
        if (dataMin >= 0) return 1;

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    // --- 2. PIE CHART LOGIC ---
    const expenseData = useMemo(() => {
        if (!expenses || expenses.length === 0) return [];
        // Strict Filter
        const valid = expenses.filter(t => !['income', 'receita', 'entrada'].includes((t.type || '').toLowerCase()));

        const grouped = valid.reduce((acc, curr) => {
            const cat = (curr.category || 'Outros').charAt(0).toUpperCase() + (curr.category || 'Outros').slice(1).toLowerCase();
            acc[cat] = (acc[cat] || 0) + (curr.value || 0);
            return acc;
        }, {});

        const COLORS = ['#ef4444', '#f97316', '#eab308', '#64748b', '#78350f', '#b91c1c'];

        return Object.entries(grouped)
            .map(([name, value], index) => ({ name, value, color: COLORS[index % COLORS.length] }))
            .sort((a, b) => b.value - a.value);
    }, [expenses]);


    return (
        <motion.div variants={itemAnim} initial="hidden" animate="show" className="p-4 md:p-12 pb-32 space-y-8 h-full flex flex-col">

            {/* HEADER */}
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Hub Financeiro</h1>
                    <button onClick={() => setIsQuickEntryOpen(true)} className="mt-2 flex items-center gap-2 px-3 py-1 bg-berserk-gold/20 text-berserk-gold text-xs font-bold uppercase rounded-full hover:bg-berserk-gold/30 transition-all">
                        <Activity size={14} /> Quick Entry
                    </button>
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Saldo Atual</p>
                    <div className={`text-4xl font-mono font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-red-500'} drop-shadow-2xl`}>
                        {formatBRL(balance)}
                    </div>
                </div>
            </header>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* EVOLUTION (SPLIT) */}
                <div className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden flex flex-col h-[350px]">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Evolução Patrimonial</h3>
                    <div className="flex-1 w-full relative">
                        {evolutionData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset={off} stopColor="#10b981" stopOpacity={1} />
                                            <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                                        </linearGradient>
                                        <linearGradient id="splitFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset={off} stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset={off} stopColor="#ef4444" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val / 1000}k`} />
                                    <RechartsTooltip content={({ active, payload }) => {
                                        if (!active || !payload?.[0]) return null;
                                        const v = payload[0].value;
                                        return (
                                            <div className={`bg-black/90 border ${v >= 0 ? 'border-emerald-500' : 'border-red-500'} px-3 py-2 rounded shadow-xl`}>
                                                <p className="text-xs text-zinc-400">{payload[0].payload.day}</p>
                                                <p className={`text-lg font-bold font-mono ${v >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatBRL(v)}</p>
                                            </div>
                                        );
                                    }} />
                                    <Area type="monotone" dataKey="value" stroke="url(#splitColor)" fill="url(#splitFill)" strokeWidth={3} animationDuration={1500} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 uppercase tracking-widest text-xs">Sem dados</div>
                        )}
                    </div>
                </div>

                {/* DISTRIBUTION (PIE) */}
                <div className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden flex flex-col h-[350px]">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Distribuição de Gastos</h3>
                    <div className="flex-1 w-full relative">
                        {expenseData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={expenseData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                                        {expenseData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <RechartsTooltip content={({ active, payload }) => {
                                        if (!active || !payload?.[0]) return null;
                                        return (
                                            <div className="bg-black/90 border border-zinc-700 px-3 py-2 rounded shadow-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
                                                    <p className="text-xs text-zinc-300 uppercase">{payload[0].name}</p>
                                                </div>
                                                <p className="text-lg font-bold text-white font-mono">{formatBRL(payload[0].value)}</p>
                                            </div>
                                        );
                                    }} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} formatter={(val) => <span className="text-zinc-400 text-xs ml-1">{val}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 uppercase tracking-widest text-xs">Sem dados</div>
                        )}
                    </div>
                </div>
            </div>

            {/* QUICK ENTRY MODAL */}
            <AnimatePresence>
                {isQuickEntryOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-zinc-900 border border-berserk-gold p-6 rounded-lg w-full max-w-md shadow-2xl relative">
                            <button onClick={() => setIsQuickEntryOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
                            <h3 className="text-xl font-bold text-berserk-gold uppercase mb-2">Oracle Quick Entry</h3>
                            <p className="text-zinc-500 text-xs mb-4">Ex: "Pagamento 500"</p>
                            <input autoFocus value={quickText} onChange={(e) => setQuickText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleQuickEntry()} className="w-full bg-black border border-zinc-700 p-3 text-white rounded mb-3 outline-none focus:border-berserk-gold" placeholder="Digite..." />
                            {quickEntryFeedback && <div className={`text-xs p-2 rounded mb-2 ${quickEntryFeedback.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{quickEntryFeedback.message}</div>}
                            <button onClick={handleQuickEntry} className="w-full py-3 bg-berserk-gold text-black font-bold uppercase rounded">Processar</button>
                        </motion.div>
                    </div>
                )}
                {/* Fallback Modal */}
                {pendingClassification && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 border border-berserk-gold/60 p-6 rounded-lg w-full max-w-md shadow-2xl relative">
                            <button onClick={() => setPendingClassification(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
                            <h3 className="text-lg font-bold text-berserk-gold uppercase mb-1">Classificar</h3>
                            <p className="text-zinc-500 text-xs mb-4">Entrada ou Saída?</p>
                            <div className="bg-black/60 border border-white/10 rounded p-4 mb-6 text-center">
                                <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">{pendingClassification.description}</p>
                                <p className="text-3xl font-mono font-bold text-white">{formatBRL(pendingClassification.value)}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleClassify('expenses')} className="flex items-center justify-center gap-2 py-4 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 font-bold uppercase text-sm"><ArrowDownCircle size={20} /> Saída</button>
                                <button onClick={() => handleClassify('income')} className="flex items-center justify-center gap-2 py-4 rounded-lg bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 font-bold uppercase text-sm"><ArrowUpCircle size={20} /> Entrada</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* TABLES (Simplified rendering for brevity but fully functional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 overflow-y-auto">
                <div className="bg-zinc-900 border border-white/5 rounded-sm">
                    <div className="p-4 border-b border-white/5 flex justify-between"><h2 className="uppercase font-bold text-emerald-500">Entradas</h2><button onClick={() => openModal('income')} className="text-emerald-500"><Plus size={16} /></button></div>
                    <div className="p-4 space-y-2">{income.map(t => <div key={t.id} className="flex justify-between text-sm"><span className="text-zinc-300">{t.name}</span><div className="flex gap-2"><span className="text-emerald-400 font-mono">{formatBRL(t.value)}</span><button onClick={() => deleteEntry('income', t.id)} className="text-zinc-600 hover:text-red-500"><Trash2 size={12} /></button></div></div>)}</div>
                </div>
                <div className="bg-zinc-900 border border-white/5 rounded-sm">
                    <div className="p-4 border-b border-white/5 flex justify-between"><h2 className="uppercase font-bold text-red-500">Saídas</h2><button onClick={() => openModal('expenses')} className="text-red-500"><Plus size={16} /></button></div>
                    <div className="p-4 space-y-2">{expenses.map(t => <div key={t.id} className="flex justify-between text-sm"><span className="text-zinc-300">{t.name}</span><div className="flex gap-2"><span className="text-red-400 font-mono">{formatBRL(t.value)}</span><button onClick={() => deleteEntry('expenses', t.id)} className="text-zinc-600 hover:text-red-500"><Trash2 size={12} /></button></div></div>)}</div>
                </div>
            </div>

            {/* ADD ITEM MODAL (Standard) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-zinc-900 border border-white/10 p-6 rounded-lg w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-white uppercase mb-4">Novo Lançamento</h3>
                            <div className="space-y-4">
                                <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white rounded-sm" placeholder="Descrição" />
                                <input type="number" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} className="w-full bg-zinc-800 border border-zinc-700 p-3 text-white rounded-sm" placeholder="Valor" />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-zinc-400 uppercase text-xs font-bold">Cancelar</button>
                                <button onClick={handleAdd} className="px-6 py-2 bg-berserk-gold text-black font-bold uppercase text-xs rounded hover:bg-yellow-500">Salvar</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FinancialHub;
