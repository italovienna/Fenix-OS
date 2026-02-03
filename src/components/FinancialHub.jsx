import React from 'react';
import { Wallet, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

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

const FinancialHub = ({ financials }) => {
    // Format currency helper
    const formatBRL = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const totalIncome = financials?.income?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const totalExpenses = financials?.expenses?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const balance = totalIncome - totalExpenses;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12"
        >
            <header className="mb-8 border-b border-berserk-border pb-6">
                <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase mb-2">
                    Hub Financeiro
                </h1>
                <p className="text-berserk-muted text-sm">Controle total de recursos.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Income Table */}
                <motion.div variants={itemAnim} className="bg-berserk-card border border-berserk-border rounded-sm overflow-hidden shadow-lg hover:shadow-glow-red transition-shadow">
                    <div className="p-4 bg-emerald-900/20 border-b border-berserk-border flex items-center gap-3">
                        <Wallet className="text-emerald-500" size={20} />
                        <h2 className="uppercase font-bold text-emerald-500 tracking-wider">Entradas (Renda)</h2>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-berserk-muted border-b border-berserk-border/50">
                                    <th className="pb-3 font-medium uppercase">Fonte</th>
                                    <th className="pb-3 font-medium uppercase text-right">Valor</th>
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
                                    </motion.tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-berserk-border pt-4">
                                    <td className="py-4 font-bold text-white uppercase">Total Entradas</td>
                                    <td className="py-4 text-right font-bold text-emerald-500 font-mono text-lg">{formatBRL(totalIncome)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </motion.div>

                {/* Expenses Table */}
                <motion.div variants={itemAnim} className="bg-berserk-card border border-berserk-border rounded-sm overflow-hidden shadow-lg hover:shadow-glow-red transition-shadow">
                    <div className="p-4 bg-red-900/20 border-b border-berserk-border flex items-center gap-3">
                        <TrendingDown className="text-berserk-brightRed" size={20} />
                        <h2 className="uppercase font-bold text-berserk-brightRed tracking-wider">Saídas (Despesas)</h2>
                    </div>
                    <div className="p-6">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-berserk-muted border-b border-berserk-border/50">
                                    <th className="pb-3 font-medium uppercase">Despesa</th>
                                    <th className="pb-3 font-medium uppercase text-right">Valor</th>
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
                                    </motion.tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-berserk-border pt-4">
                                    <td className="py-4 font-bold text-white uppercase">Total Saídas</td>
                                    <td className="py-4 text-right font-bold text-berserk-brightRed font-mono text-lg">{formatBRL(totalExpenses)}</td>
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
        </motion.div>
    );
};

export default FinancialHub;
