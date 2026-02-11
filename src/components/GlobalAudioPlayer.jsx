import React, { useState } from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, Volume2, Minus, Maximize2, Headphones, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalAudioPlayer = () => {
    const { isPlaying, toggleAudio, volume, setVolume } = useAudio();
    const [isExpanded, setIsExpanded] = useState(false);

    // --- MOBILE: TOP-RIGHT HEADPHONES BUTTON (< md) ---
    // Moved to TOP-RIGHT to clear the bottom navigation area completely.
    const MobilePlayer = () => (
        <AnimatePresence>
            {!isExpanded ? (
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={() => setIsExpanded(true)}
                    className={`md:hidden fixed top-[60px] right-4 z-[90] w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border transition-all duration-300
                        ${isPlaying
                            ? 'bg-black/60 border-berserk-red/50 shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                            : 'bg-zinc-900/80 border-white/10'}`}
                >
                    {/* Icon */}
                    <Headphones size={18} className={isPlaying ? 'text-berserk-red animate-pulse' : 'text-zinc-400'} />
                </motion.button>
            ) : (
                /* EXPANDED MOBILE OVERLAY */
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={`md:hidden fixed top-[60px] right-4 z-[120] w-64 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col items-center gap-4`}
                >
                    <div className="flex w-full justify-between items-center mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Lofi Player</span>
                        <button onClick={() => setIsExpanded(false)} className="text-zinc-500 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="relative">
                        {/* Cassette Animation */}
                        <div className={`w-20 h-20 rounded-full border-2 border-berserk-red/30 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <div className="w-2 h-2 bg-berserk-red rounded-full" />
                            <div className="absolute w-full h-[1px] bg-berserk-red/20 rotate-45" />
                            <div className="absolute w-full h-[1px] bg-berserk-red/20 -rotate-45" />
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-berserk-red font-mono animate-pulse">{isPlaying ? 'Tocando Beats...' : 'Pausado'}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full justify-center">
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-berserk-red"
                        />
                        <button onClick={toggleAudio} className="w-10 h-10 rounded-full bg-berserk-red text-white flex items-center justify-center shadow-glow-red-strong hover:scale-105 transition-transform shrink-0">
                            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // --- DESKTOP: FULL PLAYER ( > md ) ---
    const DesktopPlayer = () => (
        <div className={`hidden md:flex fixed bottom-6 right-6 z-[90] items-center gap-3 bg-zinc-900/90 backdrop-blur-xl border py-3 px-6 rounded-2xl shadow-2xl transition-all duration-500 group
            ${isPlaying
                ? 'border-berserk-red/50 shadow-[0_0_30px_rgba(220,38,38,0.4)]'
                : 'border-zinc-700 hover:border-berserk-red/30'
            }`}
        >
            {/* Cassette Wheels */}
            <div className="relative flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full border-2 border-berserk-red/60 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <div className="w-2 h-2 bg-berserk-red/40 rounded-full" />
                    <div className="absolute w-3 h-[1px] bg-berserk-red/60 rotate-45" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 border-berserk-red/60 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <div className="w-2 h-2 bg-berserk-red/40 rounded-full" />
                    <div className="absolute w-3 h-[1px] bg-berserk-red/60 rotate-45" />
                </div>
            </div>

            {/* Volume Control */}
            <div className="w-0 overflow-hidden group-hover:w-24 transition-all duration-500 flex items-center">
                <input
                    type="range"
                    min="0" max="1" step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-berserk-red"
                />
            </div>

            <button
                onClick={toggleAudio}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-500
                    ${isPlaying ? 'text-berserk-red' : 'text-zinc-500 hover:text-white'}`}
            >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                {isPlaying ? 'Lofi On' : 'Lofi Off'}
            </button>
        </div>
    );

    return (
        <>
            <MobilePlayer />
            <DesktopPlayer />
        </>
    );
};

export default GlobalAudioPlayer;
