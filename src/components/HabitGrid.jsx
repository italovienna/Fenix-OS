import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Helper to get dates for current week (Sun-Sat)
const getCurrentWeek = () => {
    const curr = new Date();
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    const week = [];
    for (let i = 0; i < 7; i++) {
        let day = new Date(curr.setDate(first + i));
        week.push(day.toISOString().split('T')[0]);
    }
    return week;
};

const HabitGrid = ({ habits, onToggle }) => {
    const weekDates = getCurrentWeek();
    const weekDisplay = getCurrentWeek().map(dateString => {
        const d = new Date(dateString);
        return d.getDate(); // Just the number
    });

    const [floatingXp, setFloatingXp] = useState([]);

    // Sound Effect
    const playClickSound = () => {
        const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_73cc3c0293.mp3?filename=ui-click-43196.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("SFX Error", e));
    };

    const handleCellClick = (e, habitId, date) => {
        playClickSound();
        // Trigger toggle
        const earned = onToggle(habitId, date);

        if (earned) {
            // Add floaty text
            const rect = e.target.getBoundingClientRect();
            const id = Date.now();
            setFloatingXp(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => {
                setFloatingXp(prev => prev.filter(p => p.id !== id));
            }, 1000);
        }
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-2xl">
            <h3 className="text-zinc-400 uppercase text-xs font-bold mb-6 tracking-widest">Grade de Hábitos (Semanal)</h3>

            {/* Header Row */}
            <div className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 mb-4">
                <div className="text-xs font-bold text-zinc-600 uppercase flex items-end pb-2">Rituais</div>
                {daysOfWeek.map((day, i) => (
                    <div key={day} className="text-center">
                        <div className="text-[10px] uppercase text-zinc-500 font-bold mb-1">{day}</div>
                        <div className={`text-sm font-mono font-bold ${new Date().getDate() === weekDisplay[i] ? 'text-berserk-red' : 'text-zinc-600'}`}>
                            {weekDisplay[i]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Habit Rows */}
            <div className="space-y-3">
                {habits.map(habit => (
                    <div key={habit.id} className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 items-center group">
                        <div className="flex items-center gap-2">
                            {habit.icon && <habit.icon size={14} className="text-zinc-500 group-hover:text-berserk-red transition-colors" />}
                            <span className="text-xs font-bold text-zinc-300 uppercase truncate">{habit.name}</span>
                        </div>

                        {weekDates.map(date => {
                            const isCompleted = habit.history && habit.history[date];
                            const isToday = date === new Date().toISOString().split('T')[0];

                            return (
                                <motion.div
                                    key={date}
                                    whileHover={{ scale: 1.15, zIndex: 10 }}
                                    whileTap={{ scale: 0.85 }}
                                    onClick={(e) => handleCellClick(e, habit.id, date)}
                                    className={`
                                        w-10 h-10 md:w-12 md:h-12 rounded-sm cursor-pointer flex items-center justify-center border transition-all duration-300 relative
                                        ${isCompleted
                                            ? 'bg-berserk-red border-berserk-red shadow-[0_0_15px_rgba(220,38,38,0.6)] z-10'
                                            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-500 shadow-inner'}
                                    `}
                                >
                                    {isCompleted && <Check size={20} className="text-black stroke-[4] drop-shadow-md" />}
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Floating XP Portal */}
            <AnimatePresence>
                {floatingXp.map(fx => (
                    <motion.div
                        key={fx.id}
                        initial={{ opacity: 1, y: 0, x: 0 }}
                        animate={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0 }}
                        className="fixed pointer-events-none text-berserk-brightRed font-bold text-sm z-50 flex items-center gap-1"
                        style={{ left: fx.x, top: fx.y }}
                    >
                        +10 XP
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HabitGrid;
