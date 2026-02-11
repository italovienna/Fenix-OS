import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, Volume2 } from 'lucide-react';

const GlobalAudioPlayer = () => {
    const { isPlaying, toggleAudio, volume, setVolume } = useAudio();

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 backdrop-blur-xl border py-3 px-6 rounded-2xl shadow-lg transition-all duration-500 group
            ${isPlaying
                ? 'lofi-active border-berserk-red/50 shadow-[0_0_30px_rgba(220,38,38,0.4)]'
                : 'border-zinc-700 hover:border-berserk-red/30'
            }`}
        >
            {/* Cassette Wheel (Visual Indicator) */}
            <div className="relative flex items-center gap-2">
                {/* Left Wheel */}
                <div className={`w-6 h-6 rounded-full border-2 border-berserk-red/60 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <div className="w-2 h-2 bg-berserk-red/40 rounded-full" />
                    <div className="absolute w-3 h-[1px] bg-berserk-red/60 rotate-45" />
                    <div className="absolute w-3 h-[1px] bg-berserk-red/60 -rotate-45" />
                </div>

                {/* Right Wheel */}
                <div className={`w-6 h-6 rounded-full border-2 border-berserk-red/60 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'animate-spin-slow' : ''}`}>
                    <div className="w-2 h-2 bg-berserk-red/40 rounded-full" />
                    <div className="absolute w-3 h-[1px] bg-berserk-red/60 rotate-45" />
                    <div className="absolute w-3 h-[1px] bg-berserk-red/60 -rotate-45" />
                </div>
            </div>

            {/* Volume Control (Reveals on Hover) */}
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
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-500 lofi-text
                    ${isPlaying ? 'text-berserk-red' : 'text-zinc-500 hover:text-white'}`}
            >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                {isPlaying ? 'Lofi On' : 'Lofi Off'}
            </button>
        </div>
    );
};

export default GlobalAudioPlayer;

