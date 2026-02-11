import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStudy } from './StudyContext';
import { useFinance } from './FinanceContext';
import { useRoutine } from './RoutineContext';
import AchievementToast from '../components/AchievementToast';

const AchievementContext = createContext();

export const useAchievements = () => useContext(AchievementContext);

const ACHIEVEMENTS = [
    { id: 'first_blood', title: 'First Blood', desc: 'Complete sua primeira sessão de foco.' },
    { id: 'high_roller', title: 'High Roller', desc: 'Acumule R$ 1.000,00 de saldo.' },
    { id: 'berserker', title: 'Berserker', desc: 'Complete 5 tarefas em um único dia.' }
];

export const AchievementProvider = ({ children }) => {
    // 1. STATE
    const [unlocked, setUnlocked] = useState(() => {
        const saved = localStorage.getItem('fenix_achievements');
        return saved ? JSON.parse(saved) : [];
    });

    const [notificationQueue, setNotificationQueue] = useState([]);
    const [activeNotification, setActiveNotification] = useState(null);

    // 2. CONTEXT HOOKS
    const { sessions } = useStudy();
    const { balance } = useFinance();
    const { history } = useRoutine();

    // 3. PERSISTENCE
    useEffect(() => {
        localStorage.setItem('fenix_achievements', JSON.stringify(unlocked));
    }, [unlocked]);

    // 4. QUEUE MANAGEMENT
    useEffect(() => {
        if (!activeNotification && notificationQueue.length > 0) {
            const next = notificationQueue[0];
            setActiveNotification(next);
            setNotificationQueue(prev => prev.slice(1));
        }
    }, [notificationQueue, activeNotification]);

    const closeNotification = () => {
        setActiveNotification(null);
    };

    // 5. UNLOCK LOGIC
    const unlock = (id) => {
        if (unlocked.includes(id)) return; // Already unlocked

        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (!achievement) return;

        setUnlocked(prev => [...prev, id]);
        setNotificationQueue(prev => [...prev, achievement]);
    };

    // 6. LISTENERS (The "Brain" of the Achievement System)

    // Listener: "First Blood" (Study)
    useEffect(() => {
        if (sessions.length > 0) {
            unlock('first_blood');
        }
    }, [sessions]);

    // Listener: "High Roller" (Finance)
    useEffect(() => {
        if (balance >= 1000) {
            unlock('high_roller');
        }
    }, [balance]);

    // Listener: "Berserker" (Routine)
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const dayRecord = history[today];

        // Check if 5 or more distinct tasks are completed today
        if (dayRecord && dayRecord.completedIds && dayRecord.completedIds.length >= 5) {
            unlock('berserker');
        }
    }, [history]);

    return (
        <AchievementContext.Provider value={{
            unlocked,
            achievements: ACHIEVEMENTS
        }}>
            {children}
            {/* TOAST RENDERED HERE GLOBALLY */}
            {activeNotification && (
                <AchievementToast
                    notification={activeNotification}
                    onClose={closeNotification}
                />
            )}
        </AchievementContext.Provider>
    );
};
