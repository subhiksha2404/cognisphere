'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { GameDifficulty, GameSession, GameType } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Play } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Dynamically import games or just import normally since they are client components
import MemoryMatch from '@/components/games/MemoryMatch';
import SequenceRecall from '@/components/games/SequenceRecall';
import PatternRecognition from '@/components/games/PatternRecognition';
import WordAssociation from '@/components/games/WordAssociation';
import WellnessCheckModal from '@/components/training/WellnessCheckModal';
import SupportPanel from '@/components/training/SupportPanel';

const GAME_INFO = {
    'memory_match': { title: 'Memory Match', Description: 'Flip cards to find pairs.' },
    'sequence_recall': { title: 'Sequence Recall', Description: 'Memorize number sequences.' },
    'pattern_recognition': { title: 'Pattern Recognition', Description: 'Recreate grid patterns.' },
    'word_association': { title: 'Word Association', Description: 'Type related words.' }
};

type WellnessData = { stress: number; energy: number; tired: boolean };

export default function GamePage() {
    const params = useParams();
    const router = useRouter();
    const gameId = params.id as GameType;

    const [difficulty, setDifficulty] = useState<GameDifficulty | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [, setDebugInfo] = useState<string>('');

    // Clinical Flow States
    const [showPreCheck, setShowPreCheck] = useState(false);
    const [showPostCheck, setShowPostCheck] = useState(false);
    const [, setPreCheckData] = useState<WellnessData | null>(null);
    const [completedSessionData, setCompletedSessionData] = useState<Partial<GameSession> | null>(null);

    const GameComponent = {
        'memory_match': MemoryMatch,
        'sequence_recall': SequenceRecall,
        'pattern_recognition': PatternRecognition,
        'word_association': WordAssociation
    }[gameId];

    // If invalid game ID
    if (!GameComponent || !GAME_INFO[gameId]) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Game Not Found</h1>
                    <Link href="/training" className="text-blue-600 hover:underline">Back to Training</Link>
                </div>
            </div>
        );
    }

    const saveWellnessCheck = async (data: WellnessData, type: 'Pre-Session' | 'Post-Session') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('wellness_checkins').insert({
            patient_id: user.id,
            checkin_type: type,
            stress_level: data.stress,
            energy_level: data.energy,
            feeling_tired: data.tired
        });
    };

    const handleDifficultySelect = (level: GameDifficulty) => {
        setDifficulty(level);
        setShowPreCheck(true); // Trigger Pre-Check
    };

    const handlePreCheckComplete = async (data: WellnessData) => {
        setPreCheckData(data);
        setShowPreCheck(false);
        await saveWellnessCheck(data, 'Pre-Session');
    };

    const handleGameComplete = (sessionData: Partial<GameSession>) => {
        setCompletedSessionData(sessionData);
        setShowPostCheck(true); // Trigger Post-Check
    };

    const saveFullSession = async (postCheckData: WellnessData) => {
        setSaveError(null);
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                setSaveError("User not authenticated.");
                return;
            }

            if (!completedSessionData) return;

            const payload = {
                patient_id: user.id,
                game_type: gameId,
                difficulty: difficulty || 'Medium',
                score: completedSessionData.score,
                time_taken: completedSessionData.time_taken,
                accuracy: completedSessionData.accuracy,
                // Clinical Fields
                fatigue_reported: postCheckData.tired,
                performance_trend: 'Stable', // Mock logic for now
            };

            const { error } = await supabase
                .from('cognitive_training_sessions')
                .insert(payload);

            if (error) {
                console.error('Save Error:', error);
                throw error;
            }

            // Success
            router.refresh();
            setTimeout(() => {
                router.push(`/training?updated=${Date.now()}`);
            }, 1500);

        } catch (err) {
            console.error('Failed to save session:', err);
            setSaveError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePostCheckComplete = async (data: WellnessData) => {
        setIsSaving(true);
        setShowPostCheck(false);
        await saveWellnessCheck(data, 'Post-Session');
        await saveFullSession(data); // Pass post-check data to session save
    };

    // Safety Timer
    useEffect(() => {
        let safetyTimer: NodeJS.Timeout;
        if (!showPreCheck && !showPostCheck && !isSaving && difficulty) {
            safetyTimer = setTimeout(() => {
                setDebugInfo("Safety Limit Reached - Suggesting Break");
                alert("You've been exercising for a while. Consider taking a short break to refresh!");
            }, 20 * 60 * 1000); // 20 minutes
        }
        return () => clearTimeout(safetyTimer);
    }, [showPreCheck, showPostCheck, isSaving, difficulty]);

    if (saveError) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-red-50">
                <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
                    <h2 className="text-red-600 text-xl font-bold mb-4">Save Failed</h2>
                    <p className="text-gray-700 mb-4">{saveError}</p>
                    <div className="flex gap-4">
                        <button onClick={() => router.push('/training')} className="px-4 py-2 bg-gray-200 rounded-lg font-bold">Back</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/training" className="flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Exit
                    </Link>
                    <div className="h-6 w-px bg-gray-200" />
                    <h1 className="text-lg font-bold text-gray-900">{GAME_INFO[gameId]?.title}</h1>
                    {difficulty && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {difficulty}
                        </span>
                    )}
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-6xl px-4 flex gap-6 relative">

                {/* Main Game Area */}
                <div className="flex-1">
                    {!difficulty ? (
                        // Difficulty Selection Screen
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-sm border border-gray-100 min-h-[400px]">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Intensity</h2>
                                <p className="text-gray-500">Choose a comfortable pace to begin.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
                                {(['Easy', 'Medium', 'Hard'] as GameDifficulty[]).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => handleDifficultySelect(level)}
                                        className="group relative flex flex-col items-center gap-4 rounded-xl border-2 border-gray-100 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-lg active:scale-95"
                                    >
                                        <div className={cn(
                                            "flex h-16 w-16 items-center justify-center rounded-full transition-colors",
                                            level === 'Easy' ? "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white" :
                                                level === 'Medium' ? "bg-yellow-100 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white" :
                                                    "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                                        )}>
                                            <Play className="h-8 w-8 ml-1" />
                                        </div>
                                        <span className="font-bold text-gray-900">{level}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : isSaving ? (
                        <div className="flex h-[400px] items-center justify-center rounded-2xl bg-white">
                            <div className="text-center">
                                <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600 mb-4" />
                                <p className="text-lg font-medium text-gray-600">Saving Session...</p>
                            </div>
                        </div>
                    ) : (
                        // Active Game
                        <div className="w-full relative">
                            {/* Game Component */}
                            <GameComponent difficulty={difficulty} onComplete={handleGameComplete} />
                        </div>
                    )}
                </div>

                {/* Side Support Panel - Visible Only During Gameplay */}
                {difficulty && !isSaving && !showPreCheck && !showPostCheck && (
                    <div className="hidden xl:block w-64 shrink-0">
                        {/* This renders fixed position in the component itself but we can wrap it or just place it here */}
                        <div className="sticky top-32">
                            {/* The SupportPanel component has 'fixed' positioning in its CSS. 
                                 We might need to adjust it to be relative if we want it in this flex layout. 
                                 Let's keep the component's internal styling for now, but strictly it might overlap.
                                 Actually the component uses fixed right-6. Let's just render it. */}
                            <SupportPanel />
                        </div>
                    </div>
                )}

            </div>

            {/* Modals */}
            {showPreCheck && (
                <WellnessCheckModal type="Pre-Session" onComplete={handlePreCheckComplete} />
            )}
            {showPostCheck && (
                <WellnessCheckModal type="Post-Session" onComplete={handlePostCheckComplete} />
            )}
        </div>
    );
}
