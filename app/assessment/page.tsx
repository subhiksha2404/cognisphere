'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiskAssessmentForm } from '@/lib/types';
import { calculateRiskScores } from '@/lib/riskCalculation';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import step components
import Step1Demographics from '@/components/assessment/Step1Demographics';
import Step2MedicalHistory from '@/components/assessment/Step2MedicalHistory';
import Step3Lifestyle from '@/components/assessment/Step3Lifestyle';
import Step4Symptoms from '@/components/assessment/Step4Symptoms';
import Step5ClinicalScores from '@/components/assessment/Step5ClinicalScores';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

export default function AssessmentPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data state
    const [formData, setFormData] = useState<Partial<RiskAssessmentForm>>({
        // Demographics
        age: undefined,
        gender: 'Male',
        education_years: undefined,

        // Medical History
        family_history: false,
        hypertension: false,
        diabetes: false,
        depression: false,
        heart_disease: false,
        cardiovascular_history: false,
        head_injury: false,
        seizure_history: false,
        sleep_apnea: false,

        // Lifestyle
        smoking: 'Never',
        alcohol_consumption: 'None',
        physical_activity: 3,
        sleep_hours: 7,
        bmi: undefined,
        glucose_level: undefined,

        // Symptoms
        memory_complaints: false,
        confusion: 'Never',
        concentration_difficulty: false,
        tremors: false,
        rigidity: false,
        bradykinesia: false,
        postural_instability: false,
        balance_problems: false,
        loss_of_smell: false,
        sleep_disorders: false,
        constipation: false,
        sleep_deprivation: false,
        stress_level: 3,
        eeg_abnormality: false,

        // Clinical Scores
        mmse_score: undefined,
        updrs_score: undefined,
        frequency_seizures: undefined,
        medication_adherence: 3,
    });

    const updateFormData = (data: Partial<RiskAssessmentForm>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateStep = (step: number): boolean => {
        if (step === 1) {
            return !!(formData.age && formData.age >= 18 && formData.age <= 120 &&
                formData.gender && formData.education_years !== undefined);
        }
        if (step === 3) {
            return !!(formData.bmi && formData.bmi >= 10 && formData.bmi <= 60);
        }
        return true; // Steps 2, 4, 5 have no required fields
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 5));
        } else {
            alert('Please fill in all required fields before proceeding.');
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) {
            alert('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate risk scores
            const results = calculateRiskScores(formData as RiskAssessmentForm);

            // For demo purposes, we'll use a mock patient ID
            // In production, this would come from authentication
            const mockPatientId = '00000000-0000-0000-0000-000000000000';

            let assessmentId = 'demo';

            // Try to save assessment to Supabase
            try {
                const { data: assessment, error: assessmentError } = await supabase
                    .from('risk_assessments')
                    .insert({
                        patient_id: mockPatientId,
                        ...formData,
                    })
                    .select()
                    .single();

                if (assessmentError) {
                    console.warn('Database not set up yet. Running in demo mode.');
                    console.warn('Error details:', assessmentError);
                    // Continue in demo mode
                } else if (assessment?.id) {
                    assessmentId = assessment.id;

                    // Save risk results
                    const resultsToSave = [
                        { assessment_id: assessment.id, ...results.alzheimers },
                        { assessment_id: assessment.id, ...results.parkinsons },
                        { assessment_id: assessment.id, ...results.epilepsy },
                        { assessment_id: assessment.id, ...results.hypoxia },
                    ];

                    const { error: resultsError } = await supabase
                        .from('risk_results')
                        .insert(resultsToSave);

                    if (resultsError) {
                        console.warn('Could not save results:', resultsError);
                    }
                }
            } catch (dbError) {
                console.warn('Database error - continuing in demo mode:', dbError);
            }

            // Navigate to results page (works in both demo and database mode)
            router.push(`/results/${assessmentId}`);
        } catch (error) {
            console.error('Error submitting assessment:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        'Demographics',
        'Medical History',
        'Lifestyle',
        'Symptoms',
        'Clinical Scores'
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
            <div className="mx-auto max-w-4xl px-6">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Neurological Risk Assessment
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Complete all 5 steps to receive your personalized risk analysis
                    </p>
                </div>

                {/* Progress Indicator */}
                <ProgressIndicator currentStep={currentStep} steps={steps} />

                {/* Form Container */}
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                    {/* Step Content */}
                    {currentStep === 1 && (
                        <Step1Demographics formData={formData} updateFormData={updateFormData} />
                    )}
                    {currentStep === 2 && (
                        <Step2MedicalHistory formData={formData} updateFormData={updateFormData} />
                    )}
                    {currentStep === 3 && (
                        <Step3Lifestyle formData={formData} updateFormData={updateFormData} />
                    )}
                    {currentStep === 4 && (
                        <Step4Symptoms formData={formData} updateFormData={updateFormData} />
                    )}
                    {currentStep === 5 && (
                        <Step5ClinicalScores formData={formData} updateFormData={updateFormData} />
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-700"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            Back
                        </button>

                        {currentStep < 5 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                            >
                                Next
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="rounded-lg bg-green-600 px-8 py-3 font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Calculating...' : 'Submit Assessment'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Help Text */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    All information is confidential and used only for risk assessment purposes.
                </p>
            </div>
        </div>
    );
}
