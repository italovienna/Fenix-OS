import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, BookOpen, Plus, Trash2, Hourglass, Sword, Shield, Zap, ChevronRight } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';
import { useSound } from '../utils/sfx';

const StudyHub = () => {
    const {
        subjects, activeSubject, mode, timeLeft, isActive, sessionXp, sessions,
        formatTime, toggleTimer, selectSubject, addSubject, deleteSubject
    } = useStudy();

    const [isAdding, setIsAdding] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [activeView, setActiveView] = useState('subjects'); // 'subjects' | 'war-room'
    const sfx = useSound();

    // Helper: Level Calculation
    const getSubjectLevel = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const level = Math.floor(minutes / 60) + 1; // 1 Level per hour
        const progress = (minutes % 60) * (100 / 60); // Percentage of current hour
        return { level, progress, totalXP: Math.floor(minutes * 1.66) };
    };

    const handleAdd = () => {
        if (!newSubjectName.trim()) return;
        sfx.click();
        addSubject(newSubjectName);
        setNewSubjectName('');
        setIsAdding(false);
    };

    const handleToggleTimer = () => {
        if (!isActive) {
            sfx.swordSheathe(); // Timer starting
        }
        toggleTimer();
    };

    // Visual Config based on Mode
    const isRest = mode === 'REST';
    const themeColor = isRest ? 'text-berserk-gold' : 'text-berserk-red';
    const borderColor = isRest ? 'border-berserk-gold' : 'border-berserk-red';
    const shadowColor = isRest ? 'rgba(212,175,55,0.5)' : 'rgba(220,38,38,0.5)';

    // Filter sessions for today
    const todaysSessions = sessions.filter(s => {
        const d = new Date(s.timestamp);
        const today = new Date();
        return d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
    });

    // Focus Mode: Hide header/sidebar when timer is active
    const isFocusMode = activeView === 'war-room' && isActive;

    return (
        <div className="h-full flex flex-col p-4 md:p-8 space-y-6">
            {/* HEADER */}
            <motion.div
                className="flex justify-between items-end border-b border-white/10 pb-4"
                animate={{ opacity: isFocusMode ? 0.2 : 1 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wider flex items-center gap-3">
                        {activeView === 'war-room' ? (
                            <button onClick={() => { sfx.click(); setActiveView('subjects'); }} className="hover:text-berserk-red transition-colors">
                                <ChevronRight className="rotate-180" />
                            </button>
                        ) : (
                            <BookOpen className="text-berserk-red" />
                        )}
                        {activeView === 'war-room' ? 'War Room' : 'Matérias'}
                    </h1>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                        {activeView === 'war-room' ? 'Protocolo de Foco Ativo' : 'Gerenciamento de Conhecimento'}
                    </p>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {activeView === 'subjects' ? (
                    <motion.div
                        key="subjects"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-20"
                    >
                        {/* ADD NEW CARD */}
                        <div className="min-h-[200px] border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center p-6 hover:border-berserk-gold/50 transition-colors group cursor-pointer"
                            onClick={() => setIsAdding(true)}>
                            <Plus size={40} className="text-zinc-600 group-hover:text-berserk-gold transition-colors mb-2" />
                            <span className="text-xs font-bold uppercase text-zinc-600 group-hover:text-white tracking-widest">Nova Matéria</span>
                        </div>

                        {/* SUBJECT CARDS */}
                        {subjects.map(subject => {
                            const { level, progress, totalXP } = getSubjectLevel(subject.totalSeconds || 0);
                            return (
                                <div
                                    key={subject.id}
                                    onClick={() => { sfx.click(); selectSubject(subject.id); setActiveView('war-room'); }}
                                    className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-berserk-red/50 transition-all cursor-pointer"
                                >
                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-berserk-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <div className="p-2 bg-black rounded border border-white/10 text-berserk-text">
                                            <BookOpen size={20} />
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); sfx.click(); deleteSubject(subject.id); }}
                                            className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1 relative z-10">{subject.name}</h3>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6 relative z-10">
                                        Nível {level} • {Math.floor((subject.totalSeconds || 0) / 60)} Minutos
                                    </p>

                                    {/* XP BAR */}
                                    <div className="relative h-2 bg-black rounded-full overflow-hidden border border-white/5 z-10">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-berserk-gold"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] font-bold text-zinc-600 uppercase">
                                        <span>{totalXP} XP Total</span>
                                        <span>{Math.floor(progress)}% Prox. Nível</span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* MODAL FOR ADDING */}
                        {isAdding && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="bg-zinc-900 p-6 rounded-xl border border-berserk-gold w-full max-w-sm">
                                    <h3 className="text-berserk-gold font-bold uppercase mb-4">Nova Matéria</h3>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newSubjectName}
                                        onChange={(e) => setNewSubjectName(e.target.value)}
                                        placeholder="Ex: Matemática"
                                        className="w-full bg-black border border-zinc-700 p-3 text-white mb-4 outline-none focus:border-berserk-gold"
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-500 hover:text-white font-bold uppercase text-xs">Cancelar</button>
                                        <button onClick={handleAdd} className="px-6 py-2 bg-berserk-gold text-black font-bold uppercase text-xs rounded hover:bg-yellow-500">Criar</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="war-room"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* TIMER SECTION */}
                        <div className="lg:col-span-2 flex flex-col">
                            <motion.div
                                className="flex-1 glass-card rounded-2xl flex flex-col items-center justify-center relative border border-white/5 transition-all duration-500"
                                style={{ boxShadow: isActive ? `0 0 50px ${shadowColor}` : 'none' }}
                                animate={{ scale: isFocusMode ? 1.05 : 1 }}
                                transition={{ duration: 0.3, type: 'spring' }}
                            >
                                <motion.div
                                    className="absolute top-6 left-6"
                                    animate={{ opacity: isFocusMode ? 0 : 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Alvo Atual</span>
                                    <h2 className="text-2xl font-bold text-white uppercase">{activeSubject?.name}</h2>
                                </motion.div>

                                {/* CENTERED SUBJECT NAME IN FOCUS MODE */}
                                <AnimatePresence>
                                    {isFocusMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center"
                                        >
                                            <p className="text-sm uppercase text-zinc-500 font-bold tracking-widest mb-2">Foco Absoluto</p>
                                            <h2 className="text-3xl font-bold text-white uppercase">{activeSubject?.name}</h2>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* TIMER DISPLAY */}
                                <div className="text-[8rem] md:text-[10rem] font-bold font-sans tracking-tighter leading-none text-white tabular-nums drop-shadow-2xl text-shadow-lg cursor-pointer select-none"
                                    onClick={handleToggleTimer}>
                                    {formatTime(timeLeft)}
                                </div>

                                {/* CONTROLS */}
                                <button
                                    onClick={handleToggleTimer}
                                    className={`mt-12 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-black hover:scale-110 shadow-[0_0_30px_white]'}`}
                                >
                                    {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                                </button>

                                {/* STATUS BADGE */}
                                <motion.div
                                    className="absolute top-6 right-6 flex flex-col items-end gap-2"
                                    animate={{ opacity: isFocusMode ? 0.3 : 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className={`px-4 py-2 rounded-full border ${isRest ? 'bg-berserk-gold/10 border-berserk-gold text-berserk-gold' : 'bg-red-900/20 border-berserk-red text-berserk-red'} flex items-center gap-2`}>
                                        {isRest ? <Shield size={16} /> : <Sword size={16} />}
                                        <span className="text-xs font-bold uppercase tracking-widest">{isRest ? 'Descanso' : 'Modo Guerra'}</span>
                                    </div>
                                    {isActive && !isRest && (
                                        <div className="flex items-center gap-2 text-berserk-red font-bold text-xs animate-pulse">
                                            <Zap size={12} />
                                            <span>XP Ativo: {Math.floor(sessionXp)}</span>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* HISTORY SECTION - Slides out in Focus Mode */}
                        <motion.div
                            className="glass-card rounded-2xl p-6 border-white/5 flex flex-col overflow-hidden"
                            animate={{
                                x: isFocusMode ? '100%' : 0,
                                opacity: isFocusMode ? 0 : 1
                            }}
                            transition={{ duration: 0.7, ease: 'easeInOut' }}
                        >
                            <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                                <Hourglass size={14} /> Registro de Batalha (Hoje)
                            </h3>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                {todaysSessions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 text-zinc-600 opacity-50">
                                        <p className="text-xs italic">Nenhum registro ainda.</p>
                                    </div>
                                ) : (
                                    todaysSessions.map(session => (
                                        <div key={session.id} className="bg-zinc-900/50 border border-white/5 p-3 rounded flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-zinc-300 text-sm">{session.subjectName}</p>
                                                <p className="text-[10px] text-zinc-600">{new Date(session.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-berserk-red text-xs">+{Math.floor(session.xp)} XP</p>
                                                <p className="text-[10px] text-zinc-500">{Math.floor(session.duration / 60)} min</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudyHub;
