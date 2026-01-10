'use client';

import { useState, useMemo } from 'react';
import { Memory, MemoryCategory } from '@/lib/types';
import MemoryCard from './MemoryCard';
import { Search, Filter, Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { cn } from '@/lib/utils';

interface MemoryTimelineProps {
    memories: Memory[];
    onDelete: (id: string) => void;
}

const CATEGORIES: MemoryCategory[] = ['Family Event', 'Achievement', 'Travel', 'Medical', 'Other'];

export default function MemoryTimeline({ memories, onDelete }: MemoryTimelineProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'All'>('All');

    const filteredMemories = useMemo(() => {
        return memories.filter(m => {
            const matchesSearch =
                m.title.toLowerCase().includes(search.toLowerCase()) ||
                m.notes.toLowerCase().includes(search.toLowerCase()) ||
                m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

            const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [memories, search, selectedCategory]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(22);
        doc.setTextColor(234, 88, 12); // Orange-600
        doc.text("My Memory Vault", 105, y, { align: 'center' });
        y += 20;

        doc.setFontSize(12);
        doc.setTextColor(0);

        filteredMemories.forEach((mem, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            const date = new Date(mem.date).toLocaleDateString();

            doc.setFontSize(16);
            doc.text(`${mem.title} (${date})`, 20, y);
            y += 7;

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`[${mem.category}]`, 20, y);
            y += 8;

            doc.setFontSize(12);
            doc.setTextColor(0);
            const splitNotes = doc.splitTextToSize(mem.notes, 170);
            doc.text(splitNotes, 20, y);

            y += (splitNotes.length * 5) + 15;

            // Separator
            doc.setDrawColor(200);
            doc.line(20, y - 5, 190, y - 5);
        });

        doc.save('memory-vault.pdf');
    };

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search memories..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                            selectedCategory === 'All' ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        All
                    </button>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                                selectedCategory === cat ? "bg-blue-100 text-blue-700" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors ml-auto md:ml-0"
                >
                    <FileText className="h-4 w-4" /> Export PDF
                </button>
            </div>

            {/* Grid */}
            {filteredMemories.length > 0 ? (
                <div className="masonry-grid sm:grid-cols-2 lg:grid-cols-3 gap-6 grid items-start">
                    {filteredMemories.map(memory => (
                        <MemoryCard key={memory.id} memory={memory} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500">No memories found. Start adding some!</p>
                </div>
            )}
        </div>
    );
}
