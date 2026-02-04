import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const XPChart = ({ xpHistory }) => {
    // Generate mock data if history is empty (for visualization)
    const data = useMemo(() => {
        if (xpHistory && xpHistory.length > 0) return xpHistory;

        // Mock curve for demo "The Rise of the Hawk"
        return [
            { day: '1', xp: 0 }, { day: '5', xp: 50 }, { day: '10', xp: 120 },
            { day: '15', xp: 200 }, { day: '20', xp: 250 }, { day: '25', xp: 400 },
            { day: '30', xp: 480 }
        ];
    }, [xpHistory]);

    return (
        <div className="w-full h-32 bg-zinc-900/20 backdrop-blur-sm border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-2 left-4 z-10">
                <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Progresso do Mês (XP)</h4>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #333', borderRadius: '4px', fontSize: '12px' }}
                        itemStyle={{ color: '#dc2626' }}
                        cursor={{ stroke: '#333', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="xp"
                        stroke="#dc2626"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorXp)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default XPChart;
