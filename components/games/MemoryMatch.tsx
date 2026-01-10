'use client';

import { useState, useEffect } from 'react';
import { GameDifficulty, GameSession } from '@/lib/types';
import {
    Brain, Heart, Star, Zap, Cloud, Moon, Sun, Anchor, Bike, Car,
    Coffee, Feather, Flag, Home, Key, Map, Music, Gift,
    RotateCcw, ArrowRight, Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import HintSystem from '../training/HintSystem';

const ICONS = [
    Brain, Heart, Star, Zap, Cloud, Moon, Sun, Anchor, Bike, Car,
    Coffee, Feather, Flag, Home, Key, Map, Music, Gift
];

interface Card {
    id: number;
    iconId: number;
    isFlipped: boolean;
    isMatched: boolean;
    isHighlighted?: boolean; // For hints
}

interface MemoryMatchProps {
    difficulty: GameDifficulty;
    onComplete: (session: Partial<GameSession>) => void;
}

export default function MemoryMatch({ difficulty, onComplete }: MemoryMatchProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [hintActive, setHintActive] = useState<string | null>(null);

    // Difficulty Settings
    const gridSize = difficulty === 'Hard' ? 6 : 4;
    const numPairs = (gridSize * gridSize) / 2;

    const startNewGame = () => {
        const selectedIcons = ICONS.slice(0, numPairs);
        const deck = [...selectedIcons, ...selectedIcons]
            .map((_, i) => ({ id: i, icon: _ }))
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({
                id: index,
                iconId: ICONS.indexOf(item.icon),
                isFlipped: false,
                isMatched: false
            }));

        setCards(deck);
        setFlippedIndices([]);
        setMatchedPairs([]);
        setMoves(0);
        setStartTime(Date.now());
        setIsPlaying(true);
        setGameComplete(false);
        setHintActive(null);
    };

    useEffect(() => {
        startNewGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [difficulty]);

    const handleGameOver = () => {
        setGameComplete(true);
        setIsPlaying(false);
    };

    const checkForMatch = (idx1: number, idx2: number) => {
        const match = cards[idx1].iconId === cards[idx2].iconId;

        if (match) {
            const newMatched = [...matchedPairs, cards[idx1].iconId];
            setMatchedPairs(newMatched);
            setFlippedIndices([]);

            setCards(prev => prev.map((c, i) =>
                (i === idx1 || i === idx2)
                    ? { ...c, isMatched: true, isHighlighted: false }
                    : c
            ));

            if (newMatched.length === numPairs) {
                handleGameOver();
            }
        } else {
            setTimeout(() => {
                setCards(prev => prev.map((c, i) =>
                    (i === idx1 || i === idx2)
                        ? { ...c, isFlipped: false }
                        : c
                ));
                setFlippedIndices([]);
            }, 1200); // Slower flip back for clinical ease
        }
    };

    const handleCardClick = (index: number) => {
        if (gameComplete || !isPlaying) return;
        if (cards[index].isMatched || cards[index].isFlipped) return;
        if (flippedIndices.length >= 2) return;

        // Flip card
        setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            checkForMatch(newFlipped[0], newFlipped[1]);
        }
    };

    const handleFinish = () => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const accuracy = Math.round((numPairs / moves) * 100) || 0;

        // No score calculation shown to user, but stored for backend
        const hiddenScore = 1000 - moves * 10;

        onComplete({
            game_type: 'memory_match',
            difficulty,
            score: Math.max(0, hiddenScore),
            time_taken: elapsedSeconds,
            accuracy
        });
    };

    const requestHint = () => {
        // Find an unmatched pair
        const unmatched = cards.filter(c => !c.isMatched && !c.isFlipped);
        if (unmatched.length < 2) return;

        // Find a pair among unmatched
        let pairIconId = -1;
        for (const card of unmatched) {
            if (unmatched.filter(c => c.iconId === card.iconId).length >= 2) {
                pairIconId = card.iconId;
                break;
            }
        }

        if (pairIconId !== -1) {
            const targetCards = cards.filter(c => c.iconId === pairIconId && !c.isMatched);
            // Highlight them
            setCards(prev => prev.map(c =>
                (c.id === targetCards[0].id || c.id === targetCards[1].id)
                    ? { ...c, isHighlighted: true }
                    : c
            ));
            setHintActive("Look for the glowing cards!");

            // Remove highlight after 2s
            setTimeout(() => {
                setCards(prev => prev.map(c => ({ ...c, isHighlighted: false })));
                setHintActive(null);
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <HintSystem hint={hintActive} onDismiss={() => setHintActive(null)} />

            {/* HUD */}
            <div className="flex w-full max-w-2xl justify-between items-center rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4">
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase text-gray-400">Matches</p>
                        <p className="text-xl font-bold text-green-600">{matchedPairs.length} / {numPairs}</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold uppercase text-gray-500 mb-1">Support</span>
                    <button
                        onClick={requestHint}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                    >
                        <Lightbulb className="h-4 w-4" /> Need a Hint?
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div
                className={cn(
                    "grid gap-3 transition-all duration-300",
                    gridSize === 4 ? "grid-cols-4" : "grid-cols-6"
                )}
            >
                {cards.map((card, index) => {
                    const Icon = ICONS[card.iconId];
                    return (
                        <button
                            key={card.id}
                            onClick={() => handleCardClick(index)}
                            disabled={card.isMatched || card.isFlipped}
                            className={cn(
                                "relative flex items-center justify-center rounded-xl shadow-sm transition-all duration-500 transform perspective-1000",
                                gridSize === 4 ? "h-20 w-20 sm:h-24 sm:w-24" : "h-14 w-14 sm:h-16 sm:w-16",
                                card.isHighlighted && !card.isFlipped && !card.isMatched ? "ring-4 ring-yellow-400 scale-105 z-10" : "",
                                card.isFlipped || card.isMatched
                                    ? "bg-white rotate-y-180 border-2 border-blue-100"
                                    : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:shadow-md hover:scale-105"
                            )}
                        >
                            {(card.isFlipped || card.isMatched) ? (
                                <Icon
                                    className={cn(
                                        "animate-in fade-in zoom-in duration-300",
                                        card.isMatched ? "text-green-500" : "text-blue-600",
                                        gridSize === 4 ? "h-10 w-10" : "h-6 w-6"
                                    )}
                                />
                            ) : (
                                <Brain className="h-6 w-6 text-white text-opacity-20" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Game Over Overlay */}
            {gameComplete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="mb-6 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-500">
                                <Brain className="h-8 w-8" />
                            </div>
                        </div>
                        <h2 className="text-center text-2xl font-bold text-gray-900">Well Done!</h2>
                        <p className="mt-2 text-center text-gray-600">You&apos;ve completed this memory exercise.</p>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={startNewGame}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <RotateCcw className="h-4 w-4" />
                                Replay
                            </button>
                            <button
                                onClick={handleFinish}
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
