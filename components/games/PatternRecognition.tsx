'use client';

import { useState, useEffect } from 'react';
import { GameDifficulty, GameSession } from '@/lib/types';
import { LayoutGrid, CheckCircle, XCircle, Play, Trophy, RotateCcw, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import HintSystem from '../training/HintSystem';

interface PatternRecognitionProps {
    difficulty: GameDifficulty;
    onComplete: (session: Partial<GameSession>) => void;
}

export default function PatternRecognition({ difficulty, onComplete }: PatternRecognitionProps) {
    const [grid, setGrid] = useState<boolean[]>([]);
    const [playerGrid, setPlayerGrid] = useState<boolean[]>([]);
    const [phase, setPhase] = useState<'IDLE' | 'SHOW' | 'INPUT' | 'RESULT'>('IDLE');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(0);
    const [hintActive, setHintActive] = useState<string | null>(null);

    const size = difficulty === 'Hard' ? 5 : difficulty === 'Medium' ? 4 : 3;
    const totalCells = size * size;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (phase !== 'IDLE') {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [phase]);

    const startRound = () => {
        const newGrid = Array(totalCells).fill(false);
        const cellsToHighlight = Math.min(totalCells - 2, 2 + level);
        let count = 0;
        while (count < cellsToHighlight) {
            const idx = Math.floor(Math.random() * totalCells);
            if (!newGrid[idx]) {
                newGrid[idx] = true;
                count++;
            }
        }
        setGrid(newGrid);
        setPlayerGrid(Array(totalCells).fill(false));
        setPhase('SHOW');
        setHintActive(null);

        const showTime = Math.max(1500, 3000 - (level * 200));
        setTimeout(() => setPhase('INPUT'), showTime);
    };

    const handleCellClick = (idx: number) => {
        if (phase !== 'INPUT') return;
        const nextGrid = [...playerGrid];
        nextGrid[idx] = !nextGrid[idx];
        setPlayerGrid(nextGrid);
    };

    const handleSubmit = () => {
        const isCorrect = grid.every((val, i) => val === playerGrid[i]);
        if (isCorrect) {
            setScore(prev => prev + (level * 150));
            setLevel(prev => prev + 1);
            setPhase('RESULT');
            setTimeout(startRound, 2000);
        } else {
            setPhase('RESULT');
            // In clinical mode, we don't have "lives", just allow retry or finish
        }
    };

    const finishGame = () => {
        onComplete({
            game_type: 'pattern_recognition',
            difficulty,
            score,
            time_taken: timer,
            accuracy: Math.round((level / (level || 1)) * 100)
        });
    };

    const requestHint = () => {
        if (phase !== 'INPUT') return;
        // Briefly show the pattern again
        setHintActive("Peek at the pattern...");
        const currentPhase = 'INPUT';
        setPhase('SHOW');
        setTimeout(() => {
            setPhase(currentPhase);
            setHintActive(null);
        }, 800);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
            <HintSystem hint={hintActive} onDismiss={() => setHintActive(null)} />

            {/* HUD */}
            <div className="flex w-full justify-between items-center rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div>
                    <p className="text-xs font-bold uppercase text-gray-400">Round</p>
                    <p className="text-xl font-bold text-blue-600">{level}</p>
                </div>
                <div className="flex flex-col items-center">
                    <button
                        onClick={requestHint}
                        disabled={phase !== 'INPUT'}
                        className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 disabled:opacity-50"
                    >
                        <Lightbulb className="h-3 w-3" /> Pattern Peek
                    </button>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex flex-col items-center gap-6">
                <div
                    className={cn(
                        "grid gap-2 p-4 bg-slate-100 rounded-2xl shadow-inner",
                        size === 3 ? "grid-cols-3" : size === 4 ? "grid-cols-4" : "grid-cols-5"
                    )}
                >
                    {(phase === 'SHOW' ? grid : playerGrid).map((active, i) => (
                        <button
                            key={i}
                            onClick={() => handleCellClick(i)}
                            disabled={phase !== 'INPUT'}
                            className={cn(
                                "aspect-square rounded-lg transition-all duration-300",
                                size === 3 ? "w-20" : size === 4 ? "w-16" : "w-12",
                                active
                                    ? "bg-blue-600 shadow-md transform scale-95"
                                    : "bg-white hover:bg-blue-50"
                            )}
                        />
                    ))}
                </div>

                {phase === 'INPUT' && (
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                    >
                        Confirm Pattern
                    </button>
                )}

                {phase === 'RESULT' && (
                    <div className="text-center animate-in zoom-in duration-300">
                        {grid.every((val, i) => val === playerGrid[i]) ? (
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                <CheckCircle className="h-6 w-6" /> Matches!
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 text-amber-600 font-bold">
                                    <XCircle className="h-6 w-6" /> Not quite...
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={startRound} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold">Try Another</button>
                                    <button onClick={() => setPhase('IDLE')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">I&apos;m Done</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {phase === 'IDLE' && (
                    <div className="text-center mt-4">
                        <LayoutGrid className="mx-auto h-12 w-12 text-blue-200 mb-4" />
                        <button
                            onClick={() => { setScore(0); setLevel(1); setTimer(0); startRound(); }}
                            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Play className="h-5 w-5" /> {score > 0 ? "Restart Exercise" : "Begin Exercise"}
                        </button>
                    </div>
                )}
            </div>

            {/* Completion Overlay */}
            {phase === 'IDLE' && score > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                <Trophy className="h-8 w-8" />
                            </div>
                        </div>
                        <h2 className="text-center text-2xl font-bold text-gray-900">Great Job!</h2>
                        <p className="mt-2 text-center text-gray-600">You completed {level - 1} patterns.</p>
                        <div className="mt-8 flex gap-3">
                            <button onClick={startRound} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold hover:bg-gray-50">
                                <RotateCcw className="h-4 w-4" /> Replay
                            </button>
                            <button onClick={finishGame} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                                Save & Finish <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
