import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sword } from 'lucide-react';

const LoginPage = () => {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignUp) {
                await signUp(email, password);
                alert("Verifique seu email para confirmar o cadastro!");
            } else {
                await signIn(email, password);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white selection:bg-red-900 selection:text-white overflow-hidden relative">

            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md p-10 border border-red-900/50 shadow-[0_0_30px_rgba(220,38,38,0.2)] bg-neutral-950/90 backdrop-blur-md rounded-xl relative z-10"
            >
                <div className="text-center mb-10 flex flex-col items-center">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="mb-4"
                    >
                        <Sword size={48} className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                    </motion.div>

                    <h1 className="text-4xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-800 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] mb-2 uppercase">
                        Enter The Nexus
                    </h1>
                    <p className="text-zinc-500 text-xs tracking-widest uppercase">
                        O Grimório do Sofrimento e da Glória
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-950/30 border border-red-500/50 text-red-200 text-sm rounded shadow-[0_0_10px_rgba(220,38,38,0.1)] text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[#0a0a0a] border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none p-4 text-sm text-zinc-100 transition-all duration-300 placeholder:text-zinc-700 rounded-lg shadow-inner"
                            placeholder="sacrificio@destino.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[#0a0a0a] border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none p-4 text-sm text-zinc-100 transition-all duration-300 placeholder:text-zinc-700 rounded-lg shadow-inner"
                            placeholder="••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-gradient-to-br from-red-700 to-rose-900 hover:from-red-600 hover:to-rose-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 uppercase tracking-[0.15em] text-sm shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-[1.02] active:scale-[0.98] border border-red-500/20"
                    >
                        {loading ? (
                            <span className="animate-pulse">Sincronizando...</span>
                        ) : (
                            isSignUp ? "Forjar Destino" : "Iniciar Imersão"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-zinc-600 text-[10px] hover:text-red-500 transition-colors uppercase tracking-widest hover:underline underline-offset-4"
                    >
                        {isSignUp ? "Já possui marca? Login" : "Sem marca? Cadastre-se"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
