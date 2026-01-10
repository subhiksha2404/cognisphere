'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Memory } from '@/lib/types';
import MemoryTimeline from '@/components/memory/MemoryTimeline';
import MemoryInsights from '@/components/memory/MemoryInsights';
import MemoryBot from '@/components/memory/MemoryBot';
import MemoryForm from '@/components/memory/MemoryForm';
import { Plus, LayoutGrid, BarChart2, MessageSquare, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Tab = 'vault' | 'insights' | 'chat';

export default function MemoryPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('vault');
    const [isAddMode, setIsAddMode] = useState(false);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Memories
    const fetchMemories = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            // router.push('/auth'); // Let middleware or layout handle, or just show empty
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('memory_vault')
            .select('*')
            .eq('patient_id', user.id)
            .order('date', { ascending: false });

        if (data) setMemories(data as Memory[]);
        if (error) console.error(error);
        setLoading(false);
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this memory?")) return;

        const { error } = await supabase
            .from('memory_vault')
            .delete()
            .eq('id', id);

        if (!error) {
            setMemories(prev => prev.filter(m => m.id !== id));
        } else {
            alert("Failed to delete");
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            {/* Header / Tabs */}
            <div className="bg-white sticky top-14 z-20 shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-2xl font-serif font-bold text-gray-800 hidden sm:block">Memory Vault</h1>

                        <div className="flex bg-gray-100/50 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('vault')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                    activeTab === 'vault' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <LayoutGrid className="h-4 w-4" /> Vault
                            </button>
                            <button
                                onClick={() => setActiveTab('insights')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                    activeTab === 'insights' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <BarChart2 className="h-4 w-4" /> Insights
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                    activeTab === 'chat' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                <MessageSquare className="h-4 w-4" /> AI Chat
                            </button>
                        </div>

                        <button
                            onClick={() => setIsAddMode(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Memory</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isAddMode && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                        <MemoryForm
                            onCancel={() => setIsAddMode(false)}
                            onSuccess={() => {
                                setIsAddMode(false);
                                fetchMemories();
                            }}
                        />
                    </div>
                )}

                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'vault' && <MemoryTimeline memories={memories} onDelete={handleDelete} />}
                    {activeTab === 'insights' && <MemoryInsights memories={memories} />}
                    {activeTab === 'chat' && (
                        <div className="max-w-3xl mx-auto">
                            <MemoryBot memories={memories} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
