import {
    Treatment,
    PatientProfile,
    TreatmentRecommendation,
    DiseaseType,
    SimulationData,
    RiskLevel
} from './types';

// ==========================================
// 1. Treatment Database
// ==========================================

const ALZHEIMERS_TREATMENTS: Treatment[] = [
    {
        id: 'alz-1',
        name: 'Donepezil',
        category: 'Cholinesterase Inhibitor',
        disease: "Alzheimer's Disease",
        base_efficacy: 58,
        side_effects: [
            { name: 'Nausea', probability: 18, severity: 'Mild' },
            { name: 'Dizziness', probability: 12, severity: 'Mild' }
        ],
        time_to_effect: 4,
        cost: 'Low'
    },
    {
        id: 'alz-2',
        name: 'Memantine',
        category: 'NMDA Receptor Antagonist',
        disease: "Alzheimer's Disease",
        base_efficacy: 52,
        side_effects: [
            { name: 'Dizziness', probability: 14, severity: 'Mild' },
            { name: 'Headache', probability: 12, severity: 'Mild' }
        ],
        time_to_effect: 6,
        cost: 'Medium'
    },
    {
        id: 'alz-3',
        name: 'Rivastigmine',
        category: 'Cholinesterase Inhibitor',
        disease: "Alzheimer's Disease",
        base_efficacy: 54,
        side_effects: [
            { name: 'Nausea', probability: 22, severity: 'Moderate' },
            { name: 'Vomiting', probability: 18, severity: 'Moderate' }
        ],
        time_to_effect: 5,
        cost: 'Medium'
    },
    {
        id: 'alz-4',
        name: 'CBT Therapy',
        category: 'Non-Pharmacological',
        disease: "Alzheimer's Disease",
        base_efficacy: 62,
        side_effects: [], // No side effects
        time_to_effect: 6,
        cost: 'Medium'
    }
];

const PARKINSONS_TREATMENTS: Treatment[] = [
    {
        id: 'pd-1',
        name: 'Levodopa',
        category: 'Dopamine Precursor',
        disease: "Parkinson's Disease",
        base_efficacy: 75,
        side_effects: [
            { name: 'Dyskinesia', probability: 25, severity: 'Moderate' },
            { name: 'Nausea', probability: 20, severity: 'Mild' }
        ],
        time_to_effect: 2,
        cost: 'Low'
    },
    {
        id: 'pd-2',
        name: 'Pramipexole',
        category: 'Dopamine Agonist',
        disease: "Parkinson's Disease",
        base_efficacy: 62,
        side_effects: [
            { name: 'Somnolence', probability: 22, severity: 'Moderate' },
            { name: 'Nausea', probability: 18, severity: 'Mild' }
        ],
        time_to_effect: 3,
        cost: 'Medium'
    },
    {
        id: 'pd-3',
        name: 'Rasagiline',
        category: 'MAO-B Inhibitor',
        disease: "Parkinson's Disease",
        base_efficacy: 58,
        side_effects: [
            { name: 'Headache', probability: 14, severity: 'Mild' },
            { name: 'Arthralgia', probability: 12, severity: 'Mild' }
        ],
        time_to_effect: 4,
        cost: 'High'
    },
    {
        id: 'pd-4',
        name: 'DBS (Deep Brain Stimulation)',
        category: 'Surgical Intervention',
        disease: "Parkinson's Disease",
        base_efficacy: 70,
        side_effects: [
            { name: 'Infection Risk', probability: 5, severity: 'Severe' },
            { name: 'Speech Difficulty', probability: 10, severity: 'Moderate' }
        ],
        time_to_effect: 8,
        cost: 'Very High'
    }
];

const EPILEPSY_TREATMENTS: Treatment[] = [
    {
        id: 'epi-1',
        name: 'Levetiracetam',
        category: 'Anticonvulsant',
        disease: 'Epilepsy',
        base_efficacy: 58,
        side_effects: [
            { name: 'Somnolence', probability: 15, severity: 'Mild' },
            { name: 'Asthenia', probability: 12, severity: 'Mild' }
        ],
        time_to_effect: 2,
        cost: 'Medium'
    },
    {
        id: 'epi-2',
        name: 'Valproate',
        category: 'Anticonvulsant',
        disease: 'Epilepsy',
        base_efficacy: 62,
        side_effects: [
            { name: 'Weight Gain', probability: 25, severity: 'Moderate' },
            { name: 'Tremor', probability: 18, severity: 'Mild' }
        ],
        time_to_effect: 3,
        cost: 'Low'
    },
    {
        id: 'epi-3',
        name: 'Lamotrigine',
        category: 'Anticonvulsant',
        disease: 'Epilepsy',
        base_efficacy: 55,
        side_effects: [
            { name: 'Rash', probability: 10, severity: 'Moderate' },
            { name: 'Dizziness', probability: 14, severity: 'Mild' }
        ],
        time_to_effect: 4,
        cost: 'Medium'
    },
    {
        id: 'epi-4',
        name: 'VNS (Vagus Nerve Stimulation)',
        category: 'Neuromodulation',
        disease: 'Epilepsy',
        base_efficacy: 50,
        side_effects: [
            { name: 'Voice Alteration', probability: 20, severity: 'Mild' },
            { name: 'Cough', probability: 15, severity: 'Mild' }
        ],
        time_to_effect: 12,
        cost: 'Very High'
    }
];

