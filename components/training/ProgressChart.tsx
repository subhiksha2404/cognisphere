'use client';

import { GameSession, GameType } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns'; // Would need date-fns, but can use native Intl

interface ProgressChartProps {
    data: GameSession[];
    gameType: GameType;
}

export default function ProgressChart({ data, gameType }: ProgressChartProps) {
    // Filter and sort data
    const chartData = data
        .filter(session => session.game_type === gameType)
        .sort((a, b) => new Date(a.session_date!).getTime() - new Date(b.session_date!).getTime())
        .map(session => ({
            date: new Date(session.session_date!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
            score: session.score,
            accuracy: session.accuracy
        }));

    if (chartData.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400">
                No data available for this game yet.
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ fill: '#2563EB', r: 4, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
