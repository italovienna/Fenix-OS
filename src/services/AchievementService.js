
export const achievementsList = [
    // Study Milestones
    { id: 'struggler', title: 'The Struggler', desc: 'Complete sua primeira sessão de 10h de estudo.', icon: 'Sword', xp: 50 },
    { id: 'berserker', title: 'Berserker Armor', desc: 'Acumule 50h de estudo total.', icon: 'Skull', xp: 200 },
    { id: 'griffith', title: 'White Hawk', desc: 'Alcance 100h de estudo. Ambição absoluta.', icon: 'Wings', xp: 500 },

    // Level Milestones
    { id: 'soldier', title: 'Soldado do Bando', desc: 'Alcance o Nível 10.', icon: 'Shield', xp: 100 },
    { id: 'commander', title: 'Comandante', desc: 'Alcance o Nível 30.', icon: 'Flag', xp: 300 },

    // Habit Milestones (Mock logic for now)
    { id: 'body_temple', title: 'Body is a Temple', desc: 'Realize Calistenia 5 vezes.', icon: 'Dumbbell', xp: 75 },
    { id: 'rich_mind', title: 'Mente Rica', desc: 'Estude Investimentos por 5 dias seguidos.', icon: 'Coins', xp: 75 },
];

export const checkAchievements = (userProfile, currentStats) => {
    const unlocked = [];
    const currentIds = userProfile.achievements || [];

    achievementsList.forEach(ach => {
        if (currentIds.includes(ach.id)) return;

        let earned = false;

        // Logic Checks
        if (ach.id === 'struggler' && currentStats.study_minutes >= 600) earned = true; // 10h
        if (ach.id === 'berserker' && currentStats.study_minutes >= 3000) earned = true; // 50h
        if (ach.id === 'griffith' && currentStats.study_minutes >= 6000) earned = true; // 100h

        if (ach.id === 'soldier' && currentStats.level >= 10) earned = true;
        if (ach.id === 'commander' && currentStats.level >= 30) earned = true;

        if (earned) {
            unlocked.push(ach);
        }
    });

    return unlocked;
};
