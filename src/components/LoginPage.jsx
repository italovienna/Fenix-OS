import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const { signIn, signUp } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shake, setShake] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'register') {
                if (!username.trim()) {
                    throw new Error('Username is required');
                }
                await signUp(email, password, username);
                setError(''); // Clear any errors
                // Show success message
                alert('Account created! Check your email to verify.');
            } else {
                await signIn(email, password);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
        setUsername('');
    };

    return (
        <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
            {/* Void Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 via-transparent to-red-950/5 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Login/Register Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    x: shake ? [-10, 10, -10, 10, 0] : 0
                }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-10 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-wider">
                                Enter the <span className="text-red-600">Nexus</span>
                            </h1>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">
                                {mode === 'register' ? 'Create Your Legacy' : 'Fenix OS Authentication'}
                            </p>
                        </motion.div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-3 bg-red-950/20 border border-red-900/50 rounded-lg flex items-center gap-2"
                            >
                                <AlertCircle size={16} className="text-red-500" />
                                <p className="text-xs text-red-400">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username (Register Only) */}
                        <AnimatePresence>
                            {mode === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Username (e.g., Guts)"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600/50 p-3 text-white text-sm rounded-lg outline-none transition-all placeholder:text-zinc-600"
                                        required={mode === 'register'}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600/50 p-3 text-white text-sm rounded-lg outline-none transition-all placeholder:text-zinc-600"
                            required
                        />

                        {/* Password */}
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600/50 p-3 text-white text-sm rounded-lg outline-none transition-all placeholder:text-zinc-600"
                            required
                        />

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-2">
                            {mode === 'login' ? (
                                <>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
                                    >
                                        {loading ? <Skull size={18} className="mx-auto animate-spin" /> : 'Login'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="flex-1 bg-transparent border border-zinc-700 hover:border-red-600 text-zinc-400 hover:text-white font-bold py-3 rounded-lg transition-all uppercase text-sm tracking-wider"
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="flex-1 bg-transparent border border-zinc-700 hover:border-red-600 text-zinc-400 hover:text-white font-bold py-3 rounded-lg transition-all uppercase text-sm tracking-wider"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
                                    >
                                        {loading ? <Skull size={18} className="mx-auto animate-spin" /> : 'Create Account'}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                            Fenix OS &bull; Nexus Protocol v2.0
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
