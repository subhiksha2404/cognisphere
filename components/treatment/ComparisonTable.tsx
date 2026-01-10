'use client';

import { TreatmentRecommendation, PatientProfile } from '@/lib/types';
import { ArrowRight, Microscope, AlertTriangle, Clock, Wallet, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ComparisonTableProps {
    recommendations: TreatmentRecommendation[];
    profile: PatientProfile;
}

export default function ComparisonTable({ recommendations, profile }: ComparisonTableProps) {
    const router = useRouter();

    const handleSimulate = (treatmentId: string) => {
        // Pass patient profile via query params
        const params = new URLSearchParams({
            age: profile.age.toString(),
            disease: profile.disease,
            severity: profile.severity,
            comorbidities: profile.comorbidities.toString(),
            meds: profile.medications_count.toString()
        });
        router.push(`/treatments/simulation/${treatmentId}?${params.toString()}`);
    };

    const costColors = {
        'Low': 'bg-green-100 text-green-700',
        'Medium': 'bg-blue-100 text-blue-700',
        'High': 'bg-orange-100 text-orange-700',
        'Very High': 'bg-red-100 text-red-700'
    };

    const riskColors = {
        'Very Low': 'bg-green-100 text-green-800 border-green-200',
        'Low': 'bg-blue-100 text-blue-800 border-blue-200',
        'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'High': 'bg-red-100 text-red-800 border-red-200'
    };

    // Convert risk level to color string safely
    const getRiskColor = (level: string) => {
        return riskColors[level as keyof typeof riskColors] || 'bg-gray-100 text-gray-800';
    };

    const getCostColor = (cost: string) => {
        return costColors[cost as keyof typeof costColors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            {/* Patient Summary Card */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-800">Reference Profile</h3>
                <div className="flex flex-wrap gap-4 text-sm text-blue-900">
                    <span className="font-semibold">{profile.disease}</span>
                    <span>•</span>
                    <span>Age: {profile.age}</span>
                    <span>•</span>
                    <span>Severity: {profile.severity}</span>
                    <span>•</span>
                    <span>Comorbidities: {profile.comorbidities}</span>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                {/* Desktop Table Header */}
                <div className="hidden grid-cols-12 gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 md:grid">
                    <div className="col-span-3">Treatment</div>
                    <div className="col-span-2 text-center">Efficacy (Adj.)</div>
                    <div className="col-span-2 text-center">Safety Risk</div>
                    <div className="col-span-2 text-center">Time to Effect</div>
                    <div className="col-span-1 text-center">Cost</div>
                    <div className="col-span-1 text-center">AI Score</div>
                    <div className="col-span-1">Action</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {recommendations.map((rec, index) => {
                        const isRecommended = index === 0;
                        return (
                            <div
                                key={rec.id}
                                className={`group grid grid-cols-1 items-center gap-4 p-6 transition-colors md:grid-cols-12 md:p-6 ${isRecommended ? 'bg-green-50/50 hover:bg-green-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                {/* Treatment Name & Category */}
                                <div className="col-span-3">
                                    <div className="flex items-center gap-3">
                                        {isRecommended && (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 md:hidden">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-gray-900">{rec.name}</h4>
                                                {isRecommended && (
                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">{rec.category}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Efficacy */}
                                <div className="col-span-2 flex flex-col items-center justify-center">
                                    <span className="md:hidden text-xs font-bold uppercase text-gray-400 mb-1">Efficacy</span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold text-blue-700">{rec.adjusted_efficacy}%</span>
                                        <span className="text-xs text-gray-400 line-through">Base: {rec.base_efficacy}%</span>
                                    </div>
                                </div>

                                {/* Risk Level */}
                                <div className="col-span-2 flex flex-col items-center justify-center">
                                    <span className="md:hidden text-xs font-bold uppercase text-gray-400 mb-1">Risk Profile</span>
                                    <span className={`rounded-full px-3 py-1 text-xs font-bold border ${getRiskColor(rec.risk_level)}`}>
                                        {rec.risk_level}
                                    </span>
                                </div>

                                {/* Time to Effect */}
                                <div className="col-span-2 flex flex-col items-center justify-center">
                                    <span className="md:hidden text-xs font-bold uppercase text-gray-400 mb-1">Time to Effect</span>
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">{rec.time_to_effect} Weeks</span>
                                    </div>
                                </div>

                                {/* Cost */}
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <span className="md:hidden text-xs font-bold uppercase text-gray-400 mb-1">Cost</span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCostColor(rec.cost)}`}>
                                        {rec.cost}
                                    </span>
                                </div>

                                {/* AI Score */}
                                <div className="col-span-1 flex flex-col items-center justify-center">
                                    <span className="md:hidden text-xs font-bold uppercase text-gray-400 mb-1">AI Score</span>
                                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                                        <span className="text-lg font-bold text-blue-700">{rec.ai_score}</span>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="col-span-1 flex justify-center md:justify-end">
                                    <button
                                        onClick={() => handleSimulate(rec.id)}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border-2 border-blue-600 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 md:w-auto"
                                    >
                                        Simulate
                                        <Microscope className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <HelpCircle className="h-4 w-4" />
                Efficacy scores are adjusted based on patient age, comorbidities, and disease severity.
            </p>
        </div>
    );
}