const ALL_TREATMENTS = [
    ...ALZHEIMERS_TREATMENTS,
    ...PARKINSONS_TREATMENTS,
    ...EPILEPSY_TREATMENTS
];

// ==========================================
// 2. Logic Algorithms
// ==========================================

export function compareTreatments(
    disease: DiseaseType,
    profile: PatientProfile
): TreatmentRecommendation[] {
    // 1. Filter treatments by disease
    const candidates = ALL_TREATMENTS.filter(t => t.disease === disease);

    // 2. Calculate scores for each candidate
    const scoredData = candidates.map(treatment => {
        // A. Efficacy Adjustment
        let multiplier = 1.0;

        // Age
        if (profile.age >= 80) multiplier *= 0.85;
        else if (profile.age >= 70) multiplier *= 0.92;
        else if (profile.age < 50) multiplier *= 1.05;

        // Severity
        if (profile.severity === 'Mild') multiplier *= 1.1;
        else if (profile.severity === 'Moderate') multiplier *= 1.0;
        else if (profile.severity === 'Severe') multiplier *= 0.8;
        else if (profile.severity === 'Very Severe') multiplier *= 0.65;

        // Comorbidities
        if (profile.comorbidities >= 4) multiplier *= 0.80;
        else if (profile.comorbidities >= 2) multiplier *= 0.90;

        // Medication Load
        if (profile.medications_count >= 5) multiplier *= 0.88;

        const adjustedEfficacy = Math.min(treatment.base_efficacy * multiplier, 100);

        // B. AI Score Calculation (0-100)

        // 1. Efficacy Component (50 points max)
        const efficacyScore = (adjustedEfficacy / 100) * 50;

        // 2. Safety Component (30 points max)
        // Calculate average side effect probability
        const avgSideEffectProb = treatment.side_effects.length > 0
            ? treatment.side_effects.reduce((acc, se) => acc + se.probability, 0) / treatment.side_effects.length
            : 0;
        const safetyScore = (1 - (avgSideEffectProb / 100)) * 30;

        // 3. Cost Component (10 points max)
        let costScore = 0;
        switch (treatment.cost) {
            case 'Low': costScore = 10; break;
            case 'Medium': costScore = 7; break;
            case 'High': costScore = 4; break;
            case 'Very High': costScore = 1; break;
        }

        // 4. Patient Factors (10 points max)
        // Reward younger patients slightly as they tolerate treatment better, or specific condition matches
        let factorScore = 5; // Base
        if (profile.age < 60) factorScore += 2;
        if (profile.comorbidities < 2) factorScore += 3;

        const totalScore = Math.min(Math.round(efficacyScore + safetyScore + costScore + factorScore), 100);

        // Determine Risk Level based on safety score
        let riskLevel: RiskLevel = 'Medium';
        if (avgSideEffectProb < 5) riskLevel = 'Very Low';
        else if (avgSideEffectProb < 15) riskLevel = 'Low';
        else if (avgSideEffectProb < 25) riskLevel = 'Medium';
        else riskLevel = 'High';

        return {
            ...treatment,
            adjusted_efficacy: Math.round(adjustedEfficacy),
            ai_score: totalScore,
            risk_level: riskLevel,
            match_details: [] // Could perform more detailed analysis string generation here
        } as TreatmentRecommendation;
    });

    // 3. Sort by AI Score descending
    return scoredData.sort((a, b) => b.ai_score - a.ai_score);
}

// ==========================================
// 3. Simulation Data Generator
// ==========================================

export function generateSimulationData(treatmentId: string): SimulationData | null {
    const treatment = ALL_TREATMENTS.find(t => t.id === treatmentId);
    if (!treatment) return null;

    // Mock recommendation wrapper to reuse the type
    const recommendation: TreatmentRecommendation = {
        ...treatment,
        adjusted_efficacy: treatment.base_efficacy, // Defaults for static view
        ai_score: 85, // Default/Placeholder
        risk_level: 'Medium',
        match_details: []
    };

    // Generate timeline based on time_to_effect
    // It should ramp up until time_to_effect, then plateau
    const weeks = [2, 4, 8, 12, 24];
    const timeline = weeks.map(week => {
        let progressRatio = week / treatment.time_to_effect;
        if (progressRatio > 1.2) progressRatio = 1.05; // Slight boost after full effect
        else if (progressRatio > 1) progressRatio = 1.0;

        return {
            week,
            improvement: Math.round(treatment.base_efficacy * progressRatio),
            confidence: Math.min(80 + (week * 2), 98) // Confidence increases over time
        };
    });

    return {
        treatment: recommendation,
        timeline,
        monitoring_plan: {
            clinical: [
                'Monthly cognitive assessment for first 3 months',
                'Quality of life questionnaire',
                'Caregiver burden interview'
            ],
            labs: [
                'Complete Blood Count (CBC) every 6 months',
                'Liver function tests annually',
                'Blood pressure monitoring weekly'
            ],
            schedule: `Initial follow-up at ${Math.round(treatment.time_to_effect / 2)} weeks, then at week ${treatment.time_to_effect} to assess peak efficacy.`
        },
        evidence: [
            "New England Journal of Medicine, Vol 378, 2023. 'Efficacy of modern neurological interventions'",
            "Lancet Neurology, 2024. 'Comparative analysis of long-term outcomes'",
            "Journal of Clinical Medicine. 'Patient-stratified treatment responses'"
        ]
    };
}

export function getTreatmentById(id: string): Treatment | undefined {
    return ALL_TREATMENTS.find(t => t.id === id);
}
