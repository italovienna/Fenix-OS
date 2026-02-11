import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

// ═══════════════════════════════════════════════════════
//  NLP PARSER (The "Brain")
// ═══════════════════════════════════════════════════════
const parseQuickEntry = (text) => {
    if (!text || !text.trim()) return null;
    const lowerText = text.toLowerCase().trim();

    // Keywords
    const EXPENSE_WORDS = ['gastei', 'gastou', 'gasto', 'comprei', 'comprou', 'compra', 'pagou', 'paguei', 'perdi', 'saida', 'saída'];
    const INCOME_WORDS = ['recebi', 'recebeu', 'ganhei', 'ganhou', 'venda', 'vendeu', 'lucro', 'entrada', 'deposito'];

    // 1. Determine Type
    let type = null;
    if (EXPENSE_WORDS.some(w => lowerText.includes(w))) type = 'expense';
    else if (INCOME_WORDS.some(w => lowerText.includes(w))) type = 'income';

    // 2. Extract Value (Look for numbers like 50, 50.00, 1.200,50)
    const VALUE_PATTERN = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?|\d+)/;
    const valueMatch = text.match(VALUE_PATTERN);

    if (!valueMatch) return null; // No value found

    let rawValue = valueMatch[1];
    let value = 0;

    // Handle formats: 1.000,00 vs 1,000.00 vs 1000
    if (rawValue.includes(',')) {
        // Assume comma is decimal (PT-BR)
        value = parseFloat(rawValue.replace(/\./g, '').replace(',', '.'));
    } else {
        value = parseFloat(rawValue);
    }

    if (isNaN(value) || value <= 0) return null;

    // 3. Extract Description (Remove value and keywords)
    let description = text.replace(VALUE_PATTERN, '').trim();
    [...EXPENSE_WORDS, ...INCOME_WORDS].forEach(w => {
        description = description.replace(new RegExp(`\\b${w}\\b`, 'gi'), '');
    });

    // Remove common prepositions
    description = description.replace(/\b(em|no|na|de|do|da|com|por|r\$|reais)\b/gi, '').trim();
    description = description.replace(/\s+/g, ' '); // collapse spaces

    // Capitalize
    if (description.length > 0) {
        description = description.charAt(0).toUpperCase() + description.slice(1);
    } else {
        description = type === 'income' ? 'Entrada Rápida' : 'Despesa Rápida';
    }

    // Default to expense if type undefined but we have value? No, return needsClassification
    return { type, value, description, needsClassification: !type };
};


export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. FETCH
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setTransactions([]);
                return;
            }

            const { data, error } = await supabase
                .from('financial_records')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formatted = (data || []).map(t => ({
                ...t,
                amount: parseFloat(t.amount)
            }));
            setTransactions(formatted);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // 2. ADD (Secure)
    const addTransaction = useCallback(async ({ description, amount, type, category }) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Usuário não logado.");

            // Normalize type
            const dbType = (type === 'expenses') ? 'expense' : type;

            const newTx = {
                user_id: user.id,
                description: description || 'Sem descrição',
                amount: parseFloat(amount),
                type: dbType,
                category: category || 'Geral',
                created_at: new Date().toISOString()
            };

            // Optimistic
            const tempId = Date.now().toString();
            setTransactions(prev => [{ ...newTx, id: tempId }, ...prev]);

            const { data, error } = await supabase.from('financial_records').insert([newTx]).select().single();

            if (error) throw error;

            // Update with real ID
            setTransactions(prev => prev.map(t => t.id === tempId ? { ...data, amount: parseFloat(data.amount) } : t));
            return data;

        } catch (error) {
            console.error("Add Transaction Error:", error);
            fetchTransactions(); // Revert/Sync
            throw error;
        }
    }, [fetchTransactions]);

    // 3. HELPERS
    const addIncome = (desc, val) => addTransaction({ description: desc, amount: val, type: 'income', category: 'Receita' });
    const addExpense = (desc, val) => addTransaction({ description: desc, amount: val, type: 'expense', category: 'Despesa' });

    const deleteEntry = async (type, id) => {
        const backup = [...transactions];
        setTransactions(prev => prev.filter(t => t.id !== id));
        const { error } = await supabase.from('financial_records').delete().eq('id', id);
        if (error) {
            console.error("Delete Error:", error);
            setTransactions(backup);
        }
    };

    // 4. QUICK ENTRY PROCESSOR
    const processQuickEntry = async (text) => {
        const result = parseQuickEntry(text);
        if (!result) return { success: false, error: "Não entendi. Tente: 'Gastei 50 lanche'" };

        if (result.needsClassification) {
            return {
                success: false,
                needsClassification: true,
                value: result.value,
                description: result.description
            };
        }

        try {
            await addTransaction({
                description: result.description,
                amount: result.value,
                type: result.type,
                category: 'Rápido'
            });
            return { success: true, message: "Salvo com sucesso!" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // 5. METRICS
    const { income, expenses, balance, totalIncome, totalExpenses } = useMemo(() => {
        const list = Array.isArray(transactions) ? transactions : [];
        const inc = list.filter(t => t.type === 'income');
        const exp = list.filter(t => ['expense', 'expenses', 'saida'].includes(t.type));

        const totInc = inc.reduce((acc, t) => acc + t.amount, 0);
        const totExp = exp.reduce((acc, t) => acc + t.amount, 0);

        // Map for UI
        const mapUI = (l) => l.map(t => ({ ...t, name: t.description, value: t.amount }));

        return {
            income: mapUI(inc),
            expenses: mapUI(exp),
            balance: totInc - totExp,
            totalIncome: totInc,
            totalExpenses: totExp
        };
    }, [transactions]);

    return (
        <FinanceContext.Provider value={{
            transactions,
            history: transactions.map(t => ({ ...t, name: t.description, value: t.amount })), // Legacy
            income, expenses, balance, totalIncome, totalExpenses,
            loading,
            addTransaction, addIncome, addExpense, deleteEntry, processQuickEntry
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
