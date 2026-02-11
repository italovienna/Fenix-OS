import React, { createContext, useContext, useState, useEffect } from 'react';
import { useXp } from './XpContext';

const RoutineContext = createContext();

export const useRoutine = () => useContext(RoutineContext);

export const RoutineProvider = ({ children }) => {
    const { addXp } = useXp();

    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('fenix_habits');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Calistenia', iconName: 'Dumbbell', completed: false },
            { id: 2, name: 'Estudar BB', iconName: 'Scroll', completed: false },
            { id: 3, name: 'Beber Água', iconName: 'Droplets', completed: false },
            { id: 4, name: 'Mewing', iconName: 'Skull', completed: false },
        ];
    });

    // History: { 'YYYY-MM-DD': { completedIds: [1, 2], level: 1 } }
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('fenix_routine_history');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('fenix_habits', JSON.stringify(habits));
    }, [habits]);

    useEffect(() => {
        localStorage.setItem('fenix_routine_history', JSON.stringify(history));
    }, [history]);

    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const toggleHabit = (id) => {
        const today = getTodayDate();
        let earnedXp = 0;

        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const isCompleted = !h.completed;
                if (isCompleted) earnedXp = 50;
                return { ...h, completed: isCompleted };
            }
            return h;
        }));

        if (earnedXp > 0) addXp(earnedXp, 'habit');

        // Update History
        setHistory(prev => {
            const dayRecord = prev[today] || { completedIds: [] };
            const currentIds = new Set(dayRecord.completedIds);

            // Note: We need to know if we are checking or unchecking. 
            // Since we updated state above, we need to sync. 
            // Simplified: Re-evaluating based on the *new* state would be cleaner, 
            // but we can just use the toggle logic.

            if (currentIds.has(id)) {
                currentIds.delete(id);
            } else {
                currentIds.add(id);
            }

            const completedCount = currentIds.size;
            const totalHabits = habits.length; // Approximate, assuming static count for now

            let level = 0;
            if (completedCount > 0) level = 1;
            if (completedCount === totalHabits) level = 2; // All done

            return {
                ...prev,
                [today]: {
                    completedIds: Array.from(currentIds),
                    level
                }
            };
        });
    };

    // Reset habits daily (Optional: In a real app, you'd check last login date)
    useEffect(() => {
        const today = getTodayDate();
        const lastRun = localStorage.getItem('fenix_last_run');
        if (lastRun !== today) {
            setHabits(prev => prev.map(h => ({ ...h, completed: false })));
            localStorage.setItem('fenix_last_run', today);
        }
    }, []);

    const getMonthData = (year, month) => {
        // Return data format compatible with Routine.jsx heatmp
        // We already have the logic there, providing raw history map is better
        return history;
    };

    return (
        <RoutineContext.Provider value={{ habits, toggleHabit, history }}>
            {children}
        </RoutineContext.Provider>
    );
};
