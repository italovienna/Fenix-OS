import React, { useState } from 'react';
import { Wallet, TrendingDown, Trash2, Plus, X, Check, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

const FinancialHub = ({ financials, onUpdateFinancials }) => {
    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('income'); // 'income' or 'expenses'
    const [newItem, setNewItem] = useState({ name: '', value: '' });

    // Format currency helper
    const formatBRL = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Totals
    const totalIncome = financials?.income?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const totalExpenses = financials?.expenses?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const balance = totalIncome - totalExpenses;

    const handleDelete = (type, id) => {
        const updatedList = financials[type].filter(item => item.id !== id);
        onUpdateFinancials({
            ...financials,
            [type]: updatedList
        });
    };

    const handleAdd = () => {
        if (!newItem.name || !newItem.value) return;

        const type = modalType;
        const newEntry = {
            id: Date.now(),
            name: newItem.name,
            value: parseFloat(newItem.value)
        };

        onUpdateFinancials({
            ...financials,
            [type]: [...(financials[type] || []), newEntry]
        });

        setNewItem({ name: '', value: '' });
        setIsModalOpen(false);
    };

    const openModal = (type) => {
        setModalType(type);
        setNewItem({ name: '', value: '' });
        setIsModalOpen(true);
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12 relative"
        >
            <header className="mb-8 border-b border-berserk-border pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase mb-2">
                        Hub Financeiro
                    </h1>
                    <p className="text-berserk-muted text-sm">Controle total de recursos.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Income Table */}
                <motion.div variants={itemAnim} className="bg-berserk-card border border-berserk-border rounded-sm overflow-hidden shadow-lg hover:shadow-glow-red transition-shadow">
                    <div className="p-4 bg-emerald-900/20 border-b border-berserk-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Wallet className="text-emerald-500" size={20} />
                            <h2 className="uppercase font-bold text-emerald-500 tracking-wider">Entradas</h2>
                        </div>
                        <button
                            onClick={() => openModal('income')}
                            className="p-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-berserk-muted border-b border-berserk-border/50">
                                    <th className="pb-3 font-medium uppercase">Fonte</th>
                                    <th className="pb-3 font-medium uppercase text-right">Valor</th>
                                    <th className="pb-3 w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-berserk-border/50">
                                {financials?.income?.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                        className="group transition-colors"
                                    >
                                        <td className="py-4 text-berserk-text">{item.name}</td>
                                        <td className="py-4 text-right text-emerald-400 font-mono">{formatBRL(item.value)}</td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => handleDelete('income', item.id)}
                                                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-berserk-border pt-4">
                                    <td className="py-4 font-bold text-white uppercase">Total Entradas</td>
                                    <td className="py-4 text-right font-bold text-emerald-500 font-mono text-lg">{formatBRL(totalIncome)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </motion.div>

                {/* Expenses Table */}
                <motion.div variants={itemAnim} className="bg-berserk-card border border-berserk-border rounded-sm overflow-hidden shadow-lg hover:shadow-glow-red transition-shadow">
                    <div className="p-4 bg-red-900/20 border-b border-berserk-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="text-berserk-brightRed" size={20} />
                            <h2 className="uppercase font-bold text-berserk-brightRed tracking-wider">Saídas</h2>
                        </div>
                        <button
                            onClick={() => openModal('expenses')}
                            className="p-1 rounded bg-berserk-red/10 text-berserk-red hover:bg-berserk-red/20 transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-berserk-muted border-b border-berserk-border/50">
                                    <th className="pb-3 font-medium uppercase">Despesa</th>
                                    <th className="pb-3 font-medium uppercase text-right">Valor</th>
                                    <th className="pb-3 w-8"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-berserk-border/50">
                                {financials?.expenses?.map((item) => (
                                    <motion.tr
                                        key={item.id}
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                        className="group transition-colors"
                                    >
                                        <td className="py-4 text-berserk-text">{item.name}</td>
                                        <td className="py-4 text-right text-berserk-brightRed font-mono">{formatBRL(item.value)}</td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => handleDelete('expenses', item.id)}
                                                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-berserk-border pt-4">
                                    <td className="py-4 font-bold text-white uppercase">Total Saídas</td>
                                    <td className="py-4 text-right font-bold text-berserk-brightRed font-mono text-lg">{formatBRL(totalExpenses)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </motion.div>
            </div>

            <motion.div
                variants={itemAnim}
                className="mt-8 bg-berserk-card border border-berserk-border p-6 rounded-sm flex items-center justify-between hover:shadow-glow-red transition-shadow"
            >
                <div>
                    <h3 className="uppercase text-xs font-bold text-berserk-muted mb-1">Saldo Previsto</h3>
                    <p className="text-sm text-berserk-text">O que sobra para investir no sonho.</p>
                </div>
                <div className="text-3xl font-bold text-white font-mono">
                    {formatBRL(balance)}
                </div>
            </motion.div>

            {/* ADD ITEM MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-900 border border-berserk-border p-6 rounded-lg w-full max-w-md shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white uppercase mb-4 flex items-center gap-2">
                                <Plus size={20} className={modalType === 'income' ? 'text-emerald-500' : 'text-berserk-red'} />
                                Adicionar {modalType === 'income' ? 'Entrada' : 'Saída'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-1">Nome / Descrição</label>
                                    <input
                                        type="text"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2 text-white focus:outline-none focus:border-berserk-red"
                                        placeholder="Ex: Freelance"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-1">Valor (R$)</label>
                                    <input
                                        type="number"
                                        value={newItem.value}
                                        onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2 text-white focus:outline-none focus:border-berserk-red"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-zinc-400 hover:text-white uppercase text-xs font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAdd}
                                    className={`px-4 py-2 text-zinc-900 uppercase text-xs font-bold flex items-center gap-2
                                        ${modalType === 'income' ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-berserk-red hover:bg-red-500'}`}
                                >
                                    <Save size={14} /> Salvar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FinancialHub;
