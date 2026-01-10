import { RiskAssessmentForm } from '@/lib/types';

interface Step4Props {
    formData: Partial<RiskAssessmentForm>;
    updateFormData: (data: Partial<RiskAssessmentForm>) => void;
}

export default function Step4Symptoms({ formData, updateFormData }: Step4Props) {
    const cognitiveSymptoms = [
        { key: 'memory_complaints', label: 'Memory complaints or forgetfulness' },
        { key: 'concentration_difficulty', label: 'Difficulty concentrating' },
    ];

    const motorSymptoms = [
        { key: 'tremors', label: 'Tremors (shaking)' },
        { key: 'rigidity', label: 'Muscle rigidity or stiffness' },
        { key: 'bradykinesia', label: 'Bradykinesia (slow movement)' },
        { key: 'postural_instability', label: 'Postural instability' },
        { key: 'balance_problems', label: 'Balance problems' },
    ];

    const otherSymptoms = [
        { key: 'loss_of_smell', label: 'Loss of smell' },
        { key: 'sleep_disorders', label: 'Sleep disorders (REM behavior disorder)' },
        { key: 'constipation', label: 'Chronic constipation' },
        { key: 'sleep_deprivation', label: 'Chronic sleep deprivation' },
        { key: 'eeg_abnormality', label: 'EEG abnormalities detected' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Symptoms</h2>
                <p className="mt-1 text-gray-600">Select all symptoms you currently experience</p>
            </div>

            {/* Cognitive Symptoms */}
            <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Cognitive Symptoms</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {cognitiveSymptoms.map((symptom) => (
                        <label
                            key={symptom.key}
                            className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                        >
                            <input
                                type="checkbox"
                                checked={formData[symptom.key as keyof RiskAssessmentForm] as boolean || false}
                                onChange={(e) => updateFormData({ [symptom.key]: e.target.checked })}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{symptom.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Confusion Frequency */}
            <div>
                <label htmlFor="confusion" className="block text-sm font-medium text-gray-700">
                    Confusion Episodes
                </label>
                <select
                    id="confusion"
                    value={formData.confusion || 'Never'}
                    onChange={(e) => updateFormData({ confusion: e.target.value as any })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Never">Never</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                </select>
            </div>

            {/* Motor Symptoms */}
            <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Motor Symptoms</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {motorSymptoms.map((symptom) => (
                        <label
                            key={symptom.key}
                            className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                        >
                            <input
                                type="checkbox"
                                checked={formData[symptom.key as keyof RiskAssessmentForm] as boolean || false}
                                onChange={(e) => updateFormData({ [symptom.key]: e.target.checked })}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{symptom.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Other Symptoms */}
            <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-800">Other Symptoms</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {otherSymptoms.map((symptom) => (
                        <label
                            key={symptom.key}
                            className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                        >
                            <input
                                type="checkbox"
                                checked={formData[symptom.key as keyof RiskAssessmentForm] as boolean || false}
                                onChange={(e) => updateFormData({ [symptom.key]: e.target.checked })}
                                className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">{symptom.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Stress Level */}
            <div>
                <label htmlFor="stress_level" className="block text-sm font-medium text-gray-700">
                    Stress Level: {formData.stress_level || 3}
                </label>
                <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs text-gray-500">Low</span>
                    <input
                        type="range"
                        id="stress_level"
                        min="1"
                        max="5"
                        value={formData.stress_level || 3}
                        onChange={(e) => updateFormData({ stress_level: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs text-gray-500">High</span>
                </div>
            </div>
        </div>
    );
}
