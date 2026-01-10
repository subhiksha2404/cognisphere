import { RiskAssessmentForm } from '@/lib/types';

interface Step2Props {
    formData: Partial<RiskAssessmentForm>;
    updateFormData: (data: Partial<RiskAssessmentForm>) => void;
}

export default function Step2MedicalHistory({ formData, updateFormData }: Step2Props) {
    const conditions = [
        { key: 'family_history', label: 'Family history of neurological disease' },
        { key: 'hypertension', label: 'Hypertension (high blood pressure)' },
        { key: 'diabetes', label: 'Diabetes' },
        { key: 'heart_disease', label: 'Heart disease' },
        { key: 'cardiovascular_history', label: 'Cardiovascular disease history' },
        { key: 'head_injury', label: 'Previous head injury' },
        { key: 'seizure_history', label: 'History of seizures' },
        { key: 'depression', label: 'Depression or mood disorders' },
        { key: 'sleep_apnea', label: 'Sleep apnea' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
                <p className="mt-1 text-gray-600">Select all conditions that apply to you</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {conditions.map((condition) => (
                    <label
                        key={condition.key}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                    >
                        <input
                            type="checkbox"
                            checked={formData[condition.key as keyof RiskAssessmentForm] as boolean || false}
                            onChange={(e) => updateFormData({ [condition.key]: e.target.checked })}
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">{condition.label}</span>
                    </label>
                ))}
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This information helps us provide more accurate risk assessments.
                    All data is kept confidential.
                </p>
            </div>
        </div>
    );
}
