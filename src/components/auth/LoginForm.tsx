import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signInWithFacebook } from '../../auth/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ROUTES } from '../../routes';

export const LoginForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await signInWithEmail(email, password);
            if (error) throw error;
            navigate(ROUTES.HOME);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await signInWithFacebook();
            if (error) throw error;
            // Facebook OAuth will handle the redirect
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 p-6 bg-neutral-900 rounded-lg">
            <div>
                <img
                    src="/salty-logo-dark.png"
                    alt="Salty Offshore"
                    className="h-8 mx-auto"
                />
                <h2 className="mt-6 text-center text-display text-white">
                    Sign in to your account
                </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
                {error && (
                    <div className="rounded-md bg-red-900/50 p-4">
                        <div className="text-sm text-red-400">{error}</div>
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-neutral-900 text-white/60">
                        Or continue with
                    </span>
                </div>
            </div>

            <div>
                <Button
                    onClick={handleFacebookLogin}
                    disabled={loading}
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Continue with Facebook
                </Button>
            </div>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
                    className="text-sm text-white/60 hover:text-white"
                >
                    Don't have an account? Sign up
                </button>
            </div>
        </div>
    );
}; 