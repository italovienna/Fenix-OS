import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Skull, Users, Trophy, Wallet, Target, Sword } from 'lucide-react';
import { motion } from 'framer-motion';
import XPChart from './XPChart';
import { useXp } from '../contexts/XpContext';
import { useFinance } from '../contexts/FinanceContext';
import { useStudy } from '../contexts/StudyContext';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const SquadLeaderboard = ({ user }) => {
    // Hidden on mobile, so simplified structure is fine
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
                                        <div className="flex gap-1">{member.badges.map((b, i) => <span key={i}>{getBadgeIcon(b)}</span>)}</div>
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Level {member.level}</div>
                                </div>
                            </div>
                            <span className="font-mono text-sm font-bold text-berserk-red">{(member.study_minutes / 60).toFixed(0)}h</span>
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
    const { currentXp, rank, progressPercent, xpHistory } = useXp();
    const { totalIncome, totalExpenses } = useFinance();
    const { sessions } = useStudy();
    const [time, setTime] = useState(new Date());

    const studyMetrics = useMemo(() => {
        if (!sessions || sessions.length === 0) return { avgHours: 0 };
        const totalSeconds = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
        const uniqueDays = new Set(sessions.map(s => s.timestamp.split('T')[0])).size || 1;
        const avgHours = (totalSeconds / uniqueDays / 3600).toFixed(1);
        return { avgHours };
    }, [sessions]);

    const consistencyRate = useMemo(() => {
        if (!xpHistory || xpHistory.length === 0) return 0;
        const activeDays = xpHistory.filter(day => day.xp > 0).length;
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
            reader.onloadend = () => onUpdateProfile({ ...userProfile, avatar: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleGoalChange = (newGoal) => onUpdateProfile({ ...userProfile, mainGoal: newGoal });
    const formatBRL = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-3 md:p-8 lg:p-12 space-y-4 md:space-y-8 h-full flex flex-col relative overflow-hidden pb-24 md:pb-12 text-white"
        >
            {/* Backgrounds - Hidden on Mobile to reduce noise/lag */}
            <div className="absolute inset-0 bg-gradient-radial from-red-950/10 via-black to-black pointer-events-none -z-10 hidden md:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full pointer-events-none -z-10 hidden md:block"></div>

            {/* HEADER COMPRESSED */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-6 border-b border-white/5 pb-3 md:pb-8 relative">

                <div className="flex items-start md:items-center gap-3 md:gap-6 w-full md:w-auto">
                    {/* Avatar */}
                    <div className="relative group cursor-pointer shrink-0">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                        <div className="w-14 h-14 md:w-24 md:h-24 rounded-full border-2 border-berserk-border overflow-hidden relative shadow-lg">
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                    <Skull size={20} className="md:w-10 md:h-10" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full">
                        {/* Rank Badge */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-1 ${rank.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${rank.color === 'text-berserk-red' ? 'bg-berserk-red animate-pulse' : 'bg-current'}`}></span>
                                {rank.title} Rank
                            </span>
                        </div>

                        {/* Title - CLAMPED */}
                        <h1 className="text-2xl md:text-5xl font-serif font-bold text-white uppercase tracking-wider leading-none drop-shadow-md">
                            BEM-VINDO, <br className="md:hidden" /> {userProfile.jobTitle || 'Struggler'}
                        </h1>

                        {/* XP Bar */}
                        <div className="mt-2 md:mt-4 max-w-full md:max-w-md">
                            <div className="flex justify-between text-[9px] md:text-[10px] uppercase font-bold text-zinc-500 mb-1 tracking-wider">
                                <span>XP: {currentXp}</span>
                                <span>PROX: {rank.nextXp}</span>
                            </div>
                            <div className="h-1.5 md:h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-berserk-red to-berserk-gold relative"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Clock */}
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-sm font-bold uppercase tracking-widest text-berserk-red/80 mb-1 font-serif">{formatFullDate(time)}</p>
                    <p className="text-6xl font-serif font-bold text-white tracking-widest text-shadow-crimson leading-none">{time.toLocaleTimeString('pt-BR')}</p>
                </div>
                {/* Mobile Clock (Tiny) */}
                <div className="md:hidden w-full flex justify-between items-center border-t border-white/5 pt-2 mt-2">
                    <p className="text-[9px] font-bold uppercase text-berserk-red/80">{formatFullDate(time)}</p>
                    <p className="text-xl font-mono font-bold text-white">{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-8 overflow-hidden">
                <div className="lg:col-span-2 space-y-3 md:space-y-8 overflow-y-auto pr-0 md:pr-2 custom-scrollbar">
                    {/* XP CHART CARD */}
                    <motion.div variants={item} className="w-full min-h-[220px] md:h-80 glass-card rounded-xl relative overflow-hidden p-3 md:p-6 border-berserk-red/20">
                        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-10">
                            <h3 className="text-lg md:text-3xl font-serif text-white uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp className="text-berserk-gold" size={16} /> Evolução
                            </h3>
                        </div>
                        <div className="mt-10 md:mt-8 h-full w-full">
                            <XPChart xpHistory={xpHistory} />
                        </div>
                    </motion.div>

                    {/* METRIC GRID - SINGLE COL MOBILE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                        <MetricCard label="Ofertas" value={formatBRL(totalIncome)} color="text-emerald-500" icon={Wallet} />
                        <MetricCard label="Sacrifícios" value={formatBRL(totalExpenses)} color="text-berserk-red" icon={TrendingUp} />
                        <MetricCard label="Foco Médio" value={`${studyMetrics.avgHours}h`} color="text-blue-400" icon={Target} />
                        <MetricCard label="Consistência" value={`${consistencyRate}%`} color="text-berserk-gold" icon={Trophy} />
                    </div>
                </div>

                {/* Leaderboard - Desktop Only */}
                <div className="hidden lg:block h-full min-h-[400px]">
                    <SquadLeaderboard user={userProfile} />
                </div>
            </div>
        </motion.div>
    );
};

// Simplified Sub-component for Cleaner Code
const MetricCard = ({ label, value, color, icon: Icon }) => (
    <div className={`glass-card p-3 md:p-6 rounded-xl flex items-center justify-between border-white/5 relative overflow-hidden group`}>
        <div className={`absolute inset-0 ${color.replace('text-', 'bg-')}/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        <div>
            <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">{label}</p>
            <p className={`text-base md:text-xl font-sans font-bold ${color} drop-shadow-sm`}>{value}</p>
        </div>
        <Icon size={16} className={`${color} opacity-50 group-hover:scale-110 transition-transform`} />
    </div>
);

export default Dashboard;
