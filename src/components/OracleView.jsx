import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Skull, Send, Sparkles, Brain, Zap } from 'lucide-react';

const OracleView = ({ userProfile, onAddXp, onCommand }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'oracle',
            text: `Saudações, Ítalo. Vejo que você luta no Brasal, mas seus olhos estão fixos no Eclipse de 2027 (Banco do Brasil). O caminho é estreito. Pergunte, e eu iluminarei as sombras da Matemática Financeira e do Português.`
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
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

    const handleSend = (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // 1. Check for Command Action first
        let responseText = null;
        if (onCommand) {
            responseText = onCommand(textToSend);
        }

        // 2. If no command matched, generate standard AI response
        if (!responseText) {
            responseText = generateResponse(textToSend);
        }

        // Simulated Typing Effect
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'oracle', text: responseText, canReward: true }]);
        }, 2000);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Seu navegador não suporta reconhecimento de voz.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(transcript); // Auto-send on voice
        };

        recognition.start();
    };

    const handleReward = (msgId) => {
        onAddXp(5);
        // Disable reward for this message
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, canReward: false } : m));
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto relative overflow-hidden">

            {/* BACKGROUND SYMBOL */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Skull size={400} strokeWidth={0.5} />
            </div>

            {/* HEADER */}
            <header className="flex items-center justify-between mb-8 z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-900/80 border border-berserk-gold/30 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        <Sparkles className="text-berserk-gold" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wider drop-shadow-md">Oráculo do Abismo</h1>
                        <div className="w-full h-[1px] bg-gradient-to-r from-berserk-gold to-transparent mt-1"></div>
                    </div>
                </div>
            </header>

            {/* CHAT AREA (SCROLL) */}
            <div className="flex-1 glass-card rounded-t-2xl border-b-0 p-6 overflow-y-auto space-y-6 relative custom-scrollbar">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border 
                            ${msg.sender === 'oracle' ? 'bg-zinc-900 border-berserk-gold text-berserk-gold' : 'bg-red-900/20 border-berserk-red text-white'}`}>
                            {msg.sender === 'oracle' ? <Skull size={20} /> : <div className="text-xs font-bold">EU</div>}
                        </div>

                        {/* Bubble */}
                        <div className={`max-w-[80%] p-4 rounded-xl border text-sm md:text-base leading-relaxed shadow-lg
                            ${msg.sender === 'oracle'
                                ? 'bg-zinc-900/90 border-berserk-gold/20 text-berserk-text font-serif'
                                : 'bg-berserk-red/10 border-berserk-red/30 text-white font-sans'}`}
                        >
                            <p>{msg.text}</p>
                            {/* Reward Button for Oracle Messages */}
                            {msg.sender === 'oracle' && msg.canReward && (
                                <button
                                    onClick={() => handleReward(msg.id)}
                                    className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-widest text-berserk-gold hover:text-white transition-colors"
                                >
                                    <Sparkles size={12} /> Reivindicar Sabedoria (+5 XP)
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-zinc-900 border border-berserk-gold text-berserk-gold">
                            <Skull size={20} className="animate-pulse" />
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 text-zinc-500 text-sm font-serif italic animate-pulse">
                            O Oráculo consulta as sombras...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* INPUT ALTAR */}
            <div className="glass-card rounded-b-2xl border-t-0 p-4 z-20">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Insculpam sua dúvida ou comando (ex: 'Gastei 50')..."
                        className="w-full bg-zinc-900/80 border border-berserk-border text-white placeholder-zinc-600 p-4 pl-6 rounded-xl focus:outline-none focus:border-berserk-gold transition-colors font-serif"
                    />
                    <button
                        onClick={() => handleSend()}
                        className="absolute right-2 p-3 bg-berserk-gold/10 hover:bg-berserk-gold/20 text-berserk-gold rounded-lg transition-colors"
                    >
                        <Send size={20} />
                    </button>
                    <button
                        onClick={startListening}
                        className={`absolute right-14 p-3 rounded-lg transition-colors ${isListening ? 'bg-berserk-red text-white animate-pulse' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                    >
                        <Zap size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OracleView;
