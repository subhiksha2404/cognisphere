# 🚀 Supabase Database Setup Guide

## Quick Setup (5 minutes)

Follow these steps to set up your Cognisphere database in Supabase:

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. You should see your project: **yegobnvfffygzhuvhrue**
4. Click on it to open the project dashboard

### Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"**
2. Click the **"New Query"** button (top right)

### Step 3: Create Database Tables

1. **Copy the entire contents** of the file: `supabase/schema.sql`
   - You can open it in VS Code or any text editor
   - Select all (Ctrl+A) and copy (Ctrl+C)

2. **Paste** into the SQL Editor in Supabase

3. Click the **"Run"** button (or press Ctrl+Enter)

4. You should see a success message: **"Success. No rows returned"**

5. **Verify tables were created:**
   - Click on **"Table Editor"** in the left sidebar
   - You should now see 6 tables:
     - ✅ patients
     - ✅ risk_assessments
     - ✅ risk_results
     - ✅ treatment_simulations
     - ✅ cognitive_training_sessions
     - ✅ memory_vault

### Step 4: Enable Row Level Security

1. Go back to **"SQL Editor"**
2. Click **"New Query"** again
3. **Copy the entire contents** of: `supabase/rls-policies.sql`
4. **Paste** into the SQL Editor
5. Click **"Run"**
6. You should see: **"Success. No rows returned"**

### Step 5: Test the Application

1. Go to http://localhost:3000
2. Click **"Begin Risk Assessment"**
3. Fill out the form and submit
4. You should now see your results AND the data will be saved to Supabase!

---

## ✅ Verification Checklist

After completing the setup:

- [ ] All 6 tables appear in Table Editor
- [ ] RLS is enabled on all tables (you'll see a shield icon 🛡️)
- [ ] Assessment form submits without errors
- [ ] Data appears in the `risk_assessments` table after submission
- [ ] Results are saved in the `risk_results` table

---

## 🔧 Troubleshooting

### Error: "relation does not exist"
**Solution:** You haven't run the schema.sql file yet. Go back to Step 3.

### Error: "permission denied"
**Solution:** You haven't run the rls-policies.sql file yet. Go back to Step 4.

### Tables created but no data is saved
**Solution:** Check the browser console for errors. Make sure RLS policies are enabled.

### Still getting errors?
**Temporary workaround:** The app works in **demo mode** without the database. You can still test all features - the data just won't be persisted.

---

## 📊 What Gets Stored

When you submit an assessment, the following data is saved:

1. **risk_assessments table:**
   - All your form inputs (demographics, medical history, lifestyle, symptoms, clinical scores)
   - Timestamp of when you took the assessment

2. **risk_results table:**
   - Risk levels for all 4 diseases (HIGH/MEDIUM/LOW)
   - Probability percentages
   - Confidence scores
   - Identified risk factors
   - Personalized recommendations

---

## 🎯 Next Steps After Setup

Once the database is set up, you can:

1. **Take multiple assessments** - Track changes over time
2. **View assessment history** - See all your past assessments (future feature)
3. **Export data** - Download your health data (future feature)
4. **Share with doctors** - Export PDF reports to share with healthcare providers

---

## 💡 Pro Tip

You can view your saved data in Supabase:
1. Go to **Table Editor**
2. Click on **risk_assessments** to see all assessments
3. Click on **risk_results** to see calculated risk scores

This is useful for verifying the data is being saved correctly!
