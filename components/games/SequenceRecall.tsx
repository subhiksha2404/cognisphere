'use client';

import { useState, useEffect } from 'react';
import { GameDifficulty, GameSession } from '@/lib/types';
import { EyeOff, CheckCircle, XCircle, Play, Trophy, RotateCcw, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import HintSystem from '../training/HintSystem';

interface SequenceRecallProps {
    difficulty: GameDifficulty;
    onComplete: (session: Partial<GameSession>) => void;
}

export default function SequenceRecall({ difficulty, onComplete }: SequenceRecallProps) {
    const [sequence, setSequence] = useState<string>('');
    const [input, setInput] = useState<string>('');
    const [phase, setPhase] = useState<'IDLE' | 'SHOW' | 'INPUT' | 'RESULT'>('IDLE');
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0); // Internal tracking only
    const [timer, setTimer] = useState(0);
    const [hintActive, setHintActive] = useState<string | null>(null);

    // Settings based on difficulty
    const flashConfig = {
        'Easy': 3000,
        'Medium': 2000,
        'Hard': 1000
    };
    const flashTime = flashConfig[difficulty];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (phase !== 'IDLE' && lives > 0) {
            interval = setInterval(() => setTimer(prev => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [phase, lives]);

    const startRound = () => {
        const length = 2 + level;
        let newSeq = '';
        for (let i = 0; i < length; i++) {
            newSeq += Math.floor(Math.random() * 10).toString();
        }
        setSequence(newSeq);
        setInput('');
        setPhase('SHOW');
        setHintActive(null);

        setTimeout(() => {
            setPhase('INPUT');
        }, flashTime + (length * 300)); // Increased buffer slightly for comfort
    };

    const handleGameOver = () => {
        setPhase('IDLE');
    };

    const handleInput = (char: string) => {
        if (phase !== 'INPUT') return;
        const newInput = input + char;
        setInput(newInput);

        // Auto-submit if length matches
        if (newInput.length === sequence.length) {
            if (newInput === sequence) {
                // Success
                setScore(prev => prev + (level * 100));
                setLevel(prev => prev + 1);
                setPhase('RESULT');
                setTimeout(startRound, 1500);
            } else {
                // Fail
                setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives === 0) {
                        handleGameOver();
                    } else {
                        setPhase('RESULT');
                        setTimeout(startRound, 2000); // Slower restart
                    }
                    return newLives;
                });
            }
        }
    };

    const finishGame = () => {
        onComplete({
            game_type: 'sequence_recall',
            difficulty,
            score: score,
            time_taken: timer,
            accuracy: Math.round((level / (level - (3 - lives))) * 100) || 50
        });
    };

    const requestHint = () => {
        if (phase !== 'INPUT') return;

        // Show the index match of current input length
        const indexToShow = input.length;
        if (indexToShow < sequence.length) {
            setHintActive(`Next number is: ${sequence[indexToShow]}`);
            setTimeout(() => setHintActive(null), 2000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
            <HintSystem hint={hintActive} onDismiss={() => setHintActive(null)} />

            {/* HUD */}
            <div className="flex w-full justify-between items-center rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div>
                    <p className="text-xs font-bold uppercase text-gray-500">Current Level</p>
                    <p className="text-xl font-bold text-blue-600">{level}</p>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase text-gray-500">Attempts</p>
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={cn("h-3 w-3 rounded-full", i < lives ? "bg-red-400" : "bg-gray-200")} />
                        ))}
                    </div>
                </div>
                <div>
                    {phase === 'INPUT' && (
                        <button onClick={requestHint} className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100">
                            Hint?
                        </button>
                    )}
                </div>
            </div>

            {/* Game Area */}
            <div className="relative flex h-48 w-full items-center justify-center rounded-2xl bg-slate-800 text-white shadow-xl overflow-hidden">

                {phase === 'IDLE' && (
                    <div className="text-center">
                        <Trophy className="mx-auto h-12 w-12 text-yellow-400 mb-2" />
                        {score > 0 ? (
                            <p className="mb-4 font-medium">Session Paused</p>
                        ) : (
                            <p className="mb-4 font-medium">Ready to Recall?</p>
                        )}
                        <button
                            onClick={() => { setScore(0); setLevel(1); setLives(3); setTimer(0); startRound(); }}
                            className="rounded-full bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-500 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Play className="h-5 w-5" /> {score > 0 ? "Play Again" : "Start"}
                        </button>
                    </div>
                )}

                {phase === 'SHOW' && (
                    <div className="animate-in zoom-in duration-300">
                        <span className="text-6xl font-black tracking-widest font-mono">{sequence}</span>
                    </div>
                )}

                {phase === 'INPUT' && (
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <EyeOff className="h-6 w-6 text-gray-400" />
                            <p className="text-sm text-gray-400">Recall the sequence</p>
                        </div>
                        <div className="text-4xl font-mono tracking-widest min-h-[3rem]">
                            {input.padEnd(sequence.length, '_')}
                        </div>
                    </div>
                )}

                {phase === 'RESULT' && (
                    <div className="text-center animate-in scale-in-95">
                        {input === sequence ? (
                            <>
                                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-2" />
                                <p className="text-xl font-bold text-green-400">Correct!</p>
                            </>
                        ) : (
                            <>
                                <XCircle className="mx-auto h-16 w-16 text-red-500 mb-2" />
                                <p className="text-xl font-bold text-red-400">Incorrect</p>
                                <p className="text-sm text-gray-400 mt-1">Sequence was: {sequence}</p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Keypad */}
            <div className={cn("grid grid-cols-3 gap-3 w-full transition-opacity duration-300", phase !== 'INPUT' && "opacity-50 pointer-events-none")}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleInput(num.toString())}
                        className="h-16 rounded-xl bg-white border-2 border-gray-200 text-2xl font-bold text-gray-700 shadow-sm active:scale-95 active:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                        {num}
                    </button>
                ))}
                <div />
                <button
                    onClick={() => handleInput('0')}
                    className="h-16 rounded-xl bg-white border-2 border-gray-200 text-2xl font-bold text-gray-700 shadow-sm active:scale-95 active:bg-blue-50 hover:border-blue-300 transition-all"
                >
                    0
                </button>
                <button
                    onClick={() => setInput(prev => prev.slice(0, -1))}
                    className="h-16 rounded-xl bg-red-50 border-2 border-red-100 text-red-600 font-bold active:scale-95 hover:bg-red-100 flex items-center justify-center"
                >
                    Del
                </button>
            </div>

            {/* Game Over Overlay */}
            {phase === 'IDLE' && score > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                <Trophy className="h-8 w-8" />
                            </div>
                        </div>
                        <h2 className="text-center text-2xl font-bold text-gray-900">Session Complete!</h2>
                        <p className="mt-2 text-center text-gray-600">You practiced up to Level {level}.</p>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => { setScore(0); setLevel(1); setLives(3); setTimer(0); startRound(); }}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Replay
                            </button>
                            <button
                                onClick={finishGame}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Finish Session
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
