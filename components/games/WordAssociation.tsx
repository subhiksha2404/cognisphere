'use client';

import { useState, useEffect, useRef } from 'react';
import { GameDifficulty, GameSession } from '@/lib/types';
import { Type, Send, Trophy, ArrowRight, RotateCcw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import HintSystem from '../training/HintSystem';

const CATEGORIES = {
    'Nature': ['Tree', 'Flower', 'River', 'Mountain', 'Forest', 'Ocean', 'Sun', 'Rain'],
    'Household': ['Table', 'Chair', 'Lamp', 'Window', 'Door', 'Bed', 'Kitchen', 'Clock'],
    'Food': ['Apple', 'Bread', 'Cheese', 'Milk', 'Pasta', 'Soup', 'Fruit', 'Cake'],
    'Transportation': ['Car', 'Bike', 'Train', 'Ship', 'Plane', 'Bus', 'Road', 'Wheel']
};

interface WordAssociationProps {
    difficulty: GameDifficulty;
    onComplete: (session: Partial<GameSession>) => void;
}

export default function WordAssociation({ difficulty, onComplete }: WordAssociationProps) {
    const [category, setCategory] = useState<keyof typeof CATEGORIES>('Nature');
    const [words, setWords] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [startTime, setStartTime] = useState(0);
    const [hintActive, setHintActive] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [words]);

    const startGame = () => {
        setWords([]);
        setInput('');
        setIsPlaying(true);
        setGameComplete(false);
        setStartTime(Date.now());
        setHintActive(null);
        // Randomly pick category
        const cats = Object.keys(CATEGORIES) as (keyof typeof CATEGORIES)[];
        setCategory(cats[Math.floor(Math.random() * cats.length)]);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || words.includes(trimmed.toLowerCase())) return;

        setWords(prev => [...prev, trimmed]);
        setInput('');
    };

    const requestHint = () => {
        const catWords = CATEGORIES[category];
        const unused = catWords.filter(w => !words.map(pw => pw.toLowerCase()).includes(w.toLowerCase()));
        if (unused.length > 0) {
            setHintActive(`Think of things like: ${unused[0]}...`);
            setTimeout(() => setHintActive(null), 2500);
        }
    };

    const handleFinish = () => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setIsPlaying(false);
        setGameComplete(true);

        onComplete({
            game_type: 'word_association',
            difficulty,
            score: words.length * 50,
            time_taken: elapsed,
            accuracy: 100 // High as it's free-flow
        });
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
            <HintSystem hint={hintActive} onDismiss={() => setHintActive(null)} />

            {/* Header Area */}
            <div className="w-full flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Type className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-gray-400">Current Theme</p>
                        <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={requestHint}
                        disabled={!isPlaying}
                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Need a hint?"
                    >
                        <Lightbulb className="h-6 w-6" />
                    </button>
                    {isPlaying && (
                        <button
                            onClick={handleFinish}
                            className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            I&apos;m done
                        </button>
                    )}
                </div>
            </div>

            {/* Game Content */}
            {!isPlaying && !gameComplete ? (
                <div className="w-full aspect-video flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <Type className="h-16 w-16 text-gray-200 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Word Flow</h2>
                    <p className="text-gray-500 max-w-sm mb-8">Type any words that come to mind related to the theme. There is no time pressure.</p>
                    <button
                        onClick={startGame}
                        className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-transform"
                    >
                        Start Session
                    </button>
                </div>
            ) : (
                <div className="w-full flex flex-col gap-6">
                    {/* Word List */}
                    <div
                        ref={scrollRef}
                        className="w-full min-h-[300px] bg-slate-50 rounded-3xl p-6 overflow-y-auto flex flex-wrap gap-3 content-start"
                    >
                        {words.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                                Type your first word below...
                            </div>
                        ) : words.map((word, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 bg-white rounded-full text-blue-600 font-bold shadow-sm border border-blue-100 animate-in zoom-in duration-300"
                            >
                                {word}
                            </span>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={!isPlaying}
                            placeholder="Type a related word..."
                            className="w-full py-5 px-6 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none text-lg transition-colors pr-16 shadow-lg shadow-gray-100"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-300"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Result Overlay */}
            {gameComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                <Trophy className="h-8 w-8" />
                            </div>
                        </div>
                        <h2 className="text-center text-2xl font-bold text-gray-900">Well Done!</h2>
                        <p className="mt-2 text-center text-gray-600">You thought of {words.length} associations.</p>
                        <div className="mt-8 flex gap-3">
                            <button onClick={startGame} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold hover:bg-gray-50">
                                <RotateCcw className="h-4 w-4" /> Replay
                            </button>
                            <button
                                onClick={() => onComplete({ game_type: 'word_association', difficulty, score: words.length * 50, time_taken: 0, accuracy: 100 })}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Save & Finish <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
