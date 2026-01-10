import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <AuthForm />
        </div>
    );
}
