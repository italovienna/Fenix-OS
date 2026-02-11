import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Skull, Users, Trophy, Wallet, Target, Sword, Flame, Crown, Edit2, Star } from 'lucide-react';
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

// --- HELPER: GET CLASS BASED ON LEVEL ---
const getUserClass = (level) => {
    if (level < 10) return 'Struggler';
    if (level < 20) return 'Fighter';
    return 'General';
};

const Dashboard = ({ userProfile, onUpdateProfile }) => {
    const { currentXp, rank, progressPercent, xpHistory } = useXp();
    const { totalIncome, totalExpenses, balance } = useFinance();
    const { sessions } = useStudy();
    const [time, setTime] = useState(new Date());

    // Mock Level Calculation (In a real app, this would come from context)
    const currentLevel = Math.floor(currentXp / 1000) + 1;
    const userClass = getUserClass(currentLevel);

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

    const formatBRL = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    // STATIC RANKING DATA
    const rankingData = [
        { id: 1, name: 'Italo', class: 'Fighter', level: 12, xp: 12450, isUser: true, avatar: userProfile.avatar },
        { id: 2, name: 'Bernardo', class: 'Mage', level: 11, xp: 11500, isUser: false },
        { id: 3, name: 'Acácio', class: 'Swordsman', level: 10, xp: 9000, isUser: false },
    ];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-3 md:p-8 lg:p-12 space-y-6 md:space-y-8 h-full flex flex-col relative overflow-hidden pb-24 md:pb-12 text-white"
        >
            {/* Dark Bloody Background */}
            <div className="absolute inset-0 bg-gradient-radial from-red-950/20 via-black to-black pointer-events-none -z-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

            {/* --- HERO SECTION: THE RETURN OF THE KING --- */}
            <div className="w-full relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/40 to-black shadow-[0_0_30px_rgba(220,38,38,0.1)] p-4 md:p-8">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Skull size={120} className="text-red-500" />
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative z-10">
                    {/* Left: Avatar & Welcome */}
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left w-full md:w-auto">
                        <div className="relative group cursor-pointer w-20 h-20 md:w-24 md:h-24 shrink-0">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                            <div className="w-full h-full rounded-full border-2 border-red-500/50 overflow-hidden relative shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                                {userProfile.avatar ? (
                                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
                                        <Skull size={32} />
                                    </div>
                                )}
                            </div>
                            {/* Online Dot */}
                            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-black rounded-full shadow-[0_0_10px_#10b981]"></div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <span className="text-[10px] bg-red-900/30 border border-red-500/30 text-red-400 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                    Current Class: {userClass}
                                </span>
                            </div>
                            <h1 className="text-xl md:text-3xl font-serif font-bold text-white uppercase tracking-wider leading-none drop-shadow-lg flex items-center gap-2 justify-center md:justify-start">
                                <Sword size={20} className="text-red-500 hidden md:block" />
                                WELCOME, <span className="text-red-500">{userProfile.jobTitle || 'STRUCTGLER'}</span>
                            </h1>
                            <p className="text-[10px] md:text-xs text-zinc-400 uppercase tracking-[0.2em] font-bold mt-1">
                                {formatFullDate(time)}
                            </p>
                        </div>
                    </div>

                    {/* Right: XP BAR (Visual & Responsive) */}
                    <div className="w-full md:w-1/2 lg:w-1/3 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 relative overflow-hidden group hover:border-red-500/50 transition-colors">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Rank</span>
                                <span className={`text-sm md:text-base font-bold uppercase tracking-wider flex items-center gap-2 ${rank.color}`}>
                                    <Crown size={14} /> {rank.title}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Level {currentLevel}</span>
                                <span className="text-xs font-mono font-bold text-white">{currentXp} / {rank.nextXp} XP</span>
                            </div>
                        </div>
                        {/* Bar */}
                        <div className="h-2 md:h-3 w-full bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 relative shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION: THE DREAM (Main Goal) --- */}
            <div className="w-full bg-gradient-to-r from-amber-900/10 to-transparent border border-amber-500/20 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
                <div className="flex items-center gap-3 z-10 w-full md:w-auto">
                    <Trophy size={20} className="text-amber-500 shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-xs text-amber-500/80 uppercase font-bold tracking-widest mb-0.5">Supreme Goal</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base font-bold text-amber-100 uppercase tracking-wider">
                                {userProfile.mainGoal || 'Banco do Brasil Approval 2027'}
                            </span>
                            <button onClick={() => { }} className="text-zinc-600 hover:text-white transition-colors">
                                <Edit2 size={12} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Visual Progress for Goal (Static 45% for demo) */}
                <div className="w-full md:w-1/3 flex items-center gap-3 z-10">
                    <span className="text-[10px] font-bold text-amber-500">45%</span>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-amber-500 w-[45%] shadow-[0_0_10px_#f59e0b]"></div>
                    </div>
                </div>
            </div>

            {/* --- STATUS GRID (Glassmorphism + Big Icons) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatusCard icon={Wallet} label="Entradas" value={formatBRL(totalIncome)} color="text-emerald-400" bgColor="bg-emerald-950/10" borderColor="border-emerald-500/20" />
                <StatusCard icon={Flame} label="Sacrifícios" value={formatBRL(totalExpenses)} color="text-berserk-red" bgColor="bg-red-950/10" borderColor="border-red-500/20" />
                <StatusCard icon={Target} label="Saldo" value={formatBRL(balance)} color={balance >= 0 ? "text-white" : "text-red-500"} bgColor="bg-transparent" borderColor="border-white/10" />
                <StatusCard icon={Trophy} label="Consistência" value={`${consistencyRate}%`} color="text-amber-400" bgColor="bg-amber-950/5" borderColor="border-amber-500/20" />
            </div>

            {/* --- SPLIT GRID: EVOLUTION + RANKING --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* COL 1 & 2: SOUL EVOLUTION CHART (66%) */}
                <div className="lg:col-span-2 glass-card rounded-2xl relative overflow-hidden p-4 md:p-8 border-red-900/20 flex flex-col min-h-[300px]">
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                        <h3 className="text-lg md:text-2xl font-serif text-white uppercase tracking-wider flex items-center gap-3 drop-shadow-lg">
                            <TrendingUp className="text-red-500" size={20} />
                            <span className="text-shadow-crimson">Evolução da Alma</span>
                        </h3>
                    </div>
                    <div className="mt-12 h-full w-full flex-1">
                        <XPChart xpHistory={xpHistory} />
                    </div>
                </div>

                {/* COL 3: BAND OF THE HAWK RANKING (33%) */}
                <div className="lg:col-span-1 glass-card rounded-2xl p-0 border-zinc-800 flex flex-col overflow-hidden max-h-[400px] lg:max-h-none">
                    <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-sm flex items-center justify-between">
                        <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <Users size={16} /> Band of the Hawk
                        </h3>
                        <span className="text-[10px] text-zinc-500 font-mono">SEASON 1</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {rankingData.map((player, index) => (
                            <div key={player.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${player.isUser ? 'bg-red-900/10 border-red-500/30' : 'bg-zinc-900/40 border-white/5'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${index === 0 ? 'bg-amber-500 text-black' : index === 1 ? 'bg-zinc-400 text-black' : index === 2 ? 'bg-orange-700 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                                    {index + 1}
                                </div>
                                <div className="relative w-10 h-10 rounded-full bg-zinc-800 overflow-hidden shrink-0 border border-white/10">
                                    {player.avatar ? <img src={player.avatar} alt="P" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600"><Skull size={16} /></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm font-bold truncate ${player.isUser ? 'text-red-400' : 'text-zinc-300'}`}>{player.name}</span>
                                        {player.isUser && <span className="text-[8px] bg-red-500 text-white px-1 rounded uppercase">You</span>}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold flex items-center gap-1">
                                        <span>{player.class}</span> • <span>Lvl {player.level}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-xs font-mono font-bold text-amber-500 block">{player.xp} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-white/5 text-center bg-black/20">
                        <button className="text-[10px] text-zinc-500 uppercase font-bold hover:text-white transition-colors">View All Members</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Simplified Status Card Component
const StatusCard = ({ icon: Icon, label, value, color, bgColor, borderColor }) => (
    <div className={`glass-card p-4 md:p-6 rounded-2xl flex flex-col justify-between ${borderColor} ${bgColor} relative overflow-hidden group min-h-[100px]`}>
        <Icon size={80} className={`absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500 rotate-[-10deg] ${color}`} />
        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest z-10 relative">{label}</span>
        <span className={`text-2xl md:text-3xl font-sans font-bold ${color} drop-shadow-md z-10 relative`}>{value}</span>
    </div>
);

export default Dashboard;
