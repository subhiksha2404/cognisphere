'use client';

import { useState } from 'react';
import { PatientProfile, TreatmentRecommendation } from '@/lib/types';
import { compareTreatments } from '@/lib/treatmentData';
import TreatmentForm from '@/components/treatment/TreatmentForm';
import ComparisonTable from '@/components/treatment/ComparisonTable';
import { ArrowLeft, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default function TreatmentsPage() {
    const [profile, setProfile] = useState<PatientProfile | null>(null);
    const [recommendations, setRecommendations] = useState<TreatmentRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleAnalysis = async (patientProfile: PatientProfile) => {
        setIsLoading(true);

        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Calculate recommendations
        const results = compareTreatments(patientProfile.disease, patientProfile);

        setProfile(patientProfile);
        setRecommendations(results);
        setShowResults(true);
        setIsLoading(false);
    };

    const resetSearch = () => {
        setShowResults(false);
        setRecommendations([]);
        // Keep profile to allow easy adjustments
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    {/* Back link removed as requested, present in Navbar */}

                    <h1 className="flex justify-center items-center gap-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        <Stethoscope className="h-10 w-10 text-blue-600" />
                        AI Treatment Recommender
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                        Advanced algorithmic analysis to identify optimal treatment protocols based on patient-specific constraints and efficacy data.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12">
                    {!showResults ? (
                        <div className="mx-auto max-w-3xl">
                            <TreatmentForm onSubmit={handleAnalysis} isLoading={isLoading} />

                            {/* Feature Highlights */}
                            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <div className="rounded-xl bg-white p-6 shadow-sm">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                        <span className="font-bold">AI</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Multi-Factor Analysis</h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Incorporates age, comorbidities, and disease severity into efficacy projections.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white p-6 shadow-sm">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                        <span className="font-bold">Rx</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Safety Profiling</h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Weights side effects and risks against potential clinical benefits.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white p-6 shadow-sm">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                                        <span className="font-bold">Sim</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900">Outcome Simulation</h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Project long-term improvement timelines and monitoring requirements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
                                <button
                                    onClick={resetSearch}
                                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600"
                                >
                                    Adjust Parameters
                                </button>
                            </div>

                            {profile && (
                                <ComparisonTable
                                    recommendations={recommendations}
                                    profile={profile}
                                />
                            )}

                            <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                                <h3 className="mb-2 text-sm font-bold text-yellow-800">Clinical Disclaimer</h3>
                                <p className="text-sm text-yellow-800">
                                    This tool supports clinical decision-making but does not replace professional medical judgment.
                                    Recommendations are generated based on statistical models and standard guidelines.
                                    Always consider individual patient circumstances and contras before prescribing.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
