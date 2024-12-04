import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, supabase } from '../../auth/supabase';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ROUTES } from '../../routes';

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
                // Create user preferences with name
                const { error: prefError } = await supabase
                    .from('user_preferences')
                    .insert([
                        {
                            id: data.user.id,
                            name,
                            map_preferences: {},
                            last_selected_region: null,
                        },
                    ]);

                if (prefError) throw prefError;
            }

            navigate(ROUTES.AUTH.VERIFY_EMAIL);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error during sign up');
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
                    Create your account
                </h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="rounded-md bg-red-900/50 p-4">
                        <div className="text-sm text-red-400">{error}</div>
                    </div>
                )}

                <Input
                    label="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    helperText="This is how we'll address you in the app."
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

                <div>
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                        className="text-sm text-white/60 hover:text-white"
                    >
                        Already have an account? Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}; 