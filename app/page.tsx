import Link from 'next/link';
import { Brain, Activity, Target, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      {/* Navigation removed - moved to Global Layout */}

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI-Powered Cognitive Health
            <span className="block text-blue-600">Management Platform</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Advanced neurological risk assessment, treatment planning, and cognitive rehabilitation
            for Alzheimer's, Parkinson's, Epilepsy, and Hypoxia-related conditions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              Begin Risk Assessment
            </Link>
            <a
              href="#features"
              className="rounded-lg border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Core Features</h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive tools for neurological health management
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <Link href="/assessment" className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-blue-300 cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              AI Risk Assessment
            </h3>
            <p className="mt-3 text-gray-600">
              Machine learning-powered risk evaluation for 4 major neurological disorders with 75-85% accuracy.
            </p>
          </Link>

          {/* Feature 2 - Linked to Treatment Recommendations */}
          <Link href="/treatments" className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-green-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Treatment Planning
            </h3>
            <p className="mt-3 text-gray-600">
              Evidence-based treatment recommendations with efficacy simulation and outcome prediction.
            </p>
          </Link>

          {/* Feature 3 */}
          <Link href="/training" className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-purple-300 cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Cognitive Training
            </h3>
            <p className="mt-3 text-gray-600">
              Gamified brain exercises tailored to specific conditions with progress tracking.
            </p>
          </Link>

          {/* Feature 4 */}
          <Link href="/memory" className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-teal-300 cursor-pointer">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-900">
              Memory Vault
            </h3>
            <p className="mt-3 text-gray-600">
              Secure storage for cognitive milestones with AI-powered memory chat assistant.
            </p>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-green-600 px-12 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to assess your neurological health?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Take our comprehensive AI-powered risk assessment in just 5 minutes.
          </p>
          <Link
            href="/assessment"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
          >
            Start Free Assessment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-center text-sm text-gray-600">
            © 2026 Cognisphere. This platform is for educational and screening purposes only.
            Always consult with qualified healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

