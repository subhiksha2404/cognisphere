import { RiskAssessmentForm, DiseaseRiskResult, RiskCalculationResults, RiskFactor } from './types';

// ============================================
// ALZHEIMER'S DISEASE RISK CALCULATION
// ============================================
function calculateAlzheimersRisk(data: RiskAssessmentForm): DiseaseRiskResult {
    let riskScore = 0;
    const riskFactors: RiskFactor[] = [];

    // Age factors
    if (data.age >= 75) {
        riskScore += 25;
        riskFactors.push({ factor: 'Age 75 or older', impact: 'High' });
    } else if (data.age >= 65) {
        riskScore += 15;
        riskFactors.push({ factor: 'Age 65-74', impact: 'Medium' });
    } else if (data.age >= 55) {
        riskScore += 8;
        riskFactors.push({ factor: 'Age 55-64', impact: 'Low' });
    }

    // MMSE Score
    if (data.mmse_score !== undefined) {
        if (data.mmse_score <= 20) {
            riskScore += 30;
            riskFactors.push({ factor: 'MMSE score ≤20 (severe cognitive impairment)', impact: 'High' });
        } else if (data.mmse_score <= 24) {
            riskScore += 20;
            riskFactors.push({ factor: 'MMSE score 21-24 (moderate impairment)', impact: 'High' });
        } else if (data.mmse_score <= 27) {
            riskScore += 8;
            riskFactors.push({ factor: 'MMSE score 25-27 (mild impairment)', impact: 'Medium' });
        }
    }

    // Family history
    if (data.family_history) {
        riskScore += 12;
        riskFactors.push({ factor: 'Family history of neurological disease', impact: 'Medium' });
    }

    // Memory complaints
    if (data.memory_complaints) {
        riskScore += 10;
        riskFactors.push({ factor: 'Memory complaints', impact: 'Medium' });
    }

    // Confusion
    if (data.confusion === 'Often') {
        riskScore += 15;
        riskFactors.push({ factor: 'Frequent confusion episodes', impact: 'High' });
    } else if (data.confusion === 'Sometimes') {
        riskScore += 8;
        riskFactors.push({ factor: 'Occasional confusion', impact: 'Medium' });
    }

    // Concentration difficulty
    if (data.concentration_difficulty) {
        riskScore += 8;
        riskFactors.push({ factor: 'Concentration difficulty', impact: 'Medium' });
    }

    // Sleep hours
    if (data.sleep_hours < 6) {
        riskScore += 7;
        riskFactors.push({ factor: 'Insufficient sleep (<6 hours)', impact: 'Medium' });
    } else if (data.sleep_hours >= 9) {
        riskScore += 5;
        riskFactors.push({ factor: 'Excessive sleep (≥9 hours)', impact: 'Low' });
    }

    // Physical activity
    if (data.physical_activity <= 2) {
        riskScore += 6;
        riskFactors.push({ factor: 'Low physical activity', impact: 'Medium' });
    }

    // Education
    if (data.education_years < 12) {
        riskScore += 5;
        riskFactors.push({ factor: 'Less than 12 years of education', impact: 'Low' });
    }

    // Depression
    if (data.depression) {
        riskScore += 7;
        riskFactors.push({ factor: 'History of depression', impact: 'Medium' });
    }

    // Hypertension
    if (data.hypertension) {
        riskScore += 5;
        riskFactors.push({ factor: 'Hypertension', impact: 'Low' });
    }

    // Diabetes
    if (data.diabetes) {
        riskScore += 6;
        riskFactors.push({ factor: 'Diabetes', impact: 'Medium' });
    }

    // Calculate probability and risk level
    const probability = Math.min(Math.round(riskScore * 0.9), 95);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
        probability >= 60 ? 'HIGH' : probability >= 35 ? 'MEDIUM' : 'LOW';
    const confidence = 75 + Math.min(riskFactors.length * 2, 20);

    return {
        disease: 'alzheimers',
        riskLevel,
        probability,
        confidence,
        riskFactors: riskFactors.slice(0, 5), // Top 5 factors
        recommendations: generateRecommendations('alzheimers', riskLevel, riskFactors)
    };
}

