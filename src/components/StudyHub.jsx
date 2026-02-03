import React, { useState } from 'react';
import { Book, Play, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const StudyHub = ({ subjects, onRegisterSession }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);

    const handleSession = () => {
        if (selectedSubject) {
            onRegisterSession(selectedSubject.id);
            setSelectedSubject(null);
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="p-6 md:p-12"
        >
            <header className="mb-8 border-b border-berserk-border pb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl tracking-widest font-bold text-berserk-text uppercase mb-2">
                        Grimório de Estudos
                    </h1>
                    <p className="text-berserk-muted text-sm flex items-center gap-2">
                        <ShieldAlert size={16} className="text-berserk-red" />
                        Foco Absoluto: Concurso Banco do Brasil 2027
                    </p>
                </div>
                {selectedSubject && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
                        onClick={handleSession}
                        className="bg-berserk-red text-white font-bold uppercase px-6 py-3 flex items-center gap-2 shadow-glow-red hover:shadow-glow-red-strong transition-all"
                    >
                        <Play fill="currentColor" size={16} />
                        Registrar Sessão (+50 XP)
                    </motion.button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                    <motion.div
                        key={subject.id}
                        variants={itemAnim}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedSubject(subject)}
                        className={`bg-berserk-card border p-6 rounded-sm cursor-pointer transition-all duration-300 relative overflow-hidden group
                            ${selectedSubject?.id === subject.id
                                ? 'border-berserk-brightRed shadow-glow-red'
                                : 'border-berserk-border hover:border-berserk-muted'}
                        `}
                    >
                        {/* Progress Bar Background */}
                        <div className="absolute bottom-0 left-0 h-1 bg-berserk-border w-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${subject.progress}%` }}
                                className="h-full bg-gradient-to-r from-berserk-red to-berserk-brightRed"
                            ></motion.div>
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-full border ${selectedSubject?.id === subject.id ? 'bg-berserk-red border-berserk-brightRed text-white' : 'bg-berserk-start border-berserk-border text-berserk-muted'}`}>
                                <subject.icon size={24} />
                            </div>
                            <span className="text-2xl font-bold text-berserk-muted group-hover:text-white transition-colors">
                                {subject.progress}%
                            </span>
                        </div>

                        <h3 className={`uppercase font-bold tracking-wide text-sm mb-1 ${selectedSubject?.id === subject.id ? 'text-berserk-brightRed' : 'text-berserk-text'}`}>
                            {subject.name}
                        </h3>
                        <p className="text-xs text-berserk-muted">Domínio da Matéria</p>

                        {selectedSubject?.id === subject.id && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute top-2 right-2 text-berserk-brightRed"
                            >
                                <CheckCircle size={16} />
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default StudyHub;
