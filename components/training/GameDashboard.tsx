'use client';

import { useState } from 'react';
import { GameSession, GameType } from '@/lib/types';
import ProgressChart from './ProgressChart';
import Link from 'next/link';
import {
    Brain, Zap, LayoutGrid, Type, Trophy, Flame,
    Activity, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GAMES, GameConfig } from '@/lib/gameData';

interface GameDashboardProps {
    sessions: GameSession[];
    activeGames: GameConfig[];
}

export default function GameDashboard({ sessions, activeGames }: GameDashboardProps) {
    const [selectedGameForChart, setSelectedGameForChart] = useState<GameType>('memory_match');

    // Calculate Stats
    const totalSessions = sessions.length;
    // Calculate Streak (Mock for visual as clinical tracking is new)
    const streak = 3;

    const recentSessions = [...sessions].sort((a, b) =>
        new Date(b.session_date!).getTime() - new Date(a.session_date!).getTime()
    ).slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                            <Flame className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Weekly Streak</p>
                            <h3 className="text-2xl font-bold text-gray-900">{streak} Days</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900">{totalSessions}</h3>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Achievements</p>
                            <h3 className="text-2xl font-bold text-gray-900">4 Unlocked</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Game List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">Recommended Exercises</h2>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {activeGames.map((game) => {
                            const Icon = game.icon;
                            return (
                                <Link
                                    key={game.id}
                                    href={`/training/${game.id}`}
                                    className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:border-blue-300"
                                >
                                    <div className={cn("absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-20%] rounded-full opacity-10 transition-transform group-hover:scale-150", game.color)} />

                                    <div className="relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", game.bgLight, game.textColor)}>
                                                <Icon className="h-7 w-7" />
                                            </div>
                                            <span className="px-2 py-1 rounded bg-gray-100 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                                                {game.cognitiveDomain}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {game.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                            {game.description}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                                            Start Exercise <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Progress Chart & Recent */}
                <div className="space-y-8">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Progress</h3>
                            <select
                                className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-900"
                                value={selectedGameForChart}
                                onChange={(e) => setSelectedGameForChart(e.target.value as GameType)}
                            >
                                {GAMES.map(g => <option key={g.id} value={g.id} className="text-gray-900">{g.name}</option>)}
                            </select>
                        </div>
                        <ProgressChart data={sessions} gameType={selectedGameForChart} />
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 font-bold text-gray-900">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentSessions.length > 0 ? recentSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 capitalize">
                                                {session.game_type.replace('_', ' ')}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(session.session_date!).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900 whitespace-nowrap">{session.score} pts</span>
                                </div>
                            )) : (
                                <div className="py-4 text-center text-sm text-gray-400">
                                    No recent games played.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
