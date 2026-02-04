import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Sword, Skull } from 'lucide-react';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) alert(error.message);
            else alert('Check your email for the login link!');
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden">

            {/* --- GAMER GLOW BACKGROUND (CSS Only) --- */}

            {/* Blob 1: The Red Pulse */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/30 blur-[120px] animate-pulse-slow pointer-events-none" />

            {/* Blob 2: The Crimson Shadow */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-rose-950/20 blur-[150px] animate-blob pointer-events-none" />

            {/* Floating Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-10 glass-morphism border-2 border-red-900/40 rounded-2xl shadow-[0_0_20px_rgba(153,27,27,0.3)] bg-zinc-950/60 backdrop-blur-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-berserk-red/10 p-4 rounded-full border border-berserk-red/50 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                        <Sword size={32} className="text-berserk-red" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-widest text-white uppercase drop-shadow-lg">
                        Fenix <span className="text-berserk-red">OS</span>
                    </h1>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold mt-2">Awaken Your Ambition</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    <div className="space-y-4">
                        <input
                            className="w-full bg-black/40 border border-zinc-800/80 focus:border-red-800 p-4 text-white text-center font-bold tracking-[0.2em] text-xs rounded-lg outline-none transition-all placeholder:text-zinc-700 uppercase focus:bg-black/60 focus:shadow-[0_0_10px_rgba(153,27,27,0.2)]"
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="w-full bg-black/40 border border-zinc-800/80 focus:border-red-800 p-4 text-white text-center font-bold tracking-[0.2em] text-xs rounded-lg outline-none transition-all placeholder:text-zinc-700 uppercase focus:bg-black/60 focus:shadow-[0_0_10px_rgba(153,27,27,0.2)]"
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="w-full bg-berserk-red text-white font-black uppercase py-4 rounded-lg hover:bg-red-700 transition-all tracking-[0.2em] text-xs animate-glow-pulse"
                        disabled={loading}
                    >
                        {loading ? <Skull className="animate-spin mx-auto text-white" /> : (isSignUp ? 'Cadastrar' : 'Entrar')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[10px] text-zinc-600 hover:text-berserk-red uppercase tracking-widest font-bold transition-colors duration-300"
                    >
                        {isSignUp ? 'Voltar para Login' : 'Criar Nova Conta'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
