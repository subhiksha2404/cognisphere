import { RiskAssessmentForm } from '@/lib/types';

interface Step1Props {
    formData: Partial<RiskAssessmentForm>;
    updateFormData: (data: Partial<RiskAssessmentForm>) => void;
}

export default function Step1Demographics({ formData, updateFormData }: Step1Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Demographics</h2>
                <p className="mt-1 text-gray-600">Basic information about yourself</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {/* Age */}
                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="age"
                        min="18"
                        max="120"
                        required
                        value={formData.age || ''}
                        onChange={(e) => updateFormData({ age: parseInt(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your age"
                    />
                    <p className="mt-1 text-xs text-gray-500">Must be between 18 and 120</p>
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="gender"
                        value={formData.gender || 'Male'}
                        onChange={(e) => updateFormData({ gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Education Years */}
                <div className="sm:col-span-2">
                    <label htmlFor="education_years" className="block text-sm font-medium text-gray-700">
                        Years of Education <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="education_years"
                        min="0"
                        max="30"
                        required
                        value={formData.education_years ?? ''}
                        onChange={(e) => updateFormData({ education_years: parseInt(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Total years of formal education"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Include all years from elementary school through higher education (0-30 years)
                    </p>
                </div>
            </div>
        </div>
    );
}