// ============================================
// PARKINSON'S DISEASE RISK CALCULATION
// ============================================
function calculateParkinsonsRisk(data: RiskAssessmentForm): DiseaseRiskResult {
    let riskScore = 0;
    const riskFactors: RiskFactor[] = [];

    // Motor symptoms (primary indicators)
    if (data.tremors) {
        riskScore += 20;
        riskFactors.push({ factor: 'Tremors present', impact: 'High' });
    }

    if (data.rigidity) {
        riskScore += 18;
        riskFactors.push({ factor: 'Muscle rigidity', impact: 'High' });
    }

    if (data.bradykinesia) {
        riskScore += 22;
        riskFactors.push({ factor: 'Bradykinesia (slow movement)', impact: 'High' });
    }

    if (data.postural_instability) {
        riskScore += 15;
        riskFactors.push({ factor: 'Postural instability', impact: 'High' });
    }

    // UPDRS Score
    if (data.updrs_score !== undefined) {
        if (data.updrs_score >= 30) {
            riskScore += 25;
            riskFactors.push({ factor: 'UPDRS score ≥30 (significant impairment)', impact: 'High' });
        } else if (data.updrs_score >= 15) {
            riskScore += 12;
            riskFactors.push({ factor: 'UPDRS score 15-29 (moderate impairment)', impact: 'Medium' });
        }
    }

    // Non-motor symptoms
    if (data.loss_of_smell) {
        riskScore += 10;
        riskFactors.push({ factor: 'Loss of smell', impact: 'Medium' });
    }

    if (data.sleep_disorders) {
        riskScore += 8;
        riskFactors.push({ factor: 'Sleep disorders', impact: 'Medium' });
    }

    if (data.constipation) {
        riskScore += 6;
        riskFactors.push({ factor: 'Chronic constipation', impact: 'Low' });
    }

    // Age
    if (data.age >= 65) {
        riskScore += 12;
        riskFactors.push({ factor: 'Age 65 or older', impact: 'Medium' });
    } else if (data.age >= 55) {
        riskScore += 6;
        riskFactors.push({ factor: 'Age 55-64', impact: 'Low' });
    }

    // Family history
    if (data.family_history) {
        riskScore += 10;
        riskFactors.push({ factor: 'Family history of neurological disease', impact: 'Medium' });
    }

    // Depression
    if (data.depression) {
        riskScore += 7;
        riskFactors.push({ factor: 'History of depression', impact: 'Low' });
    }

    // Gender (males slightly higher risk)
    if (data.gender === 'Male') {
        riskScore += 3;
    }

    const probability = Math.min(Math.round(riskScore * 0.85), 95);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
        probability >= 55 ? 'HIGH' : probability >= 30 ? 'MEDIUM' : 'LOW';
    const confidence = 80 + Math.min(riskFactors.length * 2, 18);

    return {
        disease: 'parkinsons',
        riskLevel,
        probability,
        confidence,
        riskFactors: riskFactors.slice(0, 5),
        recommendations: generateRecommendations('parkinsons', riskLevel, riskFactors)
    };
}

