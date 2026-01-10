import { RiskAssessmentForm } from '@/lib/types';

interface Step5Props {
    formData: Partial<RiskAssessmentForm>;
    updateFormData: (data: Partial<RiskAssessmentForm>) => void;
}

export default function Step5ClinicalScores({ formData, updateFormData }: Step5Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Clinical Test Scores</h2>
                <p className="mt-1 text-gray-600">
                    Optional: Enter scores from clinical tests if available
                </p>
            </div>

            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> These fields are optional. Leave blank if you haven't taken these tests.
                    Your assessment can still be completed without them.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {/* MMSE Score */}
                <div>
                    <label htmlFor="mmse_score" className="block text-sm font-medium text-gray-700">
                        MMSE Score (Mini-Mental State Examination)
                    </label>
                    <input
                        type="number"
                        id="mmse_score"
                        min="0"
                        max="30"
                        value={formData.mmse_score || ''}
                        onChange={(e) => updateFormData({ mmse_score: parseInt(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="0-30"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Cognitive function test. Normal: 24-30, Mild impairment: 18-23, Severe: &lt;18
                    </p>
                </div>

                {/* UPDRS Score */}
                <div>
                    <label htmlFor="updrs_score" className="block text-sm font-medium text-gray-700">
                        UPDRS Score (Unified Parkinson's Disease Rating Scale)
                    </label>
                    <input
                        type="number"
                        id="updrs_score"
                        min="0"
                        max="199"
                        value={formData.updrs_score || ''}
                        onChange={(e) => updateFormData({ updrs_score: parseInt(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="0-199"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Parkinson's severity assessment. Higher scores indicate greater impairment.
                    </p>
                </div>

                {/* Seizure Frequency */}
                <div>
                    <label htmlFor="frequency_seizures" className="block text-sm font-medium text-gray-700">
                        Seizure Frequency (per month)
                    </label>
                    <input
                        type="number"
                        id="frequency_seizures"
                        min="0"
                        value={formData.frequency_seizures || ''}
                        onChange={(e) => updateFormData({ frequency_seizures: parseInt(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Number of seizures"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Average number of seizures you experience per month
                    </p>
                </div>

                {/* Medication Adherence */}
                <div>
                    <label htmlFor="medication_adherence" className="block text-sm font-medium text-gray-700">
                        Medication Adherence: {formData.medication_adherence || 3}
                    </label>
                    <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs text-gray-500">Poor</span>
                        <input
                            type="range"
                            id="medication_adherence"
                            min="1"
                            max="5"
                            value={formData.medication_adherence || 3}
                            onChange={(e) => updateFormData({ medication_adherence: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs text-gray-500">Excellent</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        How consistently do you take prescribed medications?
                    </p>
                </div>
            </div>

            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">
                    <strong>Ready to submit:</strong> Click "Submit Assessment" below to calculate your risk scores
                    for Alzheimer's, Parkinson's, Epilepsy, and Hypoxia.
                </p>
            </div>
        </div>
    );
}
