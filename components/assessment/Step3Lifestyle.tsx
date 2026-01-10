import { RiskAssessmentForm } from '@/lib/types';

interface Step3Props {
    formData: Partial<RiskAssessmentForm>;
    updateFormData: (data: Partial<RiskAssessmentForm>) => void;
}

export default function Step3Lifestyle({ formData, updateFormData }: Step3Props) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Lifestyle Factors</h2>
                <p className="mt-1 text-gray-600">Information about your daily habits and health metrics</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                {/* Smoking Status */}
                <div>
                    <label htmlFor="smoking" className="block text-sm font-medium text-gray-700">
                        Smoking Status
                    </label>
                    <select
                        id="smoking"
                        value={formData.smoking || 'Never'}
                        onChange={(e) => updateFormData({ smoking: e.target.value as any })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Never">Never smoked</option>
                        <option value="Former">Former smoker</option>
                        <option value="Current">Current smoker</option>
                    </select>
                </div>

                {/* Alcohol Consumption */}
                <div>
                    <label htmlFor="alcohol" className="block text-sm font-medium text-gray-700">
                        Alcohol Consumption
                    </label>
                    <select
                        id="alcohol"
                        value={formData.alcohol_consumption || 'None'}
                        onChange={(e) => updateFormData({ alcohol_consumption: e.target.value as any })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="None">None</option>
                        <option value="Light">Light (1-2 drinks/week)</option>
                        <option value="Moderate">Moderate (3-7 drinks/week)</option>
                        <option value="Heavy">Heavy (8+ drinks/week)</option>
                    </select>
                </div>

                {/* Physical Activity */}
                <div className="sm:col-span-2">
                    <label htmlFor="physical_activity" className="block text-sm font-medium text-gray-700">
                        Physical Activity Level: {formData.physical_activity || 3}
                    </label>
                    <div className="mt-2 flex items-center gap-4">
                        <span className="text-xs text-gray-500">Low</span>
                        <input
                            type="range"
                            id="physical_activity"
                            min="1"
                            max="5"
                            value={formData.physical_activity || 3}
                            onChange={(e) => updateFormData({ physical_activity: parseInt(e.target.value) })}
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-xs text-gray-500">High</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        1 = Sedentary, 3 = Moderate exercise, 5 = Very active
                    </p>
                </div>

                {/* Sleep Hours */}
                <div>
                    <label htmlFor="sleep_hours" className="block text-sm font-medium text-gray-700">
                        Average Sleep Hours per Night
                    </label>
                    <input
                        type="number"
                        id="sleep_hours"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.sleep_hours || 7}
                        onChange={(e) => updateFormData({ sleep_hours: parseFloat(e.target.value) })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* BMI */}
                <div>
                    <label htmlFor="bmi" className="block text-sm font-medium text-gray-700">
                        BMI (Body Mass Index) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="bmi"
                        min="10"
                        max="60"
                        step="0.1"
                        required
                        value={formData.bmi || ''}
                        onChange={(e) => updateFormData({ bmi: parseFloat(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 24.5"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Calculate: weight (kg) ÷ height² (m²)
                    </p>
                </div>

                {/* Glucose Level */}
                <div className="sm:col-span-2">
                    <label htmlFor="glucose_level" className="block text-sm font-medium text-gray-700">
                        Fasting Glucose Level (mg/dL) <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                        type="number"
                        id="glucose_level"
                        min="0"
                        step="0.1"
                        value={formData.glucose_level || ''}
                        onChange={(e) => updateFormData({ glucose_level: parseFloat(e.target.value) || undefined })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Leave blank if unknown"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Normal: 70-100 mg/dL, Prediabetes: 100-125 mg/dL, Diabetes: ≥126 mg/dL
                    </p>
                </div>
            </div>
        </div>
    );
}
