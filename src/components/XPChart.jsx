import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useXp } from '../contexts/XpContext';

const XPChart = () => {
    const { xpHistory } = useXp();

    const { data, isGhost } = useMemo(() => {
        const hasData = xpHistory && xpHistory.length > 0 && xpHistory.some(h => h.xp > 0);

        // 1. REAL DATA STRATEGY
        if (hasData) {
            const result = [];
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const historyEntry = xpHistory.find(h => h.date === dateStr);

                result.push({
                    date: dateStr,
                    day: d.getDate(),
                    xp: historyEntry ? historyEntry.xp : 0,
                    projected: historyEntry ? historyEntry.xp : 0, // Keep mostly aligned for real data
                });
            }
            return { data: result, isGhost: false };
        }

        // 2. GHOST DATA STRATEGY (Empty State)
        // Generate an organic sine-wave + noise pattern for cosmetic purposes
        const ghost = [];
        const today = new Date();
        let baseValue = 500; // Starting ghost XP

        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            // Organic random walk
            const noise = Math.random() * 300 - 100; // -100 to +200
            baseValue = Math.max(100, baseValue + noise);

            ghost.push({
                date: d.toISOString().split('T')[0],
                day: d.getDate(),
                xp: Math.round(baseValue),
                projected: Math.round(baseValue * 1.1), // Slightly higher 'potential'
            });
        }
        return { data: ghost, isGhost: true };
    }, [xpHistory]);

    return (
        <div className="w-full h-full min-h-[300px] relative bg-black/60 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.15)] backdrop-blur-sm border border-white/5">
            {isGhost && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-zinc-500 font-bold backdrop-blur-md">
                    Exemplo de Visualização
                </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        {/* 3D Topographical Gradient - Multi-Layer Depth */}
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.9} />
                            <stop offset="50%" stopColor="#7f1d1d" stopOpacity={0.5} />
                            <stop offset="100%" stopColor="#4a0000" stopOpacity={0.1} />
                        </linearGradient>

                        {/* Ghost Projection Gradient */}
                        <linearGradient id="colorGhost" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#333" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#333" stopOpacity={0} />
                        </linearGradient>

                        {/* Enhanced Neon Glow + Shadow Filter */}
                        <filter id="glow" height="300%" width="300%" x="-75%" y="-75%">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#dc2626" floodOpacity="0.5" result="dropShadow" />
                            <feMerge>
                                <feMergeNode in="dropShadow" />
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* No Grid Lines - Clean minimal look */}
                    <CartesianGrid vertical={false} horizontal={false} opacity={0} />

                    <XAxis
                        dataKey="day"
                        stroke="#525252"
                        tick={{ fill: isGhost ? '#555' : '#888', fontSize: 10, fontFamily: 'monospace' }}
                        tickLine={false}
                        axisLine={false}
                        interval={4}
                        dy={10}
                    />
                    <YAxis hide />

                    <Tooltip
                        cursor={{ stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
                        content={({ active, payload, coordinate }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-black/90 backdrop-blur-xl border border-berserk-red/50 text-white p-3 rounded-xl flex items-center gap-3 shadow-[0_0_25px_rgba(220,38,38,0.6)] transform -translate-x-1/2 -translate-y-full mb-4 z-50">
                                        {/* Enhanced Spirit Orb */}
                                        <div className="w-3 h-3 bg-berserk-red rounded-full animate-pulse shadow-[0_0_20px_#dc2626]"></div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none">Dia {payload[0].payload.day}</p>
                                            <p className="text-lg font-bold font-sans leading-none mt-1">
                                                {payload[0].value} XP {isGhost && <span className="text-[10px] font-normal opacity-50 ml-1">(Simulado)</span>}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    {/* Ghost Line (Background context) */}
                    <Area
                        type="monotone"
                        dataKey="projected"
                        stroke="#333"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                        fill="url(#colorGhost)"
                        animationDuration={2000}
                        isAnimationActive={true}
                    />

                    {/* Actual XP - Enhanced 3D Neon Effect */}
                    <Area
                        type="monotone"
                        dataKey="xp"
                        stroke={isGhost ? "#7f1d1d" : "#dc2626"} // Darker red for ghost data
                        strokeWidth={isGhost ? 2 : 3}
                        fill="url(#colorXp)"
                        filter="url(#glow)"
                        animationDuration={2000}
                        isAnimationActive={true}
                        activeDot={{ r: 6, fill: '#dc2626', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 10px #dc2626)' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};


export default XPChart;
