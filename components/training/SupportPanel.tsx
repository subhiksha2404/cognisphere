'use client';

import { useState, useEffect } from 'react';
import { Heart, ShieldCheck, Sun, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const MESSAGES = [
    { text: "There is no rush.", icon: ShieldCheck, color: "text-blue-500" },
    { text: "Accuracy matters more than speed.", icon: Sun, color: "text-orange-500" },
    { text: "It's okay to make mistakes.", icon: Heart, color: "text-pink-500" },
    { text: "You can take a break anytime.", icon: RefreshCw, color: "text-green-500" },
    { text: "Breathe deeply and focus.", icon: ShieldCheck, color: "text-indigo-500" },
    { text: "You are doing great.", icon: Heart, color: "text-red-500" },
];

export default function SupportPanel() {
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 8000); // Rotate every 8 seconds
        return () => clearInterval(interval);
    }, []);

    const currentMsg = MESSAGES[msgIndex];
    const Icon = currentMsg.icon;

    return (
        <div className="fixed right-6 top-32 w-48 hidden xl:flex flex-col gap-4 animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white/50">
                <div className="flex justify-center mb-3">
                    <div className={cn("p-3 rounded-full bg-opacity-10", currentMsg.color.replace('text-', 'bg-'))}>
                        <Icon className={cn("h-6 w-6", currentMsg.color)} />
                    </div>
                </div>
                <p className="text-center text-gray-600 font-medium text-sm leading-relaxed">
                    {currentMsg.text}
                </p>
            </div>

            <div className="bg-blue-50/50 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                <p className="text-xs text-blue-600/80 text-center font-medium">
                    Clinical Support Mode Active
                </p>
            </div>
        </div>
    );
}
