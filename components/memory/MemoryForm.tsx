'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MemoryCategory } from '@/lib/types';
import { Loader2, Upload, X, Camera, Calendar, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MemoryFormProps {
    onCancel: () => void;
    onSuccess: () => void;
}

const CATEGORIES: MemoryCategory[] = ['Family Event', 'Achievement', 'Travel', 'Medical', 'Other'];

export default function MemoryForm({ onCancel, onSuccess }: MemoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Family Event' as MemoryCategory,
        notes: '',
        tagsRaw: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            let photoUrl = '';

            // 1. Upload Photo if exists
            if (photoFile) {
                const fileExt = photoFile.name.split('.').pop();
                const fileName = `${user.id}/${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('memories')
                    .upload(fileName, photoFile);

                if (uploadError) {
                    // Fallback: If bucket missing/permissions wrong, maybe just skip photo?
                    // Or alert valid error.
                    console.error('Upload failed:', uploadError);
                    alert(`Photo upload failed: ${uploadError.message}. Check if 'memories' bucket exists.`);
                    // Proceed without photo? or Return?
                    // Let's return to prevent saving without photo if intended.
                    setIsSubmitting(false);
                    return;
                }

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('memories')
                    .getPublicUrl(fileName);

                photoUrl = publicUrl;
            }

            // 2. Save Metadata
            const tags = formData.tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

            const { error: dbError } = await supabase
                .from('memory_vault')
                .insert({
                    patient_id: user.id,
                    title: formData.title,
                    date: formData.date,
                    category: formData.category,
                    notes: formData.notes,
                    tags: tags,
                    photo_url: photoUrl || null
                });

            if (dbError) throw dbError;

            onSuccess();

        } catch (err: any) {
            console.error('Error saving memory:', err);
            alert(`Failed to save: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-blue-100 max-w-2xl w-full mx-auto max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">New Memory</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Title & Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Topic / Title</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Summer Vacation 2024"
                            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" /> Date
                        </label>
                        <input
                            required
                            type="date"
                            className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setFormData({ ...formData, category: cat })}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                    formData.category === cat
                                        ? "bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-100"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Camera className="h-4 w-4 text-blue-500" /> Photo (Optional)
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {!photoPreview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                            <Upload className="h-10 w-10 text-gray-400 group-hover:text-blue-500 mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Click to upload photo</p>
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 h-64 bg-gray-100">
                            <img src={photoPreview} alt="Preview" className="w-full h-full object-contain" />
                            <button
                                type="button"
                                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                                className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Detailed Notes</label>
                    <textarea
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                        placeholder="Capture the details of this memory..."
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" /> Tags
                    </label>
                    <input
                        type="text"
                        placeholder="Seaside, Family, 2024 (comma separated)"
                        className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        value={formData.tagsRaw}
                        onChange={e => setFormData({ ...formData, tagsRaw: e.target.value })}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" /> Saving...
                            </>
                        ) : (
                            'Save to Vault'
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}
