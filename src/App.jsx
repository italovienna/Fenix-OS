import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import FinancialHub from './components/FinancialHub';
import Rituals from './components/Rituals';
import StudyHub from './components/StudyHub';
import { Dumbbell, BookOpen, Droplets, Skull, Calculator, Brain, FileText } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('inicio');
  const [toast, setToast] = useState(null);
  const [synced, setSynced] = useState(true); // Visual indicator for cloud sync

  // Data State (Defaults)
  const [xpData, setXpData] = useState({ currentXp: 0, level: 21 });

  const [habits, setHabits] = useState([
    { id: 1, name: 'Calistenia', iconName: 'Dumbbell', completed: false },
    { id: 2, name: 'Estudar BB', iconName: 'BookOpen', completed: false },
    { id: 3, name: 'Beber Água', iconName: 'Droplets', completed: false },
    { id: 4, name: 'Mewing', iconName: 'Skull', completed: false },
  ]);

  const [studySubjects, setStudySubjects] = useState([
    { id: 1, name: 'Língua Portuguesa', iconName: 'BookOpen', progress: 35 },
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
        const { error: insertError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            xp: 0,
            level: 21,
            habits: habits,
            studies: studySubjects,
            financials: financials,
            updated_at: new Date()
          });
        if (!insertError) {
          // Retry fetch if insertion worked
        }
      }

      if (data) {
        setXpData({ currentXp: data.xp || 0, level: data.level || 21 });
        if (data.habits) setHabits(data.habits);
        if (data.studies) setStudySubjects(data.studies);
        if (data.financials) setFinancials(data.financials);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CLOUD SYNC ---
  const syncToCloud = async (userId, newXpData, newHabits, newStudies, newFinancials) => {
    setSynced(false);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        xp: newXpData.currentXp,
        level: newXpData.level,
        habits: newHabits,
        studies: newStudies,
        financials: newFinancials,
        updated_at: new Date()
      });

    if (!error) setSynced(true);
  };

  // --- ACTIONS ---

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Helper to update state and trigger sync
  const updateStateAndSync = (updates) => {
    // Current state values as defaults
    const newXpData = updates.xpData || xpData;
    const newHabits = updates.habits || habits;
    const newStudies = updates.studySubjects || studySubjects;
    const newFinancials = updates.financials || financials;

    // Optimistic Update
    if (updates.xpData) setXpData(updates.xpData);
    if (updates.habits) setHabits(updates.habits);
    if (updates.studySubjects) setStudySubjects(updates.studySubjects);
    if (updates.financials) setFinancials(updates.financials);

    // Sync
    if (session?.user?.id) {
      syncToCloud(session.user.id, newXpData, newHabits, newStudies, newFinancials);
    }
  };

  const toggleHabit = (id) => {
    const updatedHabits = habits.map(h => {
      if (h.id === id) {
        return { ...h, completed: !h.completed };
      }
      return h;
    });

    const habit = habits.find(h => h.id === id);
    const xpChange = !habit.completed ? 25 : -25;

    // XP Logic
    let newXp = xpData.currentXp + xpChange;
    let newLevel = xpData.level;

    if (newXp >= 100) {
      newLevel += Math.floor(newXp / 100);
      newXp = newXp % 100;
      showToast(`LEVEL UP! Você alcançou o nível ${newLevel}!`);
    } else if (newXp < 0) {
      newXp = 0;
    }

    updateStateAndSync({
      xpData: { currentXp: newXp, level: newLevel },
      habits: updatedHabits
    });
  };

  const registerStudySession = (subjectId) => {
    const updatedStudies = studySubjects.map(sub => {
      if (sub.id === subjectId) {
        return { ...sub, progress: Math.min(100, sub.progress + 5) };
      }
      return sub;
    });

    // Add 50 XP
    let newXp = xpData.currentXp + 50;
    let newLevel = xpData.level;
    if (newXp >= 100) {
      newLevel += Math.floor(newXp / 100);
      newXp = newXp % 100;
      showToast(`LEVEL UP! Você alcançou o nível ${newLevel}!`);
    } else {
      showToast(`Sessão Registrada! +50 XP`);
    }

    updateStateAndSync({
      xpData: { currentXp: newXp, level: newLevel },
      studySubjects: updatedStudies
    });
  };

  // --- HELPER: Icon Mapper ---
  const getIcon = (iconName) => {
    const icons = { Dumbbell, BookOpen, Droplets, Skull, Calculator, Brain, FileText };
    return icons[iconName] || BookOpen;
  };

  // --- RENDER ---

  if (loading) {
    return <div className="min-h-screen bg-berserk-dark flex items-center justify-center text-berserk-red font-bold animate-pulse">CARREGANDO FENIX OS...</div>;
  }

  const hydratedHabits = habits.map(h => ({ ...h, icon: getIcon(h.iconName) }));
  const hydratedStudies = studySubjects.map(s => ({ ...s, icon: getIcon(s.iconName) }));

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Dashboard
          key="inicio"
          habits={hydratedHabits}
          toggleHabit={toggleHabit}
          level={xpData.level}
          progress={xpData.currentXp}
          financials={financials}
        />;
      case 'financeiro':
        return <FinancialHub key="financeiro" financials={financials} />;
      case 'rituais':
        return <Rituals key="rituais" habits={hydratedHabits} toggleHabit={toggleHabit} />;
      case 'estudos':
        return <StudyHub key="estudos" subjects={hydratedStudies} onRegisterSession={registerStudySession} />;
      default:
        return <Dashboard key="default" habits={hydratedHabits} toggleHabit={toggleHabit} level={xpData.level} progress={xpData.currentXp} financials={financials} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-berserk-dark font-sans text-berserk-text selection:bg-berserk-red selection:text-white relative">
      <AnimatePresence mode="wait">
        {!session ? (
          <Auth key="auth" />
        ) : (
          <>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto ml-[260px] relative">
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>
            </main>

            {/* Sync Indicator */}
            <div className={`fixed bottom-4 right-4 w-3 h-3 rounded-full transition-colors duration-500 ${synced ? 'bg-emerald-500/50' : 'bg-yellow-500 animate-pulse'}`} title={synced ? "Sincronizado" : "Sincronizando..."}></div>

            {/* TOAST NOTIFICATION */}
            {toast && (
              <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
                <div className="bg-[#1a1a1a] border border-berserk-red px-6 py-4 rounded-sm shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-berserk-brightRed animate-pulse"></div>
                  <span className="text-white font-bold uppercase tracking-wide text-sm">{toast}</span>
                </div>
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
