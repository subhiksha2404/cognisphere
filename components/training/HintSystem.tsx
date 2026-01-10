'use client';

import { Lightbulb } from 'lucide-react';

interface HintSystemProps {
    hint: string | null;
    onDismiss: () => void;
}

export default function HintSystem({ hint, onDismiss }: HintSystemProps) {
    if (!hint) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
            <div className="flex items-start gap-3 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl max-w-md">
                <div className="p-2 bg-indigo-500 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                    <h4 className="font-bold text-sm mb-1 text-indigo-100 uppercase tracking-wider">Helpful Tip</h4>
                    <p className="text-sm font-medium">{hint}</p>
                </div>
                <button
                    onClick={onDismiss}
                    className="ml-2 text-indigo-300 hover:text-white"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
