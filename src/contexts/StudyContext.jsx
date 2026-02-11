import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useXp } from './XpContext';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const StudyContext = createContext();

export const useStudy = () => useContext(StudyContext);

export const StudyProvider = ({ children }) => {
    const { addXp } = useXp();
    const { user } = useAuth();

    // --- STATE ---
    // Note: Subjects are still local/hardcoded for now unless user wants them in DB too? 
    // The prompt only said "Save study sessions in the study_sessions table". 
    // I will keep subjects in state/localStorage for now or just state, but sessions go to DB.
    // Actually, if I lose localStorage, subjects disappear on refresh if I don't persist them.
    // I'll keep subjects in localStorage for now as it wasn't explicitly asked to migrate subjects, only sessions.
    const [subjects, setSubjects] = useState(() => {
        const saved = localStorage.getItem('fenix_subjects');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Língua Portuguesa', iconName: 'Scroll', progress: 35, totalSeconds: 0 },
            { id: 2, name: 'Matemática Financeira', iconName: 'Calculator', progress: 10, totalSeconds: 0 },
            { id: 3, name: 'Conhecimentos Bancários', iconName: 'Brain', progress: 50, totalSeconds: 0 },
            { id: 4, name: 'Atualidades do Mercado', iconName: 'FileText', progress: 20, totalSeconds: 0 },
        ];
    });

    const [sessions, setSessions] = useState([]);

    const [activeSubjectId, setActiveSubjectId] = useState(null);
    const [mode, setMode] = useState('FOCUS'); // 'FOCUS' | 'REST'
    const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes default
    const [isActive, setIsActive] = useState(false);
    const [sessionXp, setSessionXp] = useState(0);

    const timerRef = useRef(null);

    // --- CONFIG ---
    const FOCUS_TIME = 50 * 60; // 50 Minutes (War)
    const REST_TIME = 10 * 60;  // 10 Minutes (Grace)
    const XP_PER_MINUTE = 1.66; // approx 100 XP / hour

    // --- FETCH SESSIONS ---
    useEffect(() => {
        const fetchSessions = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('study_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching sessions:', error);
            else setSessions(data || []);
        };
        fetchSessions();
    }, [user]);


    // --- EFFECT: TIMER LOGIC ---
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);

                // Add XP (Internal Session Accumulator) only in FOCUS mode
                if (mode === 'FOCUS') {
                    setSessionXp((prev) => prev + (XP_PER_MINUTE / 60));

                    // Update subject total time in real-time
                    if (activeSubjectId) {
                        setSubjects(prev => prev.map(sub =>
                            sub.id === activeSubjectId
                                ? { ...sub, totalSeconds: (sub.totalSeconds || 0) + 1 }
                                : sub
                        ));
                    }
                }
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft, mode, activeSubjectId]);

    // --- PERSISTENCE FOR SUBJECTS (STILL LOCAL FOR NOW) ---
    useEffect(() => {
        localStorage.setItem('fenix_subjects', JSON.stringify(subjects));
    }, [subjects]);

    // --- HANDLERS ---
    const saveSessionToSupabase = async (sessionData) => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('study_sessions')
                .insert([{
                    user_id: user.id,
                    subject_id: sessionData.subjectId, // Ensure DB has this column or use generic json/text
                    subject_name: sessionData.subjectName,
                    duration: sessionData.duration,
                    xp_earned: sessionData.xp,
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            setSessions(prev => [data[0], ...prev]);
        } catch (error) {
            console.error('Error saving session:', error);
            // Fallback: Add to local state anyway so user sees it
            setSessions(prev => [sessionData, ...prev]);
        }
    };

    const handleTimerComplete = () => {
        setIsActive(false);
        if (mode === 'FOCUS') {
            const earnedXp = Math.floor(sessionXp);

            // Log Session
            const newSession = {
                // id: Date.now(), // DB will gen ID
                subjectId: activeSubjectId,
                subjectName: subjects.find(s => s.id === activeSubjectId)?.name || 'Desconhecido',
                duration: FOCUS_TIME,
                xp: earnedXp,
                timestamp: new Date().toISOString()
            };

            saveSessionToSupabase(newSession);

            // Add XP via global XpContext
            if (earnedXp > 0) {
                addXp(earnedXp, 'study');
            }
            setSessionXp(0);

            // Switch to Rest
            setMode('REST');
            setTimeLeft(REST_TIME);
            alert("Guerreiro, descanse. A batalha recomeça em breve.");
        } else {
            // Rest Over
            setMode('FOCUS');
            setTimeLeft(FOCUS_TIME);
            alert("O descanso acabou. Volte para a guerra.");
        }
    };

    const toggleTimer = () => {
        if (!activeSubjectId && !isActive) return alert("Selecione uma matéria antes de iniciar a batalha.");
        setIsActive(!isActive);
    };

    const stopTimerAndCollectXp = () => {
        if (!isActive) return;
        setIsActive(false);
        clearInterval(timerRef.current);

        const earnedXp = Math.floor(sessionXp);
        if (earnedXp > 0) {
            const newSession = {
                subjectId: activeSubjectId,
                subjectName: subjects.find(s => s.id === activeSubjectId)?.name || 'Desconhecido',
                duration: FOCUS_TIME - timeLeft,
                xp: earnedXp,
                timestamp: new Date().toISOString()
            };
            saveSessionToSupabase(newSession);

            addXp(earnedXp, 'study');
        }
        setSessionXp(0);
    };

    const selectSubject = (id) => {
        setActiveSubjectId(id);
        setMode('FOCUS');
        setTimeLeft(FOCUS_TIME);
        setIsActive(false);
        setSessionXp(0);
    };

    const addSubject = (name) => {
        const newSubject = {
            id: Date.now(),
            name,
            iconName: 'BookOpen',
            progress: 0,
            totalSeconds: 0
        };
        setSubjects([...subjects, newSubject]);
    };

    const deleteSubject = (id) => {
        setSubjects(subjects.filter(s => s.id !== id));
        if (activeSubjectId === id) {
            setActiveSubjectId(null);
            setIsActive(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <StudyContext.Provider value={{
            subjects,
            activeSubjectId,
            mode,
            timeLeft,
            isActive,
            sessionXp,
            sessions,
            formatTime,
            toggleTimer,
            stopTimerAndCollectXp,
            selectSubject,
            addSubject,
            deleteSubject,
            activeSubject: subjects.find(s => s.id === activeSubjectId)
        }}>
            {children}
        </StudyContext.Provider>
    );
};
