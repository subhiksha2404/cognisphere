// TypeScript type definitions for Cognisphere

// ============================================
// FORM DATA TYPES
// ============================================
export interface RiskAssessmentForm {
    // Demographics
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    education_years: number;

    // Medical History
    family_history: boolean;
    hypertension: boolean;
    diabetes: boolean;
    depression: boolean;
    heart_disease: boolean;
    cardiovascular_history: boolean;
    head_injury: boolean;
    seizure_history: boolean;
    sleep_apnea: boolean;

    // Lifestyle
    smoking: 'Never' | 'Former' | 'Current';
    alcohol_consumption: 'None' | 'Light' | 'Moderate' | 'Heavy';
    physical_activity: number; // 1-5
    sleep_hours: number;
    bmi: number;
    glucose_level?: number;

    // Symptoms
    memory_complaints: boolean;
    confusion: 'Never' | 'Rarely' | 'Sometimes' | 'Often';
    concentration_difficulty: boolean;
    tremors: boolean;
    rigidity: boolean;
    bradykinesia: boolean;
    postural_instability: boolean;
    balance_problems: boolean;
    loss_of_smell: boolean;
    sleep_disorders: boolean;
    constipation: boolean;
    sleep_deprivation: boolean;
    stress_level: number; // 1-5
    eeg_abnormality: boolean;

    // Clinical Scores (Optional)
    mmse_score?: number;
    updrs_score?: number;
    frequency_seizures?: number;
    medication_adherence: number; // 1-5
}

// ============================================
// RISK CALCULATION TYPES
// ============================================
export interface RiskFactor {
    factor: string;
    impact: 'High' | 'Medium' | 'Low';
}

export interface DiseaseRiskResult {
    disease: 'alzheimers' | 'parkinsons' | 'epilepsy' | 'hypoxia';
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    probability: number; // 0-100
    confidence: number; // 0-100
    riskFactors: RiskFactor[];
    recommendations: string[];
}

export interface RiskCalculationResults {
    alzheimers: DiseaseRiskResult;
    parkinsons: DiseaseRiskResult;
    epilepsy: DiseaseRiskResult;
    hypoxia: DiseaseRiskResult;
}

// ============================================
// DATABASE TABLE TYPES
// ============================================
export interface Patient {
    id: string;
    email: string;
    name: string;
    age: number;
    gender: string;
    created_at: string;
}

export interface RiskAssessment extends RiskAssessmentForm {
    id: string;
    patient_id: string;
    assessment_date: string;
    created_at: string;
}

export interface RiskResult {
    id: string;
    assessment_id: string;
    disease: 'alzheimers' | 'parkinsons' | 'epilepsy' | 'hypoxia';
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    probability: number;
    confidence: number;
    risk_factors: RiskFactor[];
    recommendations: string[];
    created_at: string;
}

export interface TreatmentSimulation {
    id: string;
    patient_id: string;
    disease: string;
    treatment_id: string;
    treatment_name: string;
    age: number;
    severity: 'Mild' | 'Moderate' | 'Severe';
    comorbidities: number;
    current_medications: number;
    adjusted_efficacy: number;
    timeline: Record<string, any>;
    side_effects: any[];
    monitoring_plan: any[];
    created_at: string;
}

export interface CognitiveTrainingSession {
    id: string;
    patient_id: string;
    game_type: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken: number;
    accuracy: number;
    session_date: string;
}

export interface MemoryVaultEntry {
    id: string;
    patient_id: string;
    title: string;
    date: string;
    category: string;
    notes: string;
    tags: string[];
    photo_url?: string;
    created_at: string;
    updated_at: string;
}


// Phase 3: Treatment Recommendation System Types

export type DiseaseType = "Alzheimer's Disease" | "Parkinson's Disease" | "Epilepsy";
export type DiseaseSeverity = 'Mild' | 'Moderate' | 'Severe' | 'Very Severe';
export type CostTier = 'Low' | 'Medium' | 'High' | 'Very High';
export type RiskLevel = 'Very Low' | 'Low' | 'Medium' | 'High';

export interface PatientProfile {
    age: number;
    disease: DiseaseType;
    severity: DiseaseSeverity;
    comorbidities: number;
    medications_count: number;
}

export interface SideEffect {
    name: string;
    probability: number; // percentage 0-100
    severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface Treatment {
    id: string;
    name: string;
    category: string; // e.g., "Cholinesterase Inhibitor", "Dopamine Agonist"
    disease: DiseaseType;
    base_efficacy: number; // percentage 0-100
    side_effects: SideEffect[];
    time_to_effect: number; // weeks
    cost: CostTier;
    description?: string;
}

export interface TreatmentRecommendation extends Treatment {
    adjusted_efficacy: number;
    ai_score: number;
    risk_level: RiskLevel;
    match_details: string[]; // Reasons for the score
}

// For the simulation view
export interface TimelinePoint {
    week: number;
    improvement: number; // percentage
    confidence: number; // percentage
}

export interface SimulationData {
    treatment: TreatmentRecommendation;
    timeline: TimelinePoint[];
    monitoring_plan: {
        clinical: string[];
        labs: string[];
        schedule: string;
    };
    evidence?: string[];
}

// Phase 4: Cognitive Training Types (Updated for Clinical)

export type GameType = 'memory_match' | 'sequence_recall' | 'pattern_recognition' | 'word_association';
export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ClinicalDiseaseType = 'Alzheimers' | 'Parkinsons' | 'Epilepsy' | 'Brain Injury';

export interface GameSession {
    id?: string;
    patient_id?: string;
    game_type: GameType;
    difficulty: GameDifficulty;
    score: number;
    time_taken: number;
    accuracy: number;
    // New Clinical Fields
    disease_type?: ClinicalDiseaseType;
    cognitive_domain?: string;
    fatigue_reported?: boolean;
    performance_trend?: string;
    session_date?: string;
}

export interface WellnessCheckin {
    id?: string;
    patient_id?: string;
    checkin_type: 'Pre-Session' | 'Post-Session';
    stress_level: number;
    energy_level: number;
    feeling_tired: boolean;
    created_at?: string;
}

export interface GameStats {
    totalSessions: number;
    averageScore: number;
    highestScore: number;
    streak: number;
}


// Phase 5: Memory Vault Types

export type MemoryCategory = 'Family Event' | 'Achievement' | 'Travel' | 'Medical' | 'Other';

export type Memory = MemoryVaultEntry; // Alias for convenience

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}
