import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import FinancialHub from './components/FinancialHub';
import Rituals from './components/Rituals';
import StudyHub from './components/StudyHub';
import Market from './components/Market';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import OracleView from './components/OracleView';
import { AudioProvider } from './contexts/AudioContext';
// New Thematic Icons
import {
  Swords, Coins, Scroll, Skull, ShoppingBag,
  Dumbbell, BookOpen, Droplets, Calculator, Brain, FileText, Anchor // Fallbacks
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- ANIMATION VARIANTS (Smoke/Mist Effect) ---
const pageTransition = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(5px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(5px)', transition: { duration: 0.3, ease: "easeIn" } }
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('inicio');
  const [toast, setToast] = useState(null);
  const [synced, setSynced] = useState(true); // Visual indicator for cloud sync

  // Data State (Defaults)
  const [xpData, setXpData] = useState({ currentXp: 0, level: 21 });
  const [userProfile, setUserProfile] = useState({
    jobTitle: 'Struggler',
    mainGoal: 'Banco do Brasil 2027',
    badges: [] // Initial empty badges
  });

  const [habits, setHabits] = useState([
    { id: 1, name: 'Calistenia', iconName: 'Dumbbell', completed: false },
    { id: 2, name: 'Estudar BB', iconName: 'Scroll', completed: false },
    { id: 3, name: 'Beber Água', iconName: 'Droplets', completed: false },
    { id: 4, name: 'Mewing', iconName: 'Skull', completed: false },
  ]);

  const [studySubjects, setStudySubjects] = useState([
    { id: 1, name: 'Língua Portuguesa', iconName: 'Scroll', progress: 35 },
    { id: 2, name: 'Matemática Financeira', iconName: 'Calculator', progress: 10 },
    { id: 3, name: 'Conhecimentos Bancários', iconName: 'Brain', progress: 50 },
    { id: 4, name: 'Atualidades do Mercado', iconName: 'FileText', progress: 20 },
  ]);

  const [financials, setFinancials] = useState({
    income: [
      { id: 1, name: 'Salário', value: 1675.00 },
      { id: 2, name: 'Auxílio Passagem', value: 185.00 },
      { id: 3, name: 'Vale Alimentação', value: 400.00 }
    ],
    expenses: [
      { id: 1, name: 'Parcela Moto', value: 920.00 },
      { id: 2, name: 'Banco do Brasil', value: 800.00 },
      { id: 3, name: 'Fatura Nubank', value: 300.00 }
    ]
  });

  // --- AUTH & DATA FETCHING ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        await supabase.from('profiles').upsert({
          id: userId,
          xp: 0, level: 21,
          habits, studies: studySubjects, financials,
          user_metadata: userProfile,
          updated_at: new Date()
        });
      }

      if (data) {
        setXpData({ currentXp: data.xp || 0, level: data.level || 21 });
        if (data.habits) setHabits(data.habits);
        if (data.studies) setStudySubjects(data.studies);
        if (data.financials) setFinancials(data.financials);
        if (data.user_metadata) setUserProfile(data.user_metadata);
        else if (data.job_title) setUserProfile({ jobTitle: data.job_title, mainGoal: data.main_goal || '' });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CLOUD SYNC ---
  const syncToCloud = async (userId, newXpData, newHabits, newStudies, newFinancials, newUserProfile) => {
    setSynced(false);
    const payload = {
      id: userId,
      updated_at: new Date(),
      xp: newXpData?.currentXp,
      level: newXpData?.level,
      habits: newHabits,
      studies: newStudies,
      financials: newFinancials,
      user_metadata: newUserProfile
    };

    // Cleanup undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const { error } = await supabase.from('profiles').upsert(payload);
    if (!error) setSynced(true);
    else console.error("Sync Error:", error);
  };

  // --- ACTIONS ---

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); };

  // --- HELPER: Icon Mapper ---
  const getIcon = (iconName) => {
    const icons = {
      Dumbbell, BookOpen, Droplets, Skull, Calculator, Brain, FileText,
      Scroll, Coins, Swords // New Anime Icons
    };
    return icons[iconName] || BookOpen;
  };

  // --- BADGE LOGIC ---
  const checkBadges = (currentBadges, xpData, studyMinutes) => {
    const newBadges = [...currentBadges];
    let earned = null;

    const milestones = [
      { id: 'struggler', name: 'The Struggler', threshold: 600, type: 'minutes' }, // 10h
      { id: 'berserker', name: 'Berserker Mode', threshold: 3000, type: 'minutes' }, // 50h
      { id: 'soldier', name: 'Soldier', threshold: 10, type: 'level' },
      { id: 'commander', name: 'Commander', threshold: 30, type: 'level' },
      { id: 'falcon', name: 'The Falcon', threshold: 50, type: 'level' }
    ];

    milestones.forEach(m => {
      if (newBadges.includes(m.id)) return;

      if (m.type === 'minutes' && studyMinutes >= m.threshold) {
        newBadges.push(m.id);
        earned = m.name;
      }
      if (m.type === 'level' && xpData.level >= m.threshold) {
        newBadges.push(m.id);
        earned = m.name;
      }
    });

    return { updatedBadges: newBadges, earned };
  };

  // Helper to update state and trigger sync
  const updateStateAndSync = (updates) => {
    const newXpData = updates.xpData !== undefined ? updates.xpData : xpData;
    const newHabits = updates.habits !== undefined ? updates.habits : habits;
    const newStudies = updates.studySubjects !== undefined ? updates.studySubjects : studySubjects;
    const newFinancials = updates.financials !== undefined ? updates.financials : financials;
    const newUserProfile = updates.userProfile !== undefined ? updates.userProfile : userProfile;

    if (updates.xpData) setXpData(updates.xpData);
    if (updates.habits) setHabits(updates.habits);
    if (updates.studySubjects) setStudySubjects(updates.studySubjects);
    if (updates.financials) setFinancials(updates.financials);
    if (updates.userProfile) setUserProfile(updates.userProfile);

    if (session?.user?.id) syncToCloud(session.user.id, newXpData, newHabits, newStudies, newFinancials, newUserProfile);
  };

  // --- ACHIEVEMENTS ---
  const unlockAchievement = (id, title, userAchievements) => {
    if (!userAchievements.includes(id)) {
      showToast(`🏆 CONQUISTA: ${title}`);
      return [...userAchievements, id];
    }
    return userAchievements;
  };

  // --- HANDLER UPDATES ---
  const toggleHabit = (id, dateString) => {
    // If no date provided, assume today (legacy support)
    const targetDate = dateString || new Date().toISOString().split('T')[0];

    const updatedHabits = habits.map(h => {
      if (h.id === id) {
        const currentHistory = h.history || {};
        const isCompleted = !!currentHistory[targetDate];

        // Toggle
        const newHistory = { ...currentHistory };
        if (isCompleted) delete newHistory[targetDate];
        else newHistory[targetDate] = true;

        // Also update legacy 'completed' flag if it's today
        const isToday = targetDate === new Date().toISOString().split('T')[0];
        const newCompleted = isToday ? !isCompleted : h.completed;

        return { ...h, history: newHistory, completed: newCompleted };
      }
      return h;
    });

    // XP Logic (Only add XP if marking as Done)
    const habit = habits.find(h => h.id === id);
    const wasCompleted = habit.history?.[targetDate];
    const xpChange = !wasCompleted ? 10 : -10; // 10 XP per habit tick

    let newXp = xpData.currentXp + xpChange;
    // ... (Level logic same as before, simplified)

    // Check Achievements (Mock Example)
    let newAchievements = userProfile.achievements || [];
    if (newXp > 500) newAchievements = unlockAchievement('novice', 'Novato Dedicado', newAchievements);

    updateStateAndSync({
      xpData: { ...xpData, currentXp: Math.max(0, newXp) },
      habits: updatedHabits,
      userProfile: { ...userProfile, achievements: newAchievements }
    });

    return !wasCompleted; // Return true if earned XP (for grid animation)
  };

  const registerStudySession = (subjectId) => {
    const updatedStudies = studySubjects.map(s => s.id === subjectId ? { ...s, progress: Math.min(100, s.progress + 5) } : s);
    updateStateAndSync({ xpData: { ...xpData, currentXp: xpData.currentXp + 50 }, studySubjects: updatedStudies });
    showToast("Estudo Registrado! +50 XP");
  };

  const handleBuyItem = (price, name) => {
    if (xpData.currentXp >= price) {
      updateStateAndSync({ xpData: { ...xpData, currentXp: xpData.currentXp - price } });
      showToast(`Comprou: ${name}`);
    } else showToast("XP Insufficiente");
  };

  // --- REALTIME PING ---
  useEffect(() => {
    const channel = supabase.channel('room1');
    channel.on('broadcast', { event: 'ping' }, (payload) => {
      // Only show if not from self (simple check, though payload.sender should be checked against current user)
      if (payload.payload.sender !== userProfile.jobTitle) { // Using jobTitle as pseudo-id for now or logic in Dashboard
        showToast(`⚔️ ${payload.payload.sender} te desafiou!`);
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- RENDER ---

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-red-600 animate-pulse font-bold">LOADING FENIX...</div>;

  const hydratedHabits = habits.map(h => ({ ...h, icon: getIcon(h.iconName) }));
  const hydratedStudies = studySubjects.map(s => ({ ...s, icon: getIcon(s.iconName) }));

  return (
    <AudioProvider>
      <AnimatePresence mode="wait">
        {!session ? (
          <Auth key="auth" />
        ) : (
          <div className="flex h-screen overflow-hidden bg-berserk-dark font-sans text-berserk-text selection:bg-berserk-red selection:text-white relative">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

            <main className="flex-1 overflow-y-auto ml-[260px] relative bg-[url('https://grain-url-placeholder')]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  variants={pageTransition}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-full"
                >
                  {activeTab === 'inicio' && (
                    <Dashboard
                      habits={hydratedHabits} // Passing for summary if needed, but removing list per plan
                      level={xpData.level}
                      progress={xpData.currentXp}
                      financials={financials}
                      userProfile={userProfile}
                      onUpdateProfile={(p) => updateStateAndSync({ userProfile: p })}
                    />
                  )}
                  {activeTab === 'financeiro' && (
                    <FinancialHub financials={financials} onUpdateFinancials={(f) => updateStateAndSync({ financials: f })} />
                  )}
                  {activeTab === 'rituais' && (
                    <Rituals habits={hydratedHabits} toggleHabit={toggleHabit} userAchievements={userProfile.achievements} />
                  )}
                  {activeTab === 'estudos' && (
                    <StudyHub subjects={hydratedStudies} onRegisterSession={registerStudySession} />
                  )}
                  {activeTab === 'oraculo' && (
                    <OracleView
                      userProfile={userProfile}
                      onAddXp={(amount) => {
                        updateStateAndSync({ xpData: { ...xpData, currentXp: xpData.currentXp + amount } });
                        showToast(`🔮 Insight Absorbed: +${amount} XP`);
                      }}
                    />
                  )}
                  {activeTab === 'mercado' && (
                    <Market userXp={xpData.currentXp} onBuy={handleBuyItem} />
                  )}
                </motion.div>
              </AnimatePresence>
            </main>

            {/* Global Modules */}
            <GlobalAudioPlayer />

            {/* Notifications */}
            <div className={`fixed bottom-4 right-4 w-2 h-2 rounded-full ${synced ? 'bg-emerald-900' : 'bg-yellow-600 animate-pulse'}`}></div>
            {toast && (
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-20 right-8 bg-zinc-900 border border-berserk-red px-6 py-3 text-white font-bold shadow-2xl z-50">
                {toast}
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </AudioProvider>
  );
}

export default App;
