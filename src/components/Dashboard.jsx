import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sword, Target, Wallet, TrendingUp, Skull, Play, Pause, Square, Timer, Users, Trophy, Settings, Save, X, Bell, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import XPChart from './XPChart';

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
// Component: Study Timer
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

    // Badge Icon Mapper
    const getBadgeIcon = (badgeId) => {
        switch (badgeId) {
            case 'struggler': return <Sword size={12} className="text-zinc-400" title="The Struggler (10h Study)" />;
            case 'berserker': return <Skull size={12} className="text-red-600" title="Berserker Mode (50h Study)" />;
            case 'soldier': return <Shield size={12} className="text-blue-500" title="Soldier (Lvl 10)" />;
            default: return null;
        }
    };

    useEffect(() => {
        const fetchSquad = async () => {
            try {
                // Fetch user metadata directly or parse it if stored as JSONB
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, level, study_minutes, user_metadata') // Assuming badges inside user_metadata
                    .order('study_minutes', { ascending: false })
                    .limit(5);

                if (data && data.length > 0) {
                    setSquad(data);
                } else {
                    setSquad([
                        { username: 'Griffith', level: 99, study_minutes: 6000, user_metadata: { badges: ['falcon', 'commander'] } },
                        { username: 'Guts', level: 85, study_minutes: 5400, user_metadata: { badges: ['berserker', 'struggler'] } },
                        { username: 'Casca', level: 80, study_minutes: 4800, user_metadata: { badges: ['commander'] } },
                        { username: 'Judeau', level: 65, study_minutes: 3200, user_metadata: { badges: ['struggler'] } },
                        { username: 'Italo', level: user?.level || 1, study_minutes: user?.study_minutes || 0, user_metadata: { badges: user.badges || [] } },
                    ].sort((a, b) => b.study_minutes - a.study_minutes));
                }
            } catch (err) {
                console.error("Error fetching squad:", err);
            }
        };
        fetchSquad();
    }, [user]);

    const handlePing = async (targetUsername) => {
        // Send Realtime Broadcast
        const channel = supabase.channel('room1');
        await channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.send({
                    type: 'broadcast',
                    event: 'ping',
                    payload: { sender: user.username || 'Italo', target: targetUsername },
                });
                alert(`Desafio enviado para ${targetUsername}!`);
                supabase.removeChannel(channel);
            }
        });
    };

    return (
        <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden h-full">
            <h3 className="text-berserk-muted uppercase text-xs font-bold mb-6 flex items-center gap-2">
                <Users size={14} className="text-berserk-red" /> O Bando do Falcão
            </h3>

            <div className="space-y-4">
                {squad.map((member, index) => {
                    const isItalo = member.username === 'Italo';
                    const badges = member.user_metadata?.badges || [];

                    return (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${isItalo ? 'bg-berserk-red/10 border-berserk-red/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-transparent border-white/5 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isItalo ? 'bg-berserk-red text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm flex items-center gap-2 ${isItalo ? 'text-berserk-brightRed' : 'text-zinc-300'}`}>
                                        {member.username}
                                        {/* Badges Display */}
                                        <div className="flex gap-1">
                                            {badges.slice(0, 2).map((b, i) => (
                                                <span key={i}>{getBadgeIcon(b)}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                        Level {member.level}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-bold text-zinc-400">
                                    {(member.study_minutes / 60).toFixed(1)}h
                                </span>
                                {!isItalo && (
                                    <button
                                        onClick={() => handlePing(member.username)}
                                        className="p-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                                        title="Ping friend"
                                    >
                                        <Bell size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

// -----------------------------------------------------------------------------
// MAIN DASHBOARD
// -----------------------------------------------------------------------------
const Dashboard = ({ habits, toggleHabit, level: initialLevel, progress, financials, userProfile, onUpdateProfile }) => {
    const [level, setLevel] = useState(initialLevel);
    const [currentProgress, setCurrentProgress] = useState(progress);
    const [levelUpFlash, setLevelUpFlash] = useState(false);
    const [userStats, setUserStats] = useState({ study_minutes: 0, badges: [] });

    // Settings Modal State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editProfile, setEditProfile] = useState({ jobTitle: '', mainGoal: '' });

    // Sync local state when prop updates
    useEffect(() => {
        if (userProfile) {
            setEditProfile(userProfile);
            setUserStats(prev => ({ ...prev, badges: userProfile.badges || [] }));
        }
    }, [userProfile]);

    useEffect(() => {
        // Sync Initial Level/Stats from Props
        setLevel(initialLevel);
        setCurrentProgress(progress);

        const getStats = async () => {
            const { data } = await supabase.from('profiles').select('*').eq('username', 'Italo').single();
            if (data) {
                setUserStats(prev => ({
                    ...prev,
                    study_minutes: data.study_minutes || 0,
                    // user_metadata might contain badges if fetched from DB directly
                }));
            }
        };
        getStats();
    }, [initialLevel, progress]);

    const handleSessionComplete = async (minutes) => {
        const xpEarned = Math.floor(minutes / 15) * 10;
        const newMinutes = (userStats.study_minutes || 0) + minutes;

        // Optimistic update for local Stats (App.jsx handles the global state/badges via props/callback if we lifted it up properly)
        // Here we just update local display
        setUserStats(prev => ({ ...prev, study_minutes: newMinutes }));

        if (xpEarned > 0) {
            // App.jsx handles the XP toast
        }

        try {
            // Trigger App.jsx update to check for badges
            onUpdateProfile({
                ...userProfile,
                study_minutes: newMinutes,
                badges: userStats.badges
            });
        } catch (err) { console.error(err); }
    };

    const saveSettings = () => {
        onUpdateProfile({ ...userProfile, ...editProfile });
        setIsSettingsOpen(false);
    };

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
            className="w-[90%] md:w-[80%] mx-auto py-8 space-y-8 relative"
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

                    <div className="flex items-center gap-2 group">
                        <p className="text-zinc-400 text-sm tracking-widest uppercase">
                            {userProfile?.jobTitle || 'Struggler'}: <span className="text-white font-bold">Italo</span>
                        </p>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-white text-zinc-600"
                        >
                            <Settings size={14} />
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-4">
                    <div>
                        <div className="flex justify-between w-64 text-xs font-bold uppercase tracking-wider mb-1">
                            <span className="text-zinc-500">Meta Principal</span>
                        </div>
                        <div className="flex items-center gap-2 text-berserk-brightRed font-semibold text-sm">
                            <Target size={16} />
                            <span>{userProfile?.mainGoal || 'Definir Meta'}</span>
                        </div>

                        <div className="flex justify-between w-64 text-xs font-bold uppercase tracking-wider mt-4">
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
                </div>
            </header>

            {/* Top Area: XP Chart (Fluid Graph) - HERO SECTION */}
            <motion.div variants={item} className="w-full h-64 bg-zinc-900/20 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-berserk-red/30 transition-colors">
                <div className="absolute top-4 left-6 z-10">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                        <TrendingUp className="text-berserk-red" /> Progresso da Alma
                    </h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">Evolução Mensal de XP</p>
                </div>
                <XPChart xpHistory={userProfile.xpHistory} />
            </motion.div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column: Study Timer & Status (Span 5) */}
                <div className="lg:col-span-5 space-y-6">
                    <StudyTimer userId="Italo" onSessionComplete={handleSessionComplete} />

                    {/* Compact Financials */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/40 p-4 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center">
                            <Wallet size={24} className="text-emerald-500 mb-2" />
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Entradas</p>
                            <p className="text-lg font-bold text-white">{formatBRL(totalIncome)}</p>
                        </div>
                        <div className="bg-zinc-900/40 p-4 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center">
                            <TrendingUp size={24} className="text-berserk-red mb-2" />
                            <p className="text-[10px] text-zinc-500 uppercase font-bold">Saídas</p>
                            <p className="text-lg font-bold text-white">{formatBRL(totalExpenses)}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Squad Leaderboard (Span 7) */}
                <div className="lg:col-span-7">
                    <SquadLeaderboard user={{ username: 'Italo', ...userStats }} />
                </div>
            </div>

            {/* SETTINGS MODAL */}
            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-900 border border-berserk-border p-6 rounded-lg w-full max-w-md shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                                <Settings size={20} className="text-zinc-400" />
                                Configurações de Perfil
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-1">Título / Cargo</label>
                                    <input
                                        type="text"
                                        value={editProfile.jobTitle}
                                        onChange={(e) => setEditProfile({ ...editProfile, jobTitle: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2 text-white focus:outline-none focus:border-red-500 rounded-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-zinc-500 mb-1">Meta Principal</label>
                                    <input
                                        type="text"
                                        value={editProfile.mainGoal}
                                        onChange={(e) => setEditProfile({ ...editProfile, mainGoal: e.target.value })}
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2 text-white focus:outline-none focus:border-red-500 rounded-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={saveSettings}
                                    className="px-6 py-2 bg-berserk-red text-black uppercase text-xs font-bold hover:bg-red-500 transition-colors flex items-center gap-2 rounded-sm"
                                >
                                    <Save size={14} /> Salvar Alterações
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;
