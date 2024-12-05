import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, supabase } from '../../auth/supabase';
import { ROUTES } from '../../routes';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const SignUpForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error: signUpError } = await signUpWithEmail(email, password);
            if (signUpError) throw signUpError;

            if (data.user) {
                const { error: prefError } = await supabase
                    .from('user_preferences')
                    .insert([
                        {
                            id: data.user.id,
                            name: name || null,
                            map_preferences: {},
                            last_selected_region: null,
                        },
                    ]);

                if (prefError) throw prefError;
            }

            navigate(ROUTES.HOME);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error during sign up');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900">
            <div className="w-full max-w-md mx-auto px-6 py-8 md:py-16">
                <div className="mb-8">
                    <img
                        src="/salty-logo-dark.png"
                        alt="Salty Offshore"
                        className="h-7 mx-auto mb-8 md:h-8"
                    />
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-md bg-red-900/50 p-4">
                            <div className="text-sm text-red-400">{error}</div>
                        </div>
                    )}

                    <Input
                        label="Name"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                    />

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
                        helperText="Must be at least 6 characters."
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>

                <div className="my-2 text-center">
                    <span className="text-neutral-200 text-sm">or</span>
                </div>

                <div className="space-y-3">
                    <button
                        type="button"
                        className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                        Continue with Facebook
                    </button>

                    <button
                        type="button"
                        className="w-full bg-black text-white font-medium py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors border border-neutral-800"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        Sign in with Apple
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                        className="text-sm text-white hover:text-white/80 transition-colors"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}; 