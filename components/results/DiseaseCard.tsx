import { DiseaseRiskResult } from '@/lib/types';
import { Brain, Activity, Zap, Heart, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface DiseaseCardProps {
    result: DiseaseRiskResult;
}

export default function DiseaseCard({ result }: DiseaseCardProps) {
    const diseaseInfo = {
        alzheimers: {
            name: "Alzheimer's Disease",
            icon: Brain,
            color: 'purple',
        },
        parkinsons: {
            name: "Parkinson's Disease",
            icon: Activity,
            color: 'blue',
        },
        epilepsy: {
            name: 'Epilepsy',
            icon: Zap,
            color: 'yellow',
        },
        hypoxia: {
            name: 'Hypoxia/Stroke Risk',
            icon: Heart,
            color: 'red',
        },
    };

    const info = diseaseInfo[result.disease];
    const Icon = info.icon;

    const riskColors = {
        HIGH: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            badge: 'bg-red-600 text-white',
            progress: 'bg-red-600',
            text: 'text-red-700',
        },
        MEDIUM: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            badge: 'bg-yellow-600 text-white',
            progress: 'bg-yellow-600',
            text: 'text-yellow-700',
        },
        LOW: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            badge: 'bg-green-600 text-white',
            progress: 'bg-green-600',
            text: 'text-green-700',
        },
    };

    const colors = riskColors[result.riskLevel];

    const impactIcons = {
        High: AlertTriangle,
        Medium: Info,
        Low: CheckCircle2,
    };

    return (
        <div className={`rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 shadow-lg transition-all hover:shadow-xl`}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-white p-3 shadow-sm`}>
                        <Icon className={`h-6 w-6 text-${info.color}-600`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{info.name}</h3>
                        <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold ${colors.badge}`}>
                            {result.riskLevel} RISK
                        </span>
                    </div>
                </div>
            </div>

            {/* Probability */}
            <div className="mt-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Risk Probability</span>
                    <span className={`text-2xl font-bold ${colors.text}`}>{result.probability}%</span>
                </div>
                <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className={`progress-bar h-full ${colors.progress} rounded-full transition-all`}
                        style={{ '--progress-width': `${result.probability}%`, width: `${result.probability}%` } as React.CSSProperties}
                    />
                </div>
            </div>

            {/* Confidence */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-white p-3">
                <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                <span className="text-lg font-bold text-gray-900">{result.confidence}%</span>
            </div>

            {/* Risk Factors */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900">Identified Risk Factors</h4>
                <div className="mt-3 space-y-2">
                    {result.riskFactors.map((factor, index) => {
                        const ImpactIcon = impactIcons[factor.impact];
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-2 rounded-lg bg-white p-3 text-sm"
                            >
                                <ImpactIcon
                                    className={`mt-0.5 h-4 w-4 flex-shrink-0 ${factor.impact === 'High'
                                            ? 'text-red-600'
                                            : factor.impact === 'Medium'
                                                ? 'text-yellow-600'
                                                : 'text-green-600'
                                        }`}
                                />
                                <div className="flex-1">
                                    <span className="font-medium text-gray-900">{factor.factor}</span>
                                    <span className="ml-2 text-xs text-gray-500">({factor.impact} impact)</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900">Personalized Recommendations</h4>
                <ul className="mt-3 space-y-2">
                    {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                            <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
