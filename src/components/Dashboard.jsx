import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Skull, Users, Trophy, Wallet, Target, Sword } from 'lucide-react';
import { motion } from 'framer-motion';
import XPChart from './XPChart';
import { useXp } from '../contexts/XpContext';
import { useFinance } from '../contexts/FinanceContext';
import { useStudy } from '../contexts/StudyContext';

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

const SquadLeaderboard = ({ user }) => {
    const eliteSquad = [
        { username: 'Italo', study_minutes: 15000, level: 99, badges: ['falcon', 'commander'] },
        { username: 'Bernardo', study_minutes: 12000, level: 85, badges: ['berserker'] },
        { username: 'Acácio', study_minutes: 10800, level: 80, badges: ['struggler'] },
    ];

    const getBadgeIcon = (badgeId) => {
        switch (badgeId) {
            case 'struggler': return <Sword size={12} className="text-zinc-400" title="The Struggler" />;
            case 'berserker': return <Skull size={12} className="text-red-600" title="Berserker" />;
            case 'falcon': return <Trophy size={12} className="text-berserk-gold" title="Falcon" />;
            default: return null;
        }
    };

    return (
        <motion.div variants={item} className="bg-zinc-900/40 backdrop-blur-xl border-l border-white/5 p-6 h-full relative overflow-y-auto">
            <h3 className="text-berserk-goldDim uppercase text-xs font-bold mb-6 flex items-center gap-2 tracking-widest">
                <Users size={14} className="text-berserk-red" /> O Bando do Falcão
            </h3>

            <div className="space-y-4">
                {eliteSquad.map((member, index) => {
                    const isItalo = member.username === 'Italo';
                    return (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${isItalo ? 'bg-berserk-gold/10 border-berserk-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'bg-transparent border-white/5'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isItalo ? 'bg-berserk-gold text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className={`font-bold text-sm flex items-center gap-2 ${isItalo ? 'text-white' : 'text-zinc-300'}`}>
                                        {member.username}
                                        <div className="flex gap-1">
                                            {member.badges.map((b, i) => (
                                                <span key={i}>{getBadgeIcon(b)}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                        Level {member.level}
                                    </div>
                                </div>
                            </div>
                            <span className="font-mono text-sm font-bold text-berserk-red">
                                {(member.study_minutes / 60).toFixed(0)}h
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Apenas os fortes sobrevivem.</p>
            </div>
        </motion.div>
    );
};

const Dashboard = ({ userProfile, onUpdateProfile }) => {
    const { currentXp, totalXpEarned, rank, progressPercent, xpHistory } = useXp();
    const { totalIncome, totalExpenses } = useFinance();
    const { sessions } = useStudy();

    const [time, setTime] = useState(new Date());

    // --- METRICS CALCULATIONS ---
    const studyMetrics = useMemo(() => {
        if (!sessions || sessions.length === 0) return { avgHours: 0, totalHours: 0 };

        const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
        const uniqueDays = new Set(sessions.map(s => s.timestamp.split('T')[0])).size || 1;
        const avgHours = (totalSeconds / uniqueDays / 3600).toFixed(1);

        return { avgHours, totalHours: (totalSeconds / 3600).toFixed(1) };
    }, [sessions]);

    const consistencyRate = useMemo(() => {
        if (!xpHistory || xpHistory.length === 0) return 0;
        // Count active days in the last 30 days (assuming xpHistory tracks daily)
        const activeDays = xpHistory.filter(day => day.xp > 0).length;
        // Simple 30-day rolling window consistency
        return Math.min(100, Math.round((activeDays / 30) * 100));
    }, [xpHistory]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatFullDate = (date) => {
        const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date);
        const day = date.getDate();
        const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(date);
        const year = date.getFullYear();
        return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} de ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateProfile({ ...userProfile, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGoalChange = (newGoal) => {
        onUpdateProfile({ ...userProfile, mainGoal: newGoal });
    };

    const formatBRL = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12 space-y-8 h-full flex flex-col relative overflow-hidden"
        >
            {/* Dark Crimson Gradient Background */}
            <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-black to-black pointer-events-none -z-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-berserk-red/5 blur-[100px] pointer-events-none -z-10"></div>

                <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                        <div className="w-24 h-24 rounded-full border-2 border-berserk-border group-hover:border-berserk-gold/50 transition-colors overflow-hidden relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-zinc-500">
                                    <Skull size={40} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] uppercase text-white font-bold tracking-widest transition-opacity pointer-events-none">
                                Upload
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-lg">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-[0.3em] text-shadow-crimson flex items-center gap-2 ${rank.color}`}>
                                <span className={`w-2 h-2 rounded-full ${rank.color === 'text-berserk-red' ? 'bg-berserk-red animate-pulse' : 'bg-current'}`}></span>
                                {rank.title} Rank
                            </span>
                        </motion.div>

                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white uppercase tracking-wider leading-tight drop-shadow-md">
                            BEM-VINDO, {userProfile.jobTitle || 'Struggler'}
                        </h1>

                        <div className="mt-4">
                            <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider">
                                <span>XP ATUAL: {currentXp}</span>
                                <span>PROX: {rank.nextXp}</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-berserk-red to-berserk-gold relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center gap-3">
                            <Target size={14} className="text-berserk-gold" />
                            <input
                                type="text"
                                value={userProfile.mainGoal || ''}
                                onChange={(e) => handleGoalChange(e.target.value)}
                                placeholder="Defina seu Objetivo Principal..."
                                className="bg-transparent border-none text-zinc-400 focus:text-white focus:ring-0 p-0 text-sm italic font-serif w-full placeholder-zinc-700 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end">
                    <p className="text-sm font-bold uppercase tracking-widest text-berserk-red/80 mb-1 font-serif">
                        {formatFullDate(time)}
                    </p>
                    <div className="bg-black/40 backdrop-blur-md border border-white/5 px-4 py-2 rounded-lg">
                        <p className="text-4xl font-serif font-bold text-white tabular-nums tracking-widest text-shadow-crimson">
                            {time.toLocaleTimeString('pt-BR')}
                        </p>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
                <div className="lg:col-span-2 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                    <motion.div variants={item} className="w-full h-80 glass-card rounded-2xl relative overflow-hidden group p-6 border-berserk-red/20 hover:border-berserk-red/40 transition-colors duration-500">
                        <div className="absolute top-6 left-6 z-10">
                            <h3 className="text-3xl font-serif text-white uppercase tracking-wider flex items-center gap-3 drop-shadow-md">
                                <TrendingUp className="text-berserk-gold" size={28} /> Evolução da Alma
                            </h3>
                            <p className="text-xs text-berserk-muted uppercase tracking-[0.2em] font-bold mt-1">Trajetória de Sofrimento & Glória</p>
                        </div>
                        <div className="mt-8 h-full w-full">
                            <XPChart xpHistory={xpHistory} />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* FINANCE CARDS */}
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-between hover:border-emerald-500/30 transition-colors cursor-pointer group relative overflow-hidden">
                            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Ofertas</p>
                                <p className="text-xl font-sans font-bold text-emerald-500 drop-shadow-sm">{formatBRL(totalIncome)}</p>
                            </div>
                            <Wallet size={20} className="text-emerald-500 opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-between hover:border-berserk-red/50 transition-colors cursor-pointer group relative overflow-hidden">
                            <div className="absolute inset-0 bg-berserk-red/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Sacrifícios</p>
                                <p className="text-xl font-sans font-bold text-berserk-red drop-shadow-sm">{formatBRL(totalExpenses)}</p>
                            </div>
                            <TrendingUp size={20} className="text-berserk-red opacity-50 group-hover:scale-110 transition-transform" />
                        </div>

                        {/* NEW METRICS CARDS */}
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-between hover:border-blue-500/30 transition-colors cursor-pointer group relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Foco Médio</p>
                                <p className="text-xl font-sans font-bold text-blue-400 drop-shadow-sm">{studyMetrics.avgHours}h / dia</p>
                            </div>
                            <Target size={20} className="text-blue-500 opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex items-center justify-between hover:border-berserk-gold/50 transition-colors cursor-pointer group relative overflow-hidden">
                            <div className="absolute inset-0 bg-berserk-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Consistência</p>
                                <p className="text-xl font-sans font-bold text-berserk-gold drop-shadow-sm">{consistencyRate}%</p>
                            </div>
                            <Trophy size={20} className="text-berserk-gold opacity-50 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block h-full min-h-[400px]">
                    <SquadLeaderboard user={userProfile} />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
