'use client';

import { Memory } from '@/lib/types';
import { Calendar, Tag, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MemoryCardProps {
    memory: Memory;
    onDelete: (id: string) => void;
}

export default function MemoryCard({ memory, onDelete }: MemoryCardProps) {
    const dateStr = new Date(memory.date).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="group relative break-inside-avoid rounded-2xl bg-white p-4 shadow-sm border border-blue-50 hover:shadow-lg transition-all hover:border-blue-200 flex flex-col h-full">
            {/* Category Badge */}
            <div className="absolute top-4 right-4 z-10">
                <span className={cn(
                    "px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide shadow-sm backdrop-blur-md",
                    memory.category === 'Family Event' && "bg-blue-100/90 text-blue-700",
                    memory.category === 'Achievement' && "bg-yellow-100/90 text-yellow-700",
                    memory.category === 'Travel' && "bg-cyan-100/90 text-cyan-700",
                    memory.category === 'Medical' && "bg-red-100/90 text-red-700",
                    memory.category === 'Other' && "bg-gray-100/90 text-gray-700",
                )}>
                    {memory.category}
                </span>
            </div>

            {/* Photo */}
            {memory.photo_url ? (
                <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-4 cursor-pointer">
                    <img
                        src={memory.photo_url}
                        alt={memory.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            ) : (
                <div className="aspect-[3/1] w-full rounded-xl bg-blue-50 mb-4 flex items-center justify-center opacity-50">
                    <span className="text-blue-300 font-serif italic">Nostalgia</span>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-800 mb-1 leading-tight">{memory.title}</h3>
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-3">
                    <Calendar className="h-3 w-3" /> {dateStr}
                </p>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {memory.notes}
                </p>

                {/* Tags */}
                {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {memory.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                #{tag.replace(/\s+/g, '')}
                            </span>
                        ))}
                        {memory.tags.length > 3 && (
                            <span className="text-[10px] text-gray-400">+{memory.tags.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Actions (Hover) */}
            <div className="border-t border-gray-100 pt-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onDelete(memory.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Memory"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