// ============================================
// EPILEPSY RISK CALCULATION
// ============================================
function calculateEpilepsyRisk(data: RiskAssessmentForm): DiseaseRiskResult {
    let riskScore = 0;
    const riskFactors: RiskFactor[] = [];

    // Seizure history (strongest indicator)
    if (data.seizure_history) {
        riskScore += 30;
        riskFactors.push({ factor: 'History of seizures', impact: 'High' });
    }

    // Seizure frequency
    if (data.frequency_seizures !== undefined) {
        if (data.frequency_seizures >= 4) {
            riskScore += 25;
            riskFactors.push({ factor: 'Frequent seizures (≥4 per month)', impact: 'High' });
        } else if (data.frequency_seizures >= 1) {
            riskScore += 15;
            riskFactors.push({ factor: 'Monthly seizures', impact: 'High' });
        }
    }

    // EEG abnormality
    if (data.eeg_abnormality) {
        riskScore += 20;
        riskFactors.push({ factor: 'EEG abnormalities detected', impact: 'High' });
    }

    // Head injury
    if (data.head_injury) {
        riskScore += 15;
        riskFactors.push({ factor: 'History of head injury', impact: 'High' });
    }

    // Family history
    if (data.family_history) {
        riskScore += 12;
        riskFactors.push({ factor: 'Family history of neurological disease', impact: 'Medium' });
    }

    // Sleep deprivation
    if (data.sleep_deprivation) {
        riskScore += 10;
        riskFactors.push({ factor: 'Chronic sleep deprivation', impact: 'Medium' });
    }

    // Stress level
    if (data.stress_level >= 4) {
        riskScore += 8;
        riskFactors.push({ factor: 'High stress levels', impact: 'Medium' });
    }

    // Medication adherence
    if (data.medication_adherence < 3) {
        riskScore += 12;
        riskFactors.push({ factor: 'Poor medication adherence', impact: 'Medium' });
    }

    const probability = Math.min(Math.round(riskScore * 0.9), 95);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
        probability >= 50 ? 'HIGH' : probability >= 25 ? 'MEDIUM' : 'LOW';
    const confidence = 85 + Math.min(riskFactors.length * 2, 12);

    return {
        disease: 'epilepsy',
        riskLevel,
        probability,
        confidence,
        riskFactors: riskFactors.slice(0, 5),
        recommendations: generateRecommendations('epilepsy', riskLevel, riskFactors)
    };
}

// ============================================
// HYPOXIA/STROKE RISK CALCULATION
// ============================================
function calculateHypoxiaRisk(data: RiskAssessmentForm): DiseaseRiskResult {
    let riskScore = 0;
    const riskFactors: RiskFactor[] = [];

    // Age
    if (data.age >= 70) {
        riskScore += 18;
        riskFactors.push({ factor: 'Age 70 or older', impact: 'High' });
    } else if (data.age >= 60) {
        riskScore += 12;
        riskFactors.push({ factor: 'Age 60-69', impact: 'Medium' });
    } else if (data.age >= 50) {
        riskScore += 6;
        riskFactors.push({ factor: 'Age 50-59', impact: 'Low' });
    }

    // Cardiovascular factors
    if (data.hypertension) {
        riskScore += 20;
        riskFactors.push({ factor: 'Hypertension', impact: 'High' });
    }

    if (data.heart_disease) {
        riskScore += 22;
        riskFactors.push({ factor: 'Heart disease', impact: 'High' });
    }

    if (data.cardiovascular_history) {
        riskScore += 18;
        riskFactors.push({ factor: 'Cardiovascular disease history', impact: 'High' });
    }

    if (data.sleep_apnea) {
        riskScore += 15;
        riskFactors.push({ factor: 'Sleep apnea', impact: 'High' });
    }

    // Glucose level
    if (data.glucose_level !== undefined) {
        if (data.glucose_level >= 126) {
            riskScore += 14;
            riskFactors.push({ factor: 'High glucose level (≥126 mg/dL)', impact: 'High' });
        } else if (data.glucose_level >= 100) {
            riskScore += 8;
            riskFactors.push({ factor: 'Elevated glucose level (100-125 mg/dL)', impact: 'Medium' });
        }
    }

    // BMI
    if (data.bmi >= 30) {
        riskScore += 12;
        riskFactors.push({ factor: 'Obesity (BMI ≥30)', impact: 'Medium' });
    } else if (data.bmi >= 25) {
        riskScore += 6;
        riskFactors.push({ factor: 'Overweight (BMI 25-29.9)', impact: 'Low' });
    }

    // Smoking
    if (data.smoking === 'Current') {
        riskScore += 16;
        riskFactors.push({ factor: 'Current smoker', impact: 'High' });
    } else if (data.smoking === 'Former') {
        riskScore += 8;
        riskFactors.push({ factor: 'Former smoker', impact: 'Medium' });
    }

    // Physical activity
    if (data.physical_activity <= 2) {
        riskScore += 8;
        riskFactors.push({ factor: 'Low physical activity', impact: 'Medium' });
    }

    const probability = Math.min(Math.round(riskScore * 0.8), 95);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
        probability >= 55 ? 'HIGH' : probability >= 30 ? 'MEDIUM' : 'LOW';
    const confidence = 72 + Math.min(riskFactors.length * 2, 20);

    return {
        disease: 'hypoxia',
        riskLevel,
        probability,
        confidence,
        riskFactors: riskFactors.slice(0, 5),
        recommendations: generateRecommendations('hypoxia', riskLevel, riskFactors)
    };
}

