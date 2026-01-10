'use client';

import { useState, useEffect } from 'react';
import GameDashboard from '@/components/training/GameDashboard';
import type { GameSession, ClinicalDiseaseType } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { GAMES, DISEASE_TABS } from '@/lib/gameData';
import { cn } from '@/lib/utils';

export default function TrainingPage() {
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<ClinicalDiseaseType>('Alzheimers');

    useEffect(() => {
        // ... (existing fetch logic) ...
        async function fetchHistory() {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                console.log("Fetching sessions for User ID:", user.id);
                // Should we filter by disease type in future? For now, fetch all.
                const { data, error } = await supabase
                    .from('cognitive_training_sessions')
                    .select('*')
                    .eq('patient_id', user.id)
                    .order('session_date', { ascending: false });

                if (data) {
                    setSessions(data as GameSession[]);
                }
            }
            setLoading(false);
        }
        fetchHistory();
    }, [searchParams]);

    const activeGames = GAMES.filter(g => g.supportedDiseases.includes(activeTab));

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Clinical Cognitive Support</h1>
                    <p className="mt-2 text-gray-600 max-w-3xl">
                        Therapeutic exercises designed to support specific cognitive domains.
                        Select a support path below to see recommended activities.
                    </p>
                </div>

                {/* Disease Tabs */}
                <div className="mb-10">
                    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
                        {DISEASE_TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn( // Use standard conditional class helper
                                    "px-6 py-3 font-bold text-sm rounded-t-xl transition-all border-b-2",
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600 bg-white shadow-sm"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {/* Tab Description Context */}
                    <div className="bg-white p-6 rounded-b-xl rounded-tr-xl border border-gray-100 shadow-sm mb-8 mt-[-1px]">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{DISEASE_TABS.find(t => t.id === activeTab)?.label} Support</h3>
                        <p className="text-gray-600">{DISEASE_TABS.find(t => t.id === activeTab)?.description}</p>
                    </div>
                </div>

                <GameDashboard sessions={sessions} activeGames={activeGames} />

                <div className="mt-16 text-center border-t border-gray-200 pt-8">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Medical Disclaimer</p>
                    <p className="text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
                        These exercises support cognitive engagement and are not a substitute for medical treatment.
                        Please consult your healthcare provider for clinical advice.
                    </p>
                </div>
            </div>
        </div>
    );
}

// End of file
