import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import FinancialHub from './components/FinancialHub';
import Routine from './components/Routine';
import StudyHub from './components/StudyHub';
import Market from './components/Market';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import OracleView from './components/OracleView';
import { AudioProvider } from './contexts/AudioContext';
import { StudyProvider } from './contexts/StudyContext';
import { FinanceProvider } from './contexts/FinanceContext';
import { XpProvider, useXp } from './contexts/XpContext';
import { RoutineProvider } from './contexts/RoutineContext';
import { AchievementProvider } from './contexts/AchievementContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Clock } from 'lucide-react';

// --- ANIMATION VARIANTS (Smoke/Mist Effect) ---
const pageTransition = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(5px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(5px)', transition: { duration: 0.3, ease: "easeIn" } }
};

// Inner app component that can use contexts
function AppInner() {
  const { addXp, currentXp, activeReward, rewardTimeLeft } = useXp();
  const { signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('inicio');
  const [toast, setToast] = useState(null);

  // User profile (cosmetic, persisted)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('fenix_user_profile');
    return saved ? JSON.parse(saved) : {
      jobTitle: 'Struggler',
      mainGoal: 'Banco do Brasil 2027',
      avatar: null,
      achievements: []
    };
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('fenix_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // --- ACTIONS ---
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black font-sans text-white selection:bg-berserk-red selection:text-white relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={async () => await signOut()} />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto ml-0 md:ml-[260px] pb-24 md:pb-0 relative">
        {/* GLOBAL REWARD BANNER — visible across all tabs */}
        <AnimatePresence>
          {activeReward && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              className="sticky top-0 z-40 bg-gradient-to-r from-berserk-gold/10 via-black/95 to-berserk-gold/10 border-b border-berserk-gold/30 backdrop-blur-xl px-6 py-3"
            >
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-berserk-gold/20 border border-berserk-gold/40 flex items-center justify-center">
                    <Sparkles size={16} className="text-berserk-gold animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-berserk-gold/60 font-bold leading-none">Recompensa Ativa</p>
                    <p className="text-sm font-bold text-white leading-tight">{activeReward.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/70 border border-berserk-gold/30 px-3 py-1.5 rounded-full">
                  <Clock size={14} className="text-berserk-gold" />
                  <span className="text-lg font-mono font-bold text-berserk-gold tabular-nums">{rewardTimeLeft}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                userProfile={userProfile}
                onUpdateProfile={(p) => setUserProfile(p)}
              />
            )}
            {activeTab === 'financeiro' && (
              <FinancialHub showToast={showToast} />
            )}
            {activeTab === 'rotina' && (
              <Routine />
            )}
            {activeTab === 'materias' && (
              <StudyHub />
            )}
            {activeTab === 'oraculo' && (
              <OracleView
                userProfile={userProfile}
                onAddXp={(amount) => {
                  addXp(amount, 'oracle');
                  showToast(`🔮 Insight Absorbed: +${amount} XP`);
                }}
                onCommand={() => true}
              />
            )}
            {activeTab === 'mercado' && (
              <Market showToast={showToast} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Modules */}
      <GlobalAudioPlayer />

      {/* Notifications */}
      {toast && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-20 right-8 bg-zinc-900 border border-berserk-red px-6 py-3 text-white font-bold shadow-2xl z-50">
          {toast}
        </motion.div>
      )}
    </div>
  );
}

import LoginPage from './pages/LoginPage';

function AppContent() {
  const { user } = useAuth(); // AuthProvider handles loading state now

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <LoginPage key="login" />
      ) : (
        <AppInner key="dashboard" />
      )}
    </AnimatePresence>
  );
}

function App() {
  return (
    <AudioProvider>
      <AuthProvider>
        <XpProvider>
          <FinanceProvider>
            <StudyProvider>
              <RoutineProvider>
                <AchievementProvider>
                  <AppContent />
                </AchievementProvider>
              </RoutineProvider>
            </StudyProvider>
          </FinanceProvider>
        </XpProvider>
      </AuthProvider>
    </AudioProvider>
  );
}

export default App;
