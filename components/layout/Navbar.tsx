'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Brain, User, LogOut, ArrowLeft } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            router.refresh();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const showBack = pathname !== '/';

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo & Back Button */}
                    <div className="flex items-center gap-4">
                        {showBack && (
                            <Link
                                href="/"
                                className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 hover:text-blue-600 transition-all"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        )}
                        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                            <Brain className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Cognisphere</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-4">
                            {/* Dashboard removed as requested */}
                            <Link href="/assessment" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition-all hover:shadow-md">
                                Assessment
                            </Link>
                            <Link href="/treatments" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition-all hover:shadow-md">
                                Treatments
                            </Link>
                            <Link href="/training" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition-all hover:shadow-md">
                                Training
                            </Link>
                            <Link href="/memory" className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm transition-all hover:shadow-md">
                                Memory Vault
                            </Link>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {!loading && (
                            user ? (
                                <div className="flex items-center gap-4">
                                    <span className="hidden text-sm font-medium text-gray-700 sm:block">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-red-600"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/auth"
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    <User className="h-4 w-4" />
                                    Sign In
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
