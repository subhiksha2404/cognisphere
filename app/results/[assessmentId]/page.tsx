'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DiseaseRiskResult, RiskCalculationResults, RiskAssessmentForm } from '@/lib/types';
import { calculateRiskScores } from '@/lib/riskCalculation';
import { supabase } from '@/lib/supabase';
import DiseaseCard from '@/components/results/DiseaseCard';
import DisclaimerBox from '@/components/results/DisclaimerBox';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const assessmentId = params.assessmentId as string;

    const [results, setResults] = useState<RiskCalculationResults | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadResults();
    }, [assessmentId]);

    const loadResults = async () => {
        try {
            if (assessmentId === 'demo') {
                // Demo mode - use sample data
                const sampleData: RiskAssessmentForm = {
                    age: 70,
                    gender: 'Male',
                    education_years: 12,
                    family_history: true,
                    hypertension: true,
                    diabetes: false,
                    depression: false,
                    heart_disease: false,
                    cardiovascular_history: false,
                    head_injury: false,
                    seizure_history: false,
                    sleep_apnea: false,
                    smoking: 'Current',
                    alcohol_consumption: 'Light',
                    physical_activity: 2,
                    sleep_hours: 6,
                    bmi: 27,
                    glucose_level: 105,
                    memory_complaints: true,
                    confusion: 'Sometimes',
                    concentration_difficulty: true,
                    tremors: true,
                    rigidity: false,
                    bradykinesia: false,
                    postural_instability: false,
                    balance_problems: false,
                    loss_of_smell: false,
                    sleep_disorders: false,
                    constipation: false,
                    sleep_deprivation: false,
                    stress_level: 4,
                    eeg_abnormality: false,
                    mmse_score: 22,
                    updrs_score: 35,
                    frequency_seizures: undefined,
                    medication_adherence: 3,
                };
                const calculatedResults = calculateRiskScores(sampleData);
                setResults(calculatedResults);
            } else {
                // Load from Supabase
                const { data: assessment, error } = await supabase
                    .from('risk_assessments')
                    .select('*')
                    .eq('id', assessmentId)
                    .single();

                if (error || !assessment) {
                    console.error('Error loading assessment:', error);
                    router.push('/assessment');
                    return;
                }

                const calculatedResults = calculateRiskScores(assessment as RiskAssessmentForm);
                setResults(calculatedResults);

                // Auto-save results if not already saved
                saveResults(calculatedResults);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveResults = async (resultsData: RiskCalculationResults) => {
        if (assessmentId === 'demo') return;

        setSaving(true);
        try {
            const resultsToSave = [
                { assessment_id: assessmentId, ...resultsData.alzheimers },
                { assessment_id: assessmentId, ...resultsData.parkinsons },
                { assessment_id: assessmentId, ...resultsData.epilepsy },
                { assessment_id: assessmentId, ...resultsData.hypoxia },
            ];

            const { error } = await supabase
                .from('risk_results')
                .upsert(resultsToSave);

            if (error) {
                console.error('Error saving results:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSaving(false);
        }
    };

    const downloadPDF = () => {
        // Simple PDF generation - in production, use jsPDF library
        alert('PDF download functionality will be implemented with jsPDF library');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg text-gray-600">Calculating your risk assessment...</p>
                </div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
                <div className="text-center">
                    <p className="text-lg text-gray-600">No results found</p>
                    <Link
                        href="/assessment"
                        className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                        Start New Assessment
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
            <div className="mx-auto max-w-7xl px-6">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </Link>
                    <h1 className="mt-4 text-4xl font-bold text-gray-900">
                        Your Risk Assessment Results
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        AI-powered analysis for 4 major neurological conditions
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 rounded-lg border-2 border-blue-600 px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50"
                    >
                        <Download className="h-5 w-5" />
                        Download PDF Report
                    </button>
                    <Link
                        href="/assessment"
                        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-all hover:bg-green-700"
                    >
                        Start New Assessment
                    </Link>
                    {saving && (
                        <span className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving results...
                        </span>
                    )}
                </div>

                {/* Results Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <DiseaseCard result={results.alzheimers} />
                    <DiseaseCard result={results.parkinsons} />
                    <DiseaseCard result={results.epilepsy} />
                    <DiseaseCard result={results.hypoxia} />
                </div>

                {/* Disclaimer */}
                <div className="mt-8">
                    <DisclaimerBox />
                </div>

                {/* Additional Info */}
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-gray-900">Next Steps</h2>
                    <ul className="mt-4 space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Share these results with your healthcare provider for professional evaluation</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Follow the personalized recommendations provided for each condition</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Consider scheduling clinical tests if you haven't already</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>Retake this assessment periodically to track changes over time</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
