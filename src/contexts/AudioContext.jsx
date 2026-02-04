import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    // Using a reliable Lofi URL (Pixabay or similar high quality free source)
    const audioRef = useRef(new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'));

    useEffect(() => {
        // Init settings
        const audio = audioRef.current;
        audio.loop = true;
        audio.volume = volume;

        return () => {
            audio.pause();
        };
    }, []);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Audio playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <AudioContext.Provider value={{ isPlaying, toggleAudio, volume, setVolume }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
