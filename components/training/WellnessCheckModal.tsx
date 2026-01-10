'use client';

import { useState } from 'react';
import { Smile, Frown, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WellnessCheckModalProps {
    type: 'Pre-Session' | 'Post-Session';
    onComplete: (data: { stress: number; energy: number; tired: boolean }) => void;
}

export default function WellnessCheckModal({ type, onComplete }: WellnessCheckModalProps) {
    const [stress, setStress] = useState<number | null>(null);
    const [energy, setEnergy] = useState<number | null>(null);

    const handleSubmit = () => {
        if (stress !== null && energy !== null) {
            onComplete({
                stress,
                energy,
                tired: energy <= 2 // Auto-flag fatigue if energy is low
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in zoom-in-95">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {type === 'Pre-Session' ? "How are you feeling today?" : "Session Complete"}
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    {type === 'Pre-Session'
                        ? "Let's check in before we start."
                        : "Take a moment to reflect on your energy."}
                </p>

                {/* Stress Check */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase text-gray-400 mb-3 text-center">Stress Level</p>
                    <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <button
                                key={level}
                                onClick={() => setStress(level)}
                                className={cn(
                                    "flex-1 h-14 rounded-xl border-2 transition-all flex items-center justify-center text-2xl",
                                    stress === level
                                        ? "border-blue-500 bg-blue-50 text-blue-600 scale-105 shadow-md"
                                        : "border-gray-100 bg-white text-gray-400 hover:border-blue-200"
                                )}
                            >
                                {level === 1 && <Smile className="h-6 w-6 text-green-500" />}
                                {level === 3 && <span className="text-lg font-bold text-gray-400">😐</span>}
                                {level === 5 && <Frown className="h-6 w-6 text-red-500" />}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                        <span>Very Calm</span>
                        <span>Stressed</span>
                    </div>
                </div>

                {/* Energy Check */}
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase text-gray-400 mb-3 text-center">Energy Level</p>
                    <div className="flex justify-between gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <button
                                key={level}
                                onClick={() => setEnergy(level)}
                                className={cn(
                                    "flex-1 h-14 rounded-xl border-2 transition-all flex items-center justify-center",
                                    energy === level
                                        ? "border-green-500 bg-green-50 text-green-600 scale-105 shadow-md"
                                        : "border-gray-100 bg-white text-gray-400 hover:border-green-200"
                                )}
                            >
                                {level === 1 && <BatteryLow className="h-6 w-6 text-red-400" />}
                                {level === 3 && <BatteryMedium className="h-6 w-6 text-yellow-500" />}
                                {level === 5 && <BatteryFull className="h-6 w-6 text-green-500" />}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                        <span>Tired</span>
                        <span>Energetic</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={stress === null || energy === null}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                >
                    {type === 'Pre-Session' ? 'Start Session' : 'Save & Rest'}
                </button>
            </div>
        </div>
    );
}
