import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Trash2, Plus } from 'lucide-react';
import { useRoutine } from '../contexts/RoutineContext';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const Routine = () => {
    const { habits, toggleHabit, history } = useRoutine();

    const heatmapData = useMemo(() => {
        const data = [];
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = new Date(year, month, 1).getDay();

        // Padding
        for (let i = 0; i < firstDayOfWeek; i++) {
            data.push({ level: -2, id: `pad-${i}` }); // Hidden
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            // Create UTC date to avoid timezone issues when comparing with ISO strings
            const dateStr = new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];
            const d = new Date(year, month, day);
            const isToday = d.toDateString() === today.toDateString();
            const isFuture = d > today;

            let level = 0;
            if (!isFuture) {
                const dayRecord = history[dateStr];
                if (dayRecord) {
                    level = dayRecord.level || 0;
                    // Fallback if level not stored but completedIds exists
                    if (!dayRecord.level && dayRecord.completedIds && dayRecord.completedIds.length > 0) {
                        level = 1;
                        if (dayRecord.completedIds.length === habits.length) level = 2;
                    }
                }
            } else {
                level = -1; // Future
            }

            data.push({
                date: d,
                day: day,
                level,
                isToday,
                id: `day-${day}`
            });
        }
        return data;
    }, [history, habits.length]);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-4 md:p-12 space-y-8 h-full overflow-y-auto custom-scrollbar pb-32"
        >
            <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wider mb-2">
                Rotina de Ferro
            </h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-8">Consistência é a única moeda que importa</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CHECKLIST */}
                <div className="space-y-4">
                    <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-4">Protocolo Diário</h3>
                    {habits.map((habit) => (
                        <div
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 group hover:transform hover:translateY-[-2px]
                                ${habit.completed
                                    ? 'bg-zinc-900 border-berserk-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                    : 'bg-transparent border-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                                }
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                    ${habit.completed ? 'bg-berserk-gold border-berserk-gold' : 'border-zinc-600 group-hover:border-zinc-400'}
                                `}>
                                    {habit.completed && <CheckCircle size={14} className="text-black" />}
                                </div>
                                <span className={`font-bold uppercase tracking-wider text-sm transition-colors ${habit.completed ? 'text-white' : 'text-zinc-400'}`}>
                                    {habit.name}
                                </span>
                            </div>
                            {habit.completed && <span className="text-berserk-gold font-bold text-xs">+50 XP</span>}
                        </div>
                    ))}
                </div>

                {/* HEATMAP - GitHub Contribution Style */}
                <div className="glass-card p-6 rounded-xl border border-white/10">
                    <h3 className="text-zinc-500 font-bold uppercase text-xs tracking-widest mb-6">Mapa do Sacrifício (Fevereiro)</h3>

                    <div className="grid grid-cols-7 gap-1.5">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-[10px] font-bold text-zinc-600 uppercase">{day}</div>
                        ))}

                        {heatmapData.map((cell) => {
                            // GitHub-style intensity-based coloring
                            let cellStyles = '';

                            if (cell.level === -2) return <div key={cell.id}></div>; // Padding

                            if (cell.level === -1) {
                                // Future days - very dark, no glow
                                cellStyles = 'bg-zinc-950/30 opacity-40 border border-zinc-900';
                            } else if (cell.level === 0) {
                                // Inactive day - dark grey, no glow
                                cellStyles = 'bg-zinc-900/40 border border-zinc-800/50';
                            } else if (cell.level === 1) {
                                // Partial completion - faint red glow
                                cellStyles = 'bg-red-900/60 border border-red-800/50 shadow-[0_0_5px_rgba(220,38,38,0.3)]';
                            } else if (cell.level === 2) {
                                // Perfect day - intense red glow
                                cellStyles = 'bg-red-600 border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.7)]';
                            }

                            return (
                                <div
                                    key={cell.id}
                                    title={`${cell.date?.toLocaleDateString('pt-BR')}: Nível ${cell.level}`}
                                    className={`aspect-square rounded-sm flex items-center justify-center text-[10px] font-bold relative group cursor-pointer transition-all duration-200 hover:scale-110 ${cellStyles} ${cell.isToday ? 'ring-2 ring-white' : ''}`}
                                >
                                    <span className={cell.level === 2 ? 'text-white' : 'text-zinc-500 group-hover:text-white'}>{cell.day}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex justify-between mt-6 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-900/40 border border-zinc-800/50 rounded-sm"></div> Nada</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-900/60 rounded-sm"></div> Parcial</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded-sm shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div> Épico</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Routine;
