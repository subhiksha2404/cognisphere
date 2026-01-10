'use client';

import { SimulationData, TreatmentRecommendation } from '@/lib/types';
import {
    TrendingUp,
    Activity,
    Wallet,
    AlertTriangle,
    CheckCircle2,
    BookOpen,
    Calendar
} from 'lucide-react';

interface SimulationViewProps {
    data: SimulationData;
}

export default function SimulationView({ data }: SimulationViewProps) {
    const { treatment, timeline, monitoring_plan, evidence } = data;

    return (
        <div className="space-y-8">
            {/* Section 1: Overview Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Efficacy Card */}
                <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Adjusted Efficacy</p>
                            <h3 className="text-2xl font-bold text-gray-900">{treatment.adjusted_efficacy}%</h3>
                        </div>
                    </div>
                </div>

                {/* Category Card */}
                <div className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                            <Activity className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Category</p>
                            <h3 className="text-lg font-bold text-gray-900">{treatment.category}</h3>
                        </div>
                    </div>
                </div>

                {/* Cost Tier Card */}
                <div className="rounded-xl border border-green-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Cost Profile</p>
                            <h3 className="text-2xl font-bold text-gray-900">{treatment.cost}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Improvement Timeline */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Projected Improvement Timeline</h3>
                <div className="space-y-6">
                    {timeline.map((point) => (
                        <div key={point.week} className="relative">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-gray-700">Week {point.week}</span>
                                <span className="text-blue-600">{point.improvement}% Improvement</span>
                            </div>
                            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                                    style={{ width: `${point.improvement}%` }}
                                />
                            </div>
                            <div className="mt-1 text-right text-xs text-gray-400">
                                Confidence: {point.confidence}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-start gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                    <TrendingUp className="mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                        Projected trajectory shows gradual improvement stabilizing around week {treatment.time_to_effect}.
                        Variability may occur based on individual metabolic response.
                    </p>
                </div>
            </div>

            {/* Section 3: Side Effect Profile */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-6 text-xl font-bold text-gray-900">Risk & Side Effect Profile</h3>
                <div className="grid gap-6 md:grid-cols-3">
                    {treatment.side_effects.map((effect) => (
                        <div key={effect.name} className="flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">{effect.name}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${effect.severity === 'Severe' ? 'bg-red-100 text-red-700' :
                                            effect.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {effect.severity}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-end gap-2">
                                    <span className="text-2xl font-bold text-gray-900">{effect.probability}%</span>
                                    <span className="mb-1 text-xs text-gray-500">Probability</span>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className={`h-full rounded-full ${effect.probability > 20 ? 'bg-red-500' :
                                            effect.probability > 10 ? 'bg-yellow-500' : 'bg-green-500'
                                        }`}
                                    style={{ width: `${effect.probability}%` }}
                                />
                            </div>
                        </div>
                    ))}
                    {treatment.side_effects.length === 0 && (
                        <div className="col-span-3 flex items-center justify-center py-8 text-gray-500">
                            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                            No significant side effects reported for this intervention.
                        </div>
                    )}
                </div>
            </div>

            {/* Section 4 & 5: Monitoring & Evidence */}
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        Monitoring Plan
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="mb-2 text-sm font-bold uppercase text-gray-500">Clinical Assessments</h4>
                            <ul className="space-y-2">
                                {monitoring_plan.clinical.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="mb-2 text-sm font-bold uppercase text-gray-500">Laboratory Work</h4>
                            <ul className="space-y-2">
                                {monitoring_plan.labs.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-800">
                            <span className="font-bold">Schedule: </span>
                            {monitoring_plan.schedule}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        Evidence Sources
                    </h3>
                    <div className="space-y-3">
                        {evidence.map((source, i) => (
                            <div key={i} className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 transition-colors hover:bg-gray-100">
                                {source}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <div className="text-xs text-yellow-800">
                                <p className="font-bold">Medical Disclaimer</p>
                                <p className="mt-1">
                                    Simulation data is based on aggregated clinical trial results.
                                    Individual patient response may vary. Use as a decision-support tool only.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
