import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from './supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    error: null,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // Check for current session
        const initializeAuth = async () => {
            try {
                const { user: currentUser, error: userError } = await getCurrentUser();
                if (userError) throw userError;
                setUser(currentUser);
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}; 