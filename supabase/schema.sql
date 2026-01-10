-- Cognisphere Database Schema
-- Complete schema for all 6 tables with proper relationships and indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PATIENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER CHECK (age >= 18 AND age <= 120),
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_patients_email ON patients(email);

-- ============================================
-- 2. RISK ASSESSMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Demographics
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 120),
    gender TEXT NOT NULL,
    education_years INTEGER CHECK (education_years >= 0 AND education_years <= 30),
    
    -- Medical History
    family_history BOOLEAN DEFAULT FALSE,
    hypertension BOOLEAN DEFAULT FALSE,
    diabetes BOOLEAN DEFAULT FALSE,
    depression BOOLEAN DEFAULT FALSE,
    heart_disease BOOLEAN DEFAULT FALSE,
    cardiovascular_history BOOLEAN DEFAULT FALSE,
    head_injury BOOLEAN DEFAULT FALSE,
    seizure_history BOOLEAN DEFAULT FALSE,
    sleep_apnea BOOLEAN DEFAULT FALSE,
    
    -- Lifestyle Factors
    smoking TEXT CHECK (smoking IN ('Never', 'Former', 'Current')),
    alcohol_consumption TEXT CHECK (alcohol_consumption IN ('None', 'Light', 'Moderate', 'Heavy')),
    physical_activity INTEGER CHECK (physical_activity >= 1 AND physical_activity <= 5),
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    bmi DECIMAL(4,1) CHECK (bmi >= 10 AND bmi <= 60),
    glucose_level DECIMAL(5,1),
    
    -- Cognitive & Neurological Symptoms
    memory_complaints BOOLEAN DEFAULT FALSE,
    confusion TEXT CHECK (confusion IN ('Never', 'Rarely', 'Sometimes', 'Often')),
    concentration_difficulty BOOLEAN DEFAULT FALSE,
    
    -- Parkinson's Specific Symptoms
    tremors BOOLEAN DEFAULT FALSE,
    rigidity BOOLEAN DEFAULT FALSE,
    bradykinesia BOOLEAN DEFAULT FALSE,
    postural_instability BOOLEAN DEFAULT FALSE,
    balance_problems BOOLEAN DEFAULT FALSE,
    loss_of_smell BOOLEAN DEFAULT FALSE,
    
    -- Other Symptoms
    sleep_disorders BOOLEAN DEFAULT FALSE,
    constipation BOOLEAN DEFAULT FALSE,
    sleep_deprivation BOOLEAN DEFAULT FALSE,
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    eeg_abnormality BOOLEAN DEFAULT FALSE,
    
    -- Clinical Test Scores (Optional)
    mmse_score INTEGER CHECK (mmse_score >= 0 AND mmse_score <= 30),
    updrs_score INTEGER CHECK (updrs_score >= 0 AND updrs_score <= 199),
    frequency_seizures INTEGER CHECK (frequency_seizures >= 0),
    medication_adherence INTEGER CHECK (medication_adherence >= 1 AND medication_adherence <= 5),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_risk_assessments_patient ON risk_assessments(patient_id);
CREATE INDEX idx_risk_assessments_date ON risk_assessments(assessment_date DESC);

-- ============================================
-- 3. RISK RESULTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS risk_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES risk_assessments(id) ON DELETE CASCADE,
    disease TEXT NOT NULL CHECK (disease IN ('alzheimers', 'parkinsons', 'epilepsy', 'hypoxia')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    probability INTEGER NOT NULL CHECK (probability >= 0 AND probability <= 100),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    risk_factors JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_risk_results_assessment ON risk_results(assessment_id);
CREATE INDEX idx_risk_results_disease ON risk_results(disease);

-- ============================================
-- 4. TREATMENT SIMULATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS treatment_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    disease TEXT NOT NULL,
    treatment_id TEXT NOT NULL,
    treatment_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    severity TEXT CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Very Severe')),
    comorbidities INTEGER DEFAULT 0,
    current_medications INTEGER DEFAULT 0,
    adjusted_efficacy INTEGER CHECK (adjusted_efficacy >= 0 AND adjusted_efficacy <= 100),
    timeline JSONB DEFAULT '{}'::jsonb,
    side_effects JSONB DEFAULT '[]'::jsonb,
    monitoring_plan JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_treatment_simulations_patient ON treatment_simulations(patient_id);
CREATE INDEX idx_treatment_simulations_disease ON treatment_simulations(disease);

-- ============================================
-- 5. COGNITIVE TRAINING SESSIONS TABLE
-- ============================================
-- ============================================
-- 5. COGNITIVE TRAINING SESSIONS TABLE (UPDATED FOR CLINICAL TRACKING)
-- ============================================
-- Note: 'score' and 'time_taken' are less emphasized now but kept for backend tracking.
CREATE TABLE IF NOT EXISTS cognitive_training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    score INTEGER NOT NULL,
    time_taken INTEGER NOT NULL, -- in seconds
    accuracy DECIMAL(5,2) CHECK (accuracy >= 0 AND accuracy <= 100),
    
    -- New Clinical Fields
    disease_type TEXT CHECK (disease_type IN ('Alzheimers', 'Parkinsons', 'Epilepsy', 'Brain Injury')),
    cognitive_domain TEXT, -- e.g. "Working Memory", "Executive Function"
    fatigue_reported BOOLEAN DEFAULT FALSE,
    performance_trend TEXT, -- "Stable", "Improved", "Declined"
    
    session_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cognitive_sessions_patient ON cognitive_training_sessions(patient_id);
CREATE INDEX idx_cognitive_sessions_date ON cognitive_training_sessions(session_date DESC);
CREATE INDEX idx_cognitive_sessions_game ON cognitive_training_sessions(game_type);

-- ============================================
-- 6. MEMORY VAULT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS memory_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    category TEXT,
    notes TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_memory_vault_patient ON memory_vault(patient_id);
CREATE INDEX idx_memory_vault_date ON memory_vault(date DESC);
CREATE INDEX idx_memory_vault_category ON memory_vault(category);

-- ============================================
-- 7. WELLNESS CHECKINS TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS wellness_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    checkin_type TEXT CHECK (checkin_type IN ('Pre-Session', 'Post-Session')),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5), -- 1=Calm, 5=High Stress
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5), -- 1=Exhausted, 5=Energetic
    feeling_tired BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wellness_patient ON wellness_checkins(patient_id);

-- ============================================
-- TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memory_vault_updated_at 
    BEFORE UPDATE ON memory_vault 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

