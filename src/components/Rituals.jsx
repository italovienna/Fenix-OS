import React from 'react';
import { motion } from 'framer-motion';
import { Skull, Trophy, Lock } from 'lucide-react';
import HabitGrid from './HabitGrid';
import { achievementsList } from '../services/AchievementService';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const Rituals = ({ habits, toggleHabit, userAchievements }) => {
    const safeAchievements = userAchievements || [];

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-8 max-w-7xl mx-auto space-y-12"
        >
            {/* HER0: HABIT GRID */}
            <section>
                <header className="mb-6 flex items-center gap-4 border-b border-berserk-red/20 pb-4">
                    <Skull className="text-berserk-red w-8 h-8 animate-pulse" />
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Grade de Rituais</h1>
                        <p className="text-zinc-500 text-xs tracking-widest uppercase">Constância é a chave do poder.</p>
                    </div>
                </header>

                <HabitGrid habits={habits} onToggle={toggleHabit} />
            </section>

            {/* HALL OF CONQUESTS */}
            <section>
                <header className="mb-6 flex items-center gap-4 border-b border-white/5 pb-4">
                    <Trophy className="text-yellow-500 w-6 h-6" />
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Hall de Conquistas</h2>
                        <p className="text-zinc-500 text-xs tracking-widest uppercase">Marcas da sua jornada.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievementsList.map(ach => {
                        const isUnlocked = safeAchievements.includes(ach.id);
                        return (
                            <motion.div
                                key={ach.id}
                                variants={itemAnim}
                                className={`p-4 rounded-sm border relative overflow-hidden group transition-all duration-300
                                    ${isUnlocked
                                        ? 'bg-zinc-900/60 border-berserk-red/40 shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                                        : 'bg-black/40 border-zinc-800 opacity-60 grayscale'}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className={`font-bold uppercase text-sm mb-1 ${isUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                                            {ach.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500 leading-relaxed max-w-[80%]">
                                            {ach.desc}
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-full border ${isUnlocked ? 'border-berserk-red text-berserk-red bg-berserk-red/10' : 'border-zinc-800 text-zinc-700'}`}>
                                        {isUnlocked ? <Trophy size={16} /> : <Lock size={16} />}
                                    </div>
                                </div>
                                {isUnlocked && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-berserk-red via-red-900 to-black" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </motion.div>
    );
};

export default Rituals;
