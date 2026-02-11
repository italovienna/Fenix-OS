import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const XpContext = createContext();

export const useXp = () => useContext(XpContext);

// --- LEVEL SYSTEM ---
const XP_PER_LEVEL = 1000;

const calculateLevel = (totalXp) => Math.floor(totalXp / XP_PER_LEVEL) + 1;

const getRankInfo = (totalXp) => {
    if (totalXp < 1000) return { title: 'Struggler', color: 'text-zinc-500', nextXp: 1000, prevXp: 0 };
    if (totalXp < 5000) return { title: 'Soldier', color: 'text-zinc-300', nextXp: 5000, prevXp: 1000 };
    if (totalXp < 10000) return { title: 'Knight', color: 'text-berserk-gold', nextXp: 10000, prevXp: 5000 };
    if (totalXp < 50000) return { title: 'Commander', color: 'text-berserk-red', nextXp: 50000, prevXp: 10000 };
    return { title: 'God Hand', color: 'text-purple-500', nextXp: 100000, prevXp: 50000 };
};

// ═══════════════════════════════════════════════════════
//  SOUND FX — Web Audio API (no external dependencies)
// ═══════════════════════════════════════════════════════
function playRedeemSFX() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        // Rising chime: two quick ascending tones
        const playNote = (freq, startTime, duration) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        const now = ctx.currentTime;
        playNote(523.25, now, 0.15);        // C5
        playNote(659.25, now + 0.1, 0.15);  // E5
        playNote(783.99, now + 0.2, 0.25);  // G5
        playNote(1046.5, now + 0.35, 0.4);  // C6 — triumphant resolve
    } catch (e) {
        console.warn('Audio playback failed:', e);
    }
}

