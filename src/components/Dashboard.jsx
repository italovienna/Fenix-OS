import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sword, Target, Wallet, TrendingUp, Skull, Play, Pause, Square, Timer, Users, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

// Animations
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

// -----------------------------------------------------------------------------
// Component: Study Timer (Pomodoro Style)
// -----------------------------------------------------------------------------
const StudyTimer = ({ userId, onSessionComplete }) => {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0); // Total seconds elapsed
    const intervalRef = useRef(null);

    const toggleTimer = () => {
        if (isActive) {
            clearInterval(intervalRef.current);
            setIsActive(false);
        } else {
            setIsActive(true);
            intervalRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
    };

    const stopTimer = async () => {
        clearInterval(intervalRef.current);
        setIsActive(false);

        if (seconds > 60) { // Only save if > 1 min
            const minutes = Math.floor(seconds / 60);
            await onSessionComplete(minutes);
        }
        setSeconds(0);
    };

    // Format time as HH:MM:SS
    const formatTime = (totalSeconds) => {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = (totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:shadow-glow-red transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Timer size={80} />
            </div>
            <h3 className="text-berserk-muted uppercase text-xs font-bold mb-4 flex items-center gap-2">
                <Sword size={14} className="text-berserk-red" /> Sessão de Estudo
            </h3>

            <div className="flex flex-col items-center justify-center space-y-6">
                <div className="text-5xl md:text-6xl font-mono font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    {formatTime(seconds)}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`p-4 rounded-full border transition-all duration-300 ${isActive
                            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500 hover:bg-yellow-500/20'
                            : 'bg-emerald-500/10 border-emerald-500 text-emerald-500 hover:bg-emerald-500/20'
                            }`}
                    >
                        {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>

                    <button
                        onClick={stopTimer}
                        className="p-4 rounded-full border border-berserk-red text-berserk-red bg-berserk-red/10 hover:bg-berserk-red/20 transition-all duration-300"
                    >
                        <Square size={24} fill="currentColor" />
                    </button>
                </div>
                <div className="text-xs text-berserk-muted uppercase tracking-widest">
                    {isActive ? 'Foco Absoluto' : 'Pronto para a Batalha?'}
                </div>
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// Component: Squad Leaderboard
// -----------------------------------------------------------------------------
const SquadLeaderboard = ({ user }) => {
    const [squad, setSquad] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSquad = async () => {
            try {
                // Mocking data if table doesn't exist or is empty for demo purposes
                // Ideally: const { data } = await supabase.from('profiles').select('*').order('study_minutes', { ascending: false }).limit(5);

                // Real fetch attempt
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, level, study_minutes')
                    .order('study_minutes', { ascending: false })
                    .limit(5);

                if (error) throw error;
                if (data && data.length > 0) {
                    setSquad(data);
                } else {
                    // Fallback Mock
                    setSquad([
                        { username: 'Griffith', level: 99, study_minutes: 6000 },
                        { username: 'Guts', level: 85, study_minutes: 5400 },
                        { username: 'Casca', level: 80, study_minutes: 4800 },
                        { username: 'Judeau', level: 65, study_minutes: 3200 },
                        { username: 'Italo', level: user?.level || 1, study_minutes: user?.study_minutes || 0 }, // Using prop for current user if applicable
                    ].sort((a, b) => b.study_minutes - a.study_minutes));
                }
            } catch (err) {
                console.error("Error fetching squad:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSquad();
    }, [user]); // Refresh if user stats change

    return (
        <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden h-full">
            <h3 className="text-berserk-muted uppercase text-xs font-bold mb-6 flex items-center gap-2">
                <Users size={14} className="text-berserk-red" /> O Bando do Falcão
            </h3>

            <div className="space-y-4">
                {squad.map((member, index) => {
                    const isItalo = member.username === 'Italo';
                    return (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${isItalo ? 'bg-berserk-red/10 border-berserk-red/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isItalo ? 'bg-berserk-red text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm ${isItalo ? 'text-berserk-brightRed' : 'text-zinc-300'}`}>
                                        {member.username}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                        Level {member.level}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-mono text-sm font-bold text-zinc-400">
                                    {(member.study_minutes / 60).toFixed(1)}h
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// Main Dashboard
// -----------------------------------------------------------------------------
const Dashboard = ({ habits, toggleHabit, level: initialLevel, progress, financials }) => {
    const [level, setLevel] = useState(initialLevel);
    const [currentProgress, setCurrentProgress] = useState(progress);
    const [levelUpFlash, setLevelUpFlash] = useState(false);
    const [userStats, setUserStats] = useState({ study_minutes: 0 }); // Local state for immediate updates

    // Initial fetch for user stats
    useEffect(() => {
        const getStats = async () => {
            const { data } = await supabase.from('profiles').select('*').eq('username', 'Italo').single();
            if (data) {
                setUserStats(data);
                setLevel(data.level);
                // Assuming XP is managed, but for now using props or stored value
            }
        };
        getStats();
    }, []);

    // Handle Session Complete
    const handleSessionComplete = async (minutes) => {
        // Calculate XP: 10 XP per 15 mins
        const xpEarned = Math.floor(minutes / 15) * 10;

        // Optimistic Update
        const newMinutes = (userStats.study_minutes || 0) + minutes;
        setUserStats(prev => ({ ...prev, study_minutes: newMinutes }));

        // Flash Level UP animation if needed (Mock logic for now)
        if (xpEarned > 0) {
            alert(`Sessão Finalizada! +${minutes} min | +${xpEarned} XP`);
            // Here we would actually update 'progress' and 'level' based on thresholds
        }

        try {
            // Update Supabase
            // 1. Get current data to ensure sync (skipped for optimistic UI)
            // 2. RPC call is better, but simple update:
            const { error } = await supabase
                .from('profiles')
                .update({
                    study_minutes: newMinutes,
                    // xp: currentXp + xpEarned 
                })
                .eq('username', 'Italo');

            if (error) console.error("Error saving session:", error);

        } catch (err) {
            console.error(err);
        }
    };

    // Trigger flash when level changes
    useEffect(() => {
        setLevelUpFlash(true);
        const timer = setTimeout(() => setLevelUpFlash(false), 1000);
        return () => clearTimeout(timer);
    }, [level]);

    // Format currency
    const formatBRL = (value) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // Totals
    const totalIncome = financials?.income?.reduce((acc, curr) => acc + curr.value, 0) || 0;
    const totalExpenses = financials?.expenses?.reduce((acc, curr) => acc + curr.value, 0) || 0;

    const data = [
        { name: 'Jan', balance: 100 },
        { name: 'Feb', balance: 180 },
        { name: 'Mar', balance: 150 },
        { name: 'Apr', balance: 240 },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-8 max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-2"
                    >
                        <Sword className="w-8 h-8 text-berserk-red animate-pulse" />
                        <h1 className="text-4xl font-bold tracking-tighter text-white uppercase drop-shadow-lg">
                            Fenix <span className="text-berserk-red">OS</span>
                        </h1>
                    </motion.div>
                    <p className="text-zinc-400 text-sm tracking-widest uppercase">
                        Bem-vindo ao Abismo, <span className="text-white font-bold">Italo</span>
                    </p>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-2">
                    <div className="flex justify-between w-64 text-xs font-bold uppercase tracking-wider">
                        <span className={levelUpFlash ? 'text-berserk-red animate-pulse' : 'text-zinc-500'}>
                            Level {level}
                        </span>
                        <span className="text-zinc-500">{currentProgress}/100 XP</span>
                    </div>
                    <div className="w-64 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            className="h-full bg-berserk-red shadow-[0_0_10px_#dc2626]"
                            initial={{ width: 0 }}
                            animate={{ width: `${currentProgress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                        />
                    </div>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Study Timer & Habits (Span 4) */}
                <div className="lg:col-span-4 space-y-6">
                    <StudyTimer userId="Italo" onSessionComplete={handleSessionComplete} />

                    <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl h-[400px] overflow-y-auto custom-scrollbar">
                        <h3 className="text-berserk-muted uppercase text-xs font-bold mb-6 flex items-center gap-2">
                            <Skull size={14} /> Rituais Diários
                        </h3>
                        <div className="space-y-3">
                            {habits.map(habit => (
                                <motion.div
                                    key={habit.id}
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => toggleHabit(habit.id)}
                                    className={`p-4 rounded-lg border cursor-pointer flex items-center gap-4 transition-all duration-300
                                        ${habit.completed
                                            ? 'bg-berserk-red/5 border-berserk-red/30'
                                            : 'bg-transparent border-white/5 hover:border-zinc-700'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-colors ${habit.completed ? 'bg-berserk-red border-berserk-red' : 'border-zinc-600'}`}>
                                        {habit.completed && <Sword size={12} className="text-black" />}
                                    </div>
                                    <span className={`text-sm font-medium uppercase tracking-wide ${habit.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                                        {habit.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Middle Column: Financials (Span 5) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <Wallet size={48} />
                            </div>
                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Receitas</p>
                            <p className="text-2xl font-bold text-emerald-400">{formatBRL(totalIncome)}</p>
                        </motion.div>
                        <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-5">
                                <TrendingUp size={48} />
                            </div>
                            <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Despesas</p>
                            <p className="text-2xl font-bold text-berserk-red">{formatBRL(totalExpenses)}</p>
                        </motion.div>
                    </div>

                    <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl h-[300px] flex flex-col">
                        <h3 className="text-berserk-muted uppercase text-xs font-bold mb-4 flex items-center gap-2">
                            <Target size={14} /> Fluxo de Caixa
                        </h3>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#525252" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#dc2626' }}
                                    />
                                    <Area type="monotone" dataKey="balance" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Squad Leaderboard (Span 3) */}
                <div className="lg:col-span-3">
                    <SquadLeaderboard user={{ username: 'Italo', ...userStats }} />
                </div>

            </div>
        </motion.div>
    );
};

export default Dashboard;
