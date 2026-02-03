import React from 'react';
import { Skull, Sword, CheckCircle2 } from 'lucide-react';

const Rituals = ({ habits, toggleHabit }) => {
    // Calculate stats
    const completedCount = habits.filter(h => h.completed).length;
    const completionRate = Math.round((completedCount / habits.length) * 100);

    return (
        <div className="p-6 md:p-12">
            <header className="mb-8 border-b border-berserk-border pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase mb-2">
                        Rituais de Força
                    </h1>
                    <p className="text-berserk-muted text-sm">A constância constrói o conquistador.</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-bold text-berserk-brightRed">{completionRate}%</span>
                    <span className="block text-xs uppercase text-berserk-muted">Conclusão Diária</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map(habit => (
                    <div
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={`
                            relative overflow-hidden cursor-pointer group rounded-sm border p-6 flex flex-col justify-between h-40 transition-all duration-300
                            ${habit.completed
                                ? 'bg-berserk-red/10 border-berserk-red shadow-[0_0_20px_rgba(220,38,38,0.1)]'
                                : 'bg-berserk-card border-berserk-border hover:border-berserk-muted'}
                        `}
                    >
                        {/* Background Icon Faded */}
                        <habit.icon className={`absolute -right-4 -bottom-4 w-24 h-24 opacity-5 transition-transform duration-500 group-hover:scale-110
                             ${habit.completed ? 'text-berserk-red' : 'text-white'}`}
                        />

                        <div className="flex justify-between items-start">
                            <div className={`w-8 h-8 border-2 flex items-center justify-center transition-colors rounded-sm
                                ${habit.completed ? 'border-berserk-red bg-berserk-red' : 'border-berserk-muted group-hover:border-berserk-text'}`}>
                                {habit.completed && <Sword size={16} className="text-black fill-current" />}
                            </div>
                            {habit.completed && <CheckCircle2 className="text-berserk-red" size={20} />}
                        </div>

                        <div>
                            <h3 className={`uppercase tracking-widest font-bold text-lg transition-colors
                                ${habit.completed ? 'text-berserk-red line-through' : 'text-berserk-text group-hover:text-white'}`}>
                                {habit.name}
                            </h3>
                            <p className="text-xs text-berserk-muted mt-1 uppercase">
                                {habit.completed ? 'Completado' : 'Pendente'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rituals;