// ============================================
// RECOMMENDATIONS GENERATOR
// ============================================
function generateRecommendations(
    disease: string,
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH',
    riskFactors: RiskFactor[]
): string[] {
    const recommendations: string[] = [];

    // Universal recommendations
    if (riskLevel === 'HIGH') {
        recommendations.push('Consult a neurologist immediately for comprehensive evaluation');
        recommendations.push('Schedule cognitive and neurological testing as soon as possible');
    } else if (riskLevel === 'MEDIUM') {
        recommendations.push('Schedule an appointment with your primary care physician');
        recommendations.push('Consider neurological screening within the next 3-6 months');
    }

    // Disease-specific recommendations
    if (disease === 'alzheimers') {
        recommendations.push('Engage in regular cognitive exercises and brain training activities');
        recommendations.push('Maintain social connections and mentally stimulating activities');
        recommendations.push('Follow a Mediterranean or MIND diet rich in omega-3 fatty acids');
        if (riskFactors.some(f => f.factor.includes('sleep'))) {
            recommendations.push('Improve sleep hygiene and aim for 7-8 hours of quality sleep');
        }
    } else if (disease === 'parkinsons') {
        recommendations.push('Regular physical exercise, especially activities improving balance');
        recommendations.push('Monitor motor symptoms and keep a symptom diary');
        recommendations.push('Consider consultation with a movement disorder specialist');
    } else if (disease === 'epilepsy') {
        recommendations.push('Maintain consistent sleep schedule and avoid sleep deprivation');
        recommendations.push('Identify and avoid potential seizure triggers');
        recommendations.push('Ensure medication compliance if currently prescribed');
        recommendations.push('Avoid activities that could be dangerous during a seizure');
    } else if (disease === 'hypoxia') {
        recommendations.push('Monitor and manage blood pressure regularly');
        recommendations.push('Adopt heart-healthy lifestyle: exercise, balanced diet, stress management');
        recommendations.push('If you smoke, seek smoking cessation support immediately');
        recommendations.push('Regular cardiovascular health check-ups');
    }

    // Lifestyle recommendations based on risk factors
    const hasLifestyleFactors = riskFactors.some(f =>
        f.factor.includes('physical activity') ||
        f.factor.includes('BMI') ||
        f.factor.includes('smoking')
    );

    if (hasLifestyleFactors) {
        recommendations.push('Increase physical activity to at least 150 minutes per week');
        recommendations.push('Work with a nutritionist to develop a healthy eating plan');
    }

    return recommendations.slice(0, 6); // Return top 6 recommendations
}

// ============================================
// MASTER CALCULATION FUNCTION
// ============================================
export function calculateRiskScores(data: RiskAssessmentForm): RiskCalculationResults {
    return {
        alzheimers: calculateAlzheimersRisk(data),
        parkinsons: calculateParkinsonsRisk(data),
        epilepsy: calculateEpilepsyRisk(data),
        hypoxia: calculateHypoxiaRisk(data)
    };
}
