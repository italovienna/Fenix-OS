import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { Play, Pause, Volume2 } from 'lucide-react';

const GlobalAudioPlayer = () => {
    const { isPlaying, toggleAudio, volume, setVolume } = useAudio();

    return (
        <div className="fixed bottom-6 right-20 z-50 flex items-center gap-2 group bg-zinc-900/80 backdrop-blur-md border border-berserk-border py-2 px-4 rounded-full shadow-lg transition-all hover:border-berserk-red/50">

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
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors
                    ${isPlaying ? 'text-berserk-red animate-pulse' : 'text-zinc-500 hover:text-white'}`}
            >
                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                {isPlaying ? 'Lofi On' : 'Lofi Off'}
            </button>
        </div>
    );
};

export default GlobalAudioPlayer;
