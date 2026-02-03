import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Sword } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let error;
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password
                });
                error = signUpError;
                if (!error) setMessage('Verifique seu e-mail para o link de confirmação!');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                error = signInError;
            }

            if (error) throw error;
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-berserk-dark p-4 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-[url('/src/assets/bg-guts.png')] bg-cover bg-center opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md bg-berserk-card border border-berserk-border p-8 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden z-10"
            >
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-berserk-red to-transparent"></div>

                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 mb-4 border border-berserk-red rounded-full bg-berserk-start"
                    >
                        <Sword className="text-berserk-red w-8 h-8" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-[0.2em] text-[#d4d4d4] uppercase">
                        Fenix <span className="text-[#dc2626]">OS</span>
                    </h1>
                    <p className="text-berserk-muted text-xs mt-2 uppercase tracking-widest">Protocolo de Ascensão</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase font-bold text-berserk-muted mb-2">E-mail do Struggler</label>
                        <input
                            className="w-full bg-berserk-start border border-berserk-border p-3 text-berserk-text focus:border-berserk-red focus:outline-none transition-colors"
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase font-bold text-berserk-muted mb-2">Senha</label>
                        <input
                            className="w-full bg-berserk-start border border-berserk-border p-3 text-berserk-text focus:border-berserk-red focus:outline-none transition-colors"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-berserk-brightRed text-xs uppercase font-bold text-center border border-berserk-red/50 bg-berserk-red/10 p-2"
                        >
                            {message}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(220, 38, 38, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 px-4 bg-berserk-red hover:bg-berserk-brightRed text-white font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.3)] flex justify-center
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Processando...' : (isSignUp ? 'Iniciar Jornada (Cadastro)' : 'Acessar Sistema')}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
                        className="text-xs text-berserk-muted hover:text-white uppercase tracking-wider underline underline-offset-4"
                    >
                        {isSignUp ? 'Já possui conta? Entrar' : 'Novo por aqui? Criar Conta'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
