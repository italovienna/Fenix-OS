import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skull, Send, Sparkles, Brain, Zap } from 'lucide-react';

const OracleView = ({ userProfile, onAddXp }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'oracle',
            text: `Saudações, Ítalo. Vejo que você luta no Brasal, mas seus olhos estão fixos no Eclipse de 2027 (Banco do Brasil). O caminho é estreito. Pergunte, e eu iluminarei as sombras da Matemática Financeira e do Português.`
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Skull Knight AI Logic (Mock) - localized to PT-BR
    const generateResponse = (query) => {
        const lowerQ = query.toLowerCase();

        if (lowerQ.includes('banco') || lowerQ.includes('bb'))
            return "O concurso do Banco do Brasil é um teste de resistência. Foque em 'Conhecimentos Bancários'. O Edital de 2021 é o seu mapa. Ignore o ruído. Estude as regulações.";
        if (lowerQ.includes('matematica') || lowerQ.includes('math') || lowerQ.includes('calculo'))
            return "Matemática Financeira... Juros Compostos são a força do tempo aplicada ao valor. Domine as fórmulas. Elas são as espadas da era moderna.";
        if (lowerQ.includes('cansado') || lowerQ.includes('fadiga') || lowerQ.includes('sono'))
            return "A fadiga é o peso da sua armadura. Você trabalha no Brasal, sim? É pesado. Mas o Falcão não descansa. Descanse se precisar, mas não pare.";
        if (lowerQ.includes('portugues') || lowerQ.includes('crase') || lowerQ.includes('gramatica'))
            return "A gramática portuguesa é um labirinto. A 'Crase' é apenas a fusão de preposições. Não a tema. Pratique a lógica, não apenas as regras.";

        return "A corrente da causalidade é obscura. Clarifique sua intenção. Você está afiando sua mente para o Exame?";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        const responseText = generateResponse(userMsg.text);

        // Simulated Typing Effect
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'oracle', text: responseText, canReward: true }]);
        }, 2000);
    };

    const handleReward = (msgId) => {
        onAddXp(5);
        // Disable reward for this message
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, canReward: false } : m));
    };

    return (
        <div className="h-full flex flex-col p-8 max-w-6xl mx-auto relative overflow-hidden">

            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-berserk-red/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="mb-8 flex items-center justify-between border-b border-berserk-red/30 pb-6 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-zinc-900 border border-berserk-red/50 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <Skull size={40} className="text-berserk-red" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">O Oráculo</h1>
                        <p className="text-zinc-400 text-sm tracking-[0.2em] uppercase font-bold">Mentor: Cavaleiro da Caveira</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 rounded-full border border-zinc-700 shadow-lg">
                    <Brain size={20} className="text-emerald-500" />
                    <span className="text-sm font-bold text-zinc-300">Contexto: <span className="text-white">Concurso BB 2027</span></span>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-6 scrollbar-thin scrollbar-thumb-berserk-red/30 scrollbar-track-transparent relative z-10">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] md:max-w-[75%] space-y-3`}>
                            <div className={`p-8 rounded-2xl text-lg leading-relaxed border relative shadow-xl backdrop-blur-md
                                ${msg.sender === 'user'
                                    ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-white border-zinc-600 rounded-br-sm'
                                    : 'bg-gradient-to-br from-red-950/50 to-black text-zinc-100 border-berserk-red/40 rounded-bl-sm'}
                            `}>
                                {msg.sender === 'oracle' && <Skull size={20} className="absolute -top-4 -left-3 text-berserk-red bg-black rounded-full border border-berserk-red/50 p-1" />}
                                {msg.text}
                            </div>

                            {/* Interaction Bar for Oracle Messages */}
                            {msg.sender === 'oracle' && msg.canReward && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReward(msg.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-950/40 border border-emerald-500/40 rounded-full text-xs text-emerald-400 font-bold uppercase tracking-wider hover:bg-emerald-900/60 transition-colors ml-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                                >
                                    <Zap size={14} /> Insight Útil (+5 XP)
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-4 text-berserk-red/80 ml-2">
                        <Skull size={24} className="animate-pulse" />
                        <span className="text-sm uppercase tracking-widest font-bold">Forjando Resposta...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="mt-8 relative z-10">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Peça orientação para o Exame..."
                        className="w-full bg-black/80 border border-zinc-700 p-6 pl-8 pr-20 rounded-2xl text-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-berserk-red focus:ring-1 focus:ring-berserk-red transition-all shadow-2xl group-hover:border-zinc-600"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-4 top-4 p-3 bg-berserk-red text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        <Send size={24} />
                    </button>
                </div>
                <p className="text-center text-xs text-zinc-500 mt-4 uppercase tracking-[0.2em] font-bold">
                    "Lute, Desafie e Erga-se para Lutar novamente."
                </p>
            </div>
        </div>
    );
};

export default OracleView;
