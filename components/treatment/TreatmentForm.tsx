'use client';

import { useState } from 'react';
import { DiseaseType, PatientProfile, DiseaseSeverity } from '@/lib/types';
import { Loader2, Activity, User, FileText, Pill } from 'lucide-react';

interface TreatmentFormProps {
    onSubmit: (profile: PatientProfile) => void;
    isLoading: boolean;
}

export default function TreatmentForm({ onSubmit, isLoading }: TreatmentFormProps) {
    const [profile, setProfile] = useState<PatientProfile>({
        disease: "Alzheimer's Disease",
        age: 70,
        severity: 'Moderate',
        comorbidities: 1,
        medications_count: 2
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(profile);
    };

    const diseases: DiseaseType[] = ["Alzheimer's Disease", "Parkinson's Disease", "Epilepsy"];
    const severities: DiseaseSeverity[] = ['Mild', 'Moderate', 'Severe', 'Very Severe'];

    return (
        <div className="rounded-2xl border border-blue-100 bg-white shadow-xl">
            <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white px-6 py-4">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Patient Profile & Condition
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                    {/* Disease Selection */}
                    <div>
                        <label className="mb-3 block text-sm font-semibold text-gray-700">Diagnosis</label>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {diseases.map((d) => (
                                <label
                                    key={d}
                                    className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 text-center transition-all ${profile.disease === d
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="disease"
                                        value={d}
                                        checked={profile.disease === d}
                                        onChange={(e) => setProfile({ ...profile, disease: e.target.value as DiseaseType })}
                                        className="absolute opacity-0"
                                    />
                                    <span className="font-medium">{d}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Age */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                <User className="h-4 w-4 text-gray-500" />
                                Patient Age
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="120"
                                required
                                value={profile.age}
                                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                            />
                        </div>

                        {/* Severity */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Activity className="h-4 w-4 text-gray-500" />
                                Disease Severity
                            </label>
                            <select
                                value={profile.severity}
                                onChange={(e) => setProfile({ ...profile, severity: e.target.value as DiseaseSeverity })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                            >
                                {severities.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Comorbidities */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FileText className="h-4 w-4 text-gray-500" />
                                Comorbidities Count
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={profile.comorbidities}
                                onChange={(e) => setProfile({ ...profile, comorbidities: parseInt(e.target.value) || 0 })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                            />
                            <p className="mt-1 text-xs text-gray-500">Number of other chronic conditions</p>
                        </div>

                        {/* Medications */}
                        <div>
                            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Pill className="h-4 w-4 text-gray-500" />
                                Current Medications
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="50"
                                value={profile.medications_count}
                                onChange={(e) => setProfile({ ...profile, medications_count: parseInt(e.target.value) || 0 })}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                            />
                            <p className="mt-1 text-xs text-gray-500">Total daily medications</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Analyzing Protocols...
                            </>
                        ) : (
                            <>
                                Compare All Treatments
                                <Activity className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
