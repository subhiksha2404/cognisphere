'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
    PatientProfile,
    DiseaseType,
    DiseaseSeverity,
    SimulationData
} from '@/lib/types';
import { compareTreatments, generateSimulationData } from '@/lib/treatmentData';
import { supabase } from '@/lib/supabase';
import SimulationView from '@/components/treatment/SimulationView';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SimulationPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const treatmentId = params.id as string;

    const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!treatmentId) return;

            // 1. Reconstruct Patient Profile from URL params
            const profile: PatientProfile = {
                age: parseInt(searchParams.get('age') || '70'),
                disease: (searchParams.get('disease') as DiseaseType) || "Alzheimer's Disease",
                severity: (searchParams.get('severity') as DiseaseSeverity) || 'Moderate',
                comorbidities: parseInt(searchParams.get('comorbidities') || '0'),
                medications_count: parseInt(searchParams.get('meds') || '0')
            };

            // 2. Run Comparison Logic to get Adjusted Efficacy
            const recommendations = compareTreatments(profile.disease, profile);
            const specificRec = recommendations.find(r => r.id === treatmentId);

            // 3. Generate Base Simulation Data
            const baseData = generateSimulationData(treatmentId);

            if (baseData && specificRec) {
                // Merge adjusted efficacy and scores
                const fullData: SimulationData = {
                    ...baseData,
                    treatment: specificRec // Use the calculated recommendation which has adjusted efficacy
                };

                setSimulationData(fullData);
                saveSimulationToDB(fullData, profile);
            } else {
                console.error('Treatment not found');
            }
            setLoading(false);
        }

        loadData();
    }, [treatmentId, searchParams]);

    const saveSimulationToDB = async (data: SimulationData, profile: PatientProfile) => {
        try {
            const { user } = (await supabase.auth.getUser()).data;

            // Use a mock patient ID if not logged in (demo mode)
            const patientId = user?.id || '00000000-0000-0000-0000-000000000000';

            const payload = {
                patient_id: patientId,
                disease: profile.disease,
                treatment_id: data.treatment.id,
                treatment_name: data.treatment.name,
                age: profile.age,
                severity: profile.severity,
                comorbidities: profile.comorbidities,
                current_medications: profile.medications_count,
                adjusted_efficacy: data.treatment.adjusted_efficacy,
                timeline: JSON.stringify(data.timeline),
                side_effects: JSON.stringify(data.treatment.side_effects),
                monitoring_plan: JSON.stringify(data.monitoring_plan)
            };

            const { error } = await supabase
                .from('treatment_simulations')
                .insert(payload);

            if (error) {
                console.warn('Error saving simulation (Demo mode?):', error);
            }
        } catch (err) {
            console.error('Supabase error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!simulationData) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Treatment Not Found</h2>
                <Link href="/treatments" className="text-blue-600 hover:underline">
                    Return to Selection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Bar */}
            <div className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href="/treatments"
                        className="flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Comparison
                    </Link>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{simulationData.treatment.name} Simulation</h1>
                        <p className="text-xs text-gray-500">{simulationData.treatment.disease} Protocol</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <SimulationView data={simulationData} />
            </div>
        </div>
    );
}
