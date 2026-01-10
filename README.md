# Cognisphere - AI-Powered Cognitive Health Management Platform

## 🚀 Quick Start

### 1. Environment Setup ✅

The `.env.local` file has been created with your Supabase credentials:
- Project URL: `https://yegobnvfffygzhuvhrue.supabase.co`
- Publishable Key: Configured ✓

### 2. Database Setup (REQUIRED)

**IMPORTANT**: You need to run the SQL schema files in your Supabase dashboard to create the database tables.

#### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: `yegobnvfffygzhuvhrue`

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Schema File**
   - Copy the contents of `supabase/schema.sql`
   - Paste into the SQL editor
   - Click "Run" to execute
   - This creates all 6 tables (patients, risk_assessments, risk_results, treatment_simulations, cognitive_training_sessions, memory_vault)

4. **Run RLS Policies**
   - Create another new query
   - Copy the contents of `supabase/rls-policies.sql`
   - Paste and run
   - This sets up Row Level Security to protect user data

### 3. Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## 📋 Features Implemented

### Phase 1: Database Setup ✅
- Complete Supabase schema with 6 tables
- Row Level Security (RLS) policies
- Environment configuration

### Phase 2: Risk Assessment ✅
- Multi-step form (5 steps)
  - Demographics
  - Medical History
  - Lifestyle Factors
  - Symptoms
  - Clinical Test Scores
- Risk calculation engine for 4 diseases:
  - Alzheimer's Disease
  - Parkinson's Disease
  - Epilepsy
  - Hypoxia/Stroke
- Results display with:
  - Color-coded risk levels (HIGH/MEDIUM/LOW)
  - Probability percentages
  - Confidence scores
  - Identified risk factors
  - Personalized recommendations
- Professional, responsive UI design

## 🎯 How to Use

1. **Start Assessment**: Click "Begin Risk Assessment" on the landing page
2. **Complete 5 Steps**: Fill out all required information
3. **Submit**: Click "Submit Assessment" on the final step
4. **View Results**: See your risk analysis for all 4 diseases

## 🔒 Data Security

- All data is stored securely in Supabase
- Row Level Security ensures users can only access their own data
- Medical disclaimer displayed on all results pages

## 📊 Database Tables

1. **patients** - User profile data
2. **risk_assessments** - Assessment input data (40+ fields)
3. **risk_results** - Calculated risk scores
4. **treatment_simulations** - Treatment planning (future phase)
5. **cognitive_training_sessions** - Game performance (future phase)
6. **memory_vault** - Personal memories (future phase)

## 🚧 Future Phases

- **Phase 3**: Treatment Recommendation System
- **Phase 4**: Gamified Cognitive Training
- **Phase 5**: Memory Vault with AI Chat

## 📝 Notes

- The application works in demo mode without database connection
- For full functionality, complete the database setup steps above
- All risk calculations are based on published medical research
- This is for educational/screening purposes only - not a medical diagnosis

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI/ML**: Custom risk calculation algorithms
- **Icons**: Lucide React
- **Fonts**: Inter (via Next.js Font Optimization)
