import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBox() {
    return (
        <div className="rounded-2xl border-2 border-yellow-300 bg-yellow-50 p-6">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-yellow-900">Important Medical Disclaimer</h3>
                    <div className="mt-2 space-y-2 text-sm text-yellow-800">
                        <p>
                            <strong>This assessment is for educational and screening purposes only.</strong> It is not a medical diagnosis
                            and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                        <p>
                            The risk calculations are based on statistical models and published research, but individual cases vary significantly.
                            A high-risk result does not mean you have the disease, and a low-risk result does not guarantee you won't develop it.
                        </p>
                        <p>
                            <strong>Always consult with qualified healthcare professionals</strong> for proper evaluation, diagnosis, and treatment.
                            If you have concerning symptoms, schedule an appointment with your doctor or a neurologist immediately.
                        </p>
                        <p className="font-semibold">
                            In case of emergency symptoms (sudden confusion, severe headache, loss of consciousness, seizures),
                            call emergency services immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
