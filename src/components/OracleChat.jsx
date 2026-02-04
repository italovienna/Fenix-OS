import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Send, X, MessageSquare, Sparkles } from 'lucide-react';

const OracleChat = ({ userProfile, onAddXp }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'oracle', text: "Struggler... I am the Skull Knight. Ask, and I shall guide your path to the Eclipse. (Banco do Brasil 2027)" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [questionsAsked, setQuestionsAsked] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Mock AI Response Logic (The Skull Knight Persona)
    const generateResponse = (query) => {
        const lowerQ = query.toLowerCase();

        if (lowerQ.includes('banco') || lowerQ.includes('bb'))
            return "The path to the Bank is paved with 'Conhecimentos Bancários'. Master the 2021 Edital. Do not falter.";
        if (lowerQ.includes('investimento') || lowerQ.includes('dinheiro'))
            return "Gold is fleeting. True wealth is the strength to defy causality. But compounding interest... that is a powerful sword.";
        if (lowerQ.includes('estudar') || lowerQ.includes('foco'))
            return "Your mind wanders? Focus. The Beast of Darkness waits for your weakness. Pomodoro is your shield.";
        if (lowerQ.includes('ola') || lowerQ.includes('oi'))
            return "Greetings, Struggler.";

        return "Causality flows... I sense your ambition. But be specific. What knowledge do you seek?";
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Delay
        setTimeout(() => {
            const responseText = generateResponse(userMsg.text);
            const oracleMsg = { id: Date.now() + 1, sender: 'oracle', text: responseText };
            setMessages(prev => [...prev, oracleMsg]);
            setIsTyping(false);

            // XP Logic: Reward for 3 meaningful interactions
            const newCount = questionsAsked + 1;
            setQuestionsAsked(newCount);
            if (newCount === 3) {
                onAddXp(15);
            }
        }, 1500);
    };

    return (
        <>
            {/* Floating Action Button (The Behelit/Skull) */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border-2 border-berserk-red transition-all
                    ${isOpen ? 'bg-berserk-red text-white scale-0 opacity-0 pointer-events-none' : 'bg-black/80 text-berserk-red backdrop-blur-md'}
                `}
            >
                <Skull size={32} />
                {/* Notification Dot */}
                <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] h-[500px] flex flex-col rounded-2xl border-2 border-berserk-red/50 bg-zinc-950/90 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-berserk-red/30 flex justify-between items-center bg-gradient-to-r from-red-950/50 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-berserk-red/20 rounded-full border border-berserk-red/60 box-shadow-pulse">
                                    <Skull size={20} className="text-berserk-red" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold uppercase tracking-wider text-sm">The Oracle</h3>
                                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Skull Knight AI</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-berserk-red/30 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed border
                                            ${msg.sender === 'user'
                                                ? 'bg-berserk-red text-white border-red-700 rounded-br-none'
                                                : 'bg-zinc-900/80 text-zinc-300 border-zinc-700 rounded-bl-none shadow-lg'}
                                        `}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-zinc-900/80 p-3 rounded-xl rounded-bl-none border border-zinc-700 flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask the Skull Knight..."
                                    className="flex-1 bg-zinc-900/60 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-berserk-red transition-colors placeholder:text-zinc-600"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isTyping}
                                    className="bg-berserk-red hover:bg-red-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            {questionsAsked < 3 && (
                                <div className="mt-2 flex items-center gap-2 justify-center">
                                    <Sparkles size={10} className="text-yellow-500" />
                                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">
                                        XP Reward Progress: <span className="text-white">{questionsAsked}/3</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default OracleChat;