// --- PROVIDER ---
export const XpProvider = ({ children }) => {
    const [currentXp, setCurrentXp] = useState(() => {
        const saved = localStorage.getItem('fenix_xp_current');
        return saved ? JSON.parse(saved) : 0;
    });

    const [totalXpEarned, setTotalXpEarned] = useState(() => {
        const saved = localStorage.getItem('fenix_xp_total');
        return saved ? JSON.parse(saved) : 0;
    });

    const [inventory, setInventory] = useState(() => {
        const saved = localStorage.getItem('fenix_inventory');
        return saved ? JSON.parse(saved) : [];
    });

    const [xpHistory, setXpHistory] = useState(() => {
        const saved = localStorage.getItem('fenix_xp_history');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0 && !parsed[0].date.includes('-')) {
                return [];
            }
            return parsed;
        }
        return [];
    });

    // ═══════════════════════════════════════════════════════
    //  ACTIVE REWARD — Global countdown timer
    // ═══════════════════════════════════════════════════════
    const [activeReward, setActiveReward] = useState(() => {
        const saved = localStorage.getItem('fenix_active_reward');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Check if expired
            if (parsed && new Date(parsed.endsAt) > new Date()) {
                return parsed;
            }
            // Expired — clear it
            localStorage.removeItem('fenix_active_reward');
            return null;
        }
        return null;
    });

    const [rewardTimeLeft, setRewardTimeLeft] = useState('');
    const rewardTimerRef = useRef(null);

    // Countdown tick effect
    useEffect(() => {
        if (!activeReward) {
            setRewardTimeLeft('');
            if (rewardTimerRef.current) clearInterval(rewardTimerRef.current);
            return;
        }

        const updateCountdown = () => {
            const now = Date.now();
            const end = new Date(activeReward.endsAt).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setActiveReward(null);
                setRewardTimeLeft('');
                localStorage.removeItem('fenix_active_reward');
                return;
            }

            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);
            setRewardTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
        };

        updateCountdown(); // fire immediately
        rewardTimerRef.current = setInterval(updateCountdown, 1000);

        return () => {
            if (rewardTimerRef.current) clearInterval(rewardTimerRef.current);
        };
    }, [activeReward]);

    // --- COMPUTED ---
    const level = calculateLevel(totalXpEarned);
    const rank = getRankInfo(totalXpEarned);
    const progressPercent = Math.min(100, Math.max(0,
        ((totalXpEarned - rank.prevXp) / (rank.nextXp - rank.prevXp)) * 100
    ));

    // --- PERSISTENCE ---
    useEffect(() => {
        localStorage.setItem('fenix_xp_current', JSON.stringify(currentXp));
    }, [currentXp]);

    useEffect(() => {
        localStorage.setItem('fenix_xp_total', JSON.stringify(totalXpEarned));
    }, [totalXpEarned]);

    useEffect(() => {
        localStorage.setItem('fenix_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('fenix_xp_history', JSON.stringify(xpHistory));
    }, [xpHistory]);

    useEffect(() => {
        if (activeReward) {
            localStorage.setItem('fenix_active_reward', JSON.stringify(activeReward));
        }
    }, [activeReward]);

    // --- ACTIONS ---
    const addXp = useCallback((amount, source = 'unknown') => {
        if (amount <= 0) return;

        const prevLevel = calculateLevel(totalXpEarned);
        const newTotal = totalXpEarned + amount;
        const newLevel = calculateLevel(newTotal);

        setCurrentXp(prev => prev + amount);
        setTotalXpEarned(newTotal);

        const today = new Date().toISOString().split('T')[0];

        setXpHistory(prev => {
            const existingIndex = prev.findIndex(item => item.date === today);

            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    xp: updated[existingIndex].xp + amount
                };
                return updated;
            } else {
                return [...prev, { date: today, xp: amount }];
            }
        });

        const leveledUp = newLevel > prevLevel;
        return { leveledUp, newLevel, prevLevel };
    }, [totalXpEarned]);

    const buyItem = useCallback((itemPrice, itemName) => {
        if (currentXp < itemPrice) {
            return { success: false, error: 'XP Insuficiente!' };
        }

        setCurrentXp(prev => prev - itemPrice);
        const purchasedItem = {
            id: Date.now(),
            name: itemName,
            price: itemPrice,
            purchasedAt: new Date().toISOString(),
        };
        setInventory(prev => [...prev, purchasedItem]);

        return { success: true, item: purchasedItem };
    }, [currentXp]);

    /**
     * Consume an inventory item — removes it and starts a 60-min reward timer.
     * Only one reward can be active at a time.
     */
    const consumeItem = useCallback((itemId) => {
        const item = inventory.find(i => i.id === itemId);
        if (!item) return { success: false, error: 'Item não encontrado.' };

        if (activeReward) {
            return { success: false, error: 'Já existe uma recompensa ativa! Aguarde o timer.' };
        }

        // Remove from inventory
        setInventory(prev => prev.filter(i => i.id !== itemId));

        // Start 60-minute countdown
        const endsAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const reward = { name: item.name, endsAt, startedAt: new Date().toISOString() };
        setActiveReward(reward);

        // Play triumphant sound
        playRedeemSFX();

        return { success: true, reward };
    }, [inventory, activeReward]);

    const resetWeeklyHistory = useCallback(() => {
        setXpHistory([
            { date: 'Seg', xp: 0 },
            { date: 'Ter', xp: 0 },
            { date: 'Qua', xp: 0 },
            { date: 'Qui', xp: 0 },
            { date: 'Sex', xp: 0 },
            { date: 'Sab', xp: 0 },
            { date: 'Dom', xp: 0 },
        ]);
    }, []);

    return (
        <XpContext.Provider value={{
            currentXp,
            totalXpEarned,
            level,
            rank,
            progressPercent,
            inventory,
            xpHistory,
            activeReward,
            rewardTimeLeft,
            addXp,
            buyItem,
            consumeItem,
            resetWeeklyHistory,
            getRankInfo,
            xpData: { currentXp, level },
        }}>
            {children}
        </XpContext.Provider>
    );
};
