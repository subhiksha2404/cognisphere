'use client';

import { Memory } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useMemo } from 'react';

interface MemoryInsightsProps {
    memories: Memory[];
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

export default function MemoryInsights({ memories }: MemoryInsightsProps) {

    // 1. Category Data
    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        memories.forEach(m => {
            counts[m.category] = (counts[m.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [memories]);

    // 2. Monthly Frequency (Last 12 months)
    const timelineData = useMemo(() => {
        const counts: Record<string, number> = {};
        // Initialize recent months? Or just group existing
        memories.forEach(m => {
            const key = new Date(m.date).toLocaleString('default', { month: 'short', year: '2-digit' });
            counts[key] = (counts[key] || 0) + 1;
        });

        // Sort keys chronologically? Complex logic, skipping sort for simplicity or simple object keys
        // Just map entries
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [memories]);

    // 3. Common Tags
    const tagCloud = useMemo(() => {
        const counts: Record<string, number> = {};
        memories.forEach(m => {
            m.tags.forEach(t => {
                const tag = t.trim();
                if (tag) counts[tag] = (counts[tag] || 0) + 1;
            });
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }, [memories]);

    if (memories.length === 0) return <div className="p-8 text-center text-gray-500">Not enough data for insights.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Distribution */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {categoryData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{entry.name} ({entry.value})</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Memory Frequency</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timelineData}>
                            <XAxis dataKey="name" fontSize={10} stroke="#9CA3AF" />
                            <YAxis hide />
                            <Tooltip cursor={{ fill: '#EFF6FF' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Tags */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                <h3 className="font-bold text-gray-800 mb-4">Common Themes</h3>
                <div className="flex flex-wrap gap-2 content-start flex-1">
                    {tagCloud.map(([tag, count], i) => (
                        <span
                            key={tag}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2"
                            style={{ fontSize: Math.max(0.8, 1 + (count / 10)) + 'rem' }}
                        >
                            #{tag}
                            <span className="text-xs bg-gray-200 px-1.5 rounded-full">{count}</span>
                        </span>
                    ))}
                    {tagCloud.length === 0 && <p className="text-gray-400 text-sm">Add tags to your memories to see themes here.</p>}
                </div>
            </div>
        </div>
    );
}
