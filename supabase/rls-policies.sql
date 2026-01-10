-- Row Level Security (RLS) Policies for Cognisphere
-- Ensures users can only access their own data

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_vault ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PATIENTS TABLE POLICIES
-- ============================================
-- Users can view their own patient record
CREATE POLICY "Users can view own patient record"
    ON patients FOR SELECT
    USING (auth.uid() = id);

-- Users can insert their own patient record
CREATE POLICY "Users can insert own patient record"
    ON patients FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own patient record
CREATE POLICY "Users can update own patient record"
    ON patients FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- RISK ASSESSMENTS TABLE POLICIES
-- ============================================
-- Users can view their own assessments
CREATE POLICY "Users can view own assessments"
    ON risk_assessments FOR SELECT
    USING (auth.uid() = patient_id);

-- Users can insert their own assessments
CREATE POLICY "Users can insert own assessments"
    ON risk_assessments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Users can update their own assessments
CREATE POLICY "Users can update own assessments"
    ON risk_assessments FOR UPDATE
    USING (auth.uid() = patient_id);

-- Users can delete their own assessments
CREATE POLICY "Users can delete own assessments"
    ON risk_assessments FOR DELETE
    USING (auth.uid() = patient_id);

-- ============================================
-- RISK RESULTS TABLE POLICIES
-- ============================================
-- Users can view their own risk results
CREATE POLICY "Users can view own risk results"
    ON risk_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM risk_assessments
            WHERE risk_assessments.id = risk_results.assessment_id
            AND risk_assessments.patient_id = auth.uid()
        )
    );

-- Users can insert their own risk results
CREATE POLICY "Users can insert own risk results"
    ON risk_results FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM risk_assessments
            WHERE risk_assessments.id = risk_results.assessment_id
            AND risk_assessments.patient_id = auth.uid()
        )
    );

-- ============================================
-- TREATMENT SIMULATIONS TABLE POLICIES
-- ============================================
-- Users can view their own treatment simulations
CREATE POLICY "Users can view own treatment simulations"
    ON treatment_simulations FOR SELECT
    USING (auth.uid() = patient_id);

-- Users can insert their own treatment simulations
CREATE POLICY "Users can insert own treatment simulations"
    ON treatment_simulations FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Users can update their own treatment simulations
CREATE POLICY "Users can update own treatment simulations"
    ON treatment_simulations FOR UPDATE
    USING (auth.uid() = patient_id);

-- Users can delete their own treatment simulations
CREATE POLICY "Users can delete own treatment simulations"
    ON treatment_simulations FOR DELETE
    USING (auth.uid() = patient_id);

-- ============================================
-- COGNITIVE TRAINING SESSIONS TABLE POLICIES
-- ============================================
-- Users can view their own training sessions
CREATE POLICY "Users can view own training sessions"
    ON cognitive_training_sessions FOR SELECT
    USING (auth.uid() = patient_id);

-- Users can insert their own training sessions
CREATE POLICY "Users can insert own training sessions"
    ON cognitive_training_sessions FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- ============================================
-- MEMORY VAULT TABLE POLICIES
-- ============================================
-- Users can view their own memories
CREATE POLICY "Users can view own memories"
    ON memory_vault FOR SELECT
    USING (auth.uid() = patient_id);

-- Users can insert their own memories
CREATE POLICY "Users can insert own memories"
    ON memory_vault FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Users can update their own memories
CREATE POLICY "Users can update own memories"
    ON memory_vault FOR UPDATE
    USING (auth.uid() = patient_id);

-- Users can delete their own memories
CREATE POLICY "Users can delete own memories"
    ON memory_vault FOR DELETE
    USING (auth.uid() = patient_id);
